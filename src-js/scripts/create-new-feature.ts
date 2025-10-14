#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import fs from "fs/promises";
import { getRepoRoot, hasGit } from "../utils/feature.js";
import { fileExists, ensureDir, copyFileIfExists } from "../utils/files.js";

interface CreateFeatureOptions {
  json?: boolean;
}

/**
 * Find the repository root by searching for existing project markers
 */
async function findRepoRoot(startDir: string): Promise<string | null> {
  let dir = startDir;
  while (dir !== "/") {
    try {
      const gitExists = await fileExists(path.join(dir, ".git"));
      const specifyExists = await fileExists(path.join(dir, ".specify"));
      if (gitExists || specifyExists) {
        return dir;
      }
    } catch {
      // Continue searching
    }
    dir = path.dirname(dir);
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const options: CreateFeatureOptions = {
    json: args.includes("--json"),
  };

  // Filter out flags to get feature description
  const featureArgs = args.filter((arg) => !arg.startsWith("--"));
  const featureDescription = featureArgs.join(" ");

  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: create-new-feature [--json] <feature_description>");
    process.exit(0);
  }

  if (!featureDescription) {
    console.error("Usage: create-new-feature [--json] <feature_description>");
    process.exit(1);
  }

  try {
    // Resolve repository root
    let repoRoot: string;
    const hasGitRepo = hasGit();

    if (hasGitRepo) {
      repoRoot = await getRepoRoot();
    } else {
      const found = await findRepoRoot(process.cwd());
      if (!found) {
        console.error(
          "Error: Could not determine repository root. Please run this script from within the repository."
        );
        process.exit(1);
      }
      repoRoot = found;
    }

    const specsDir = path.join(repoRoot, "specs");
    await ensureDir(specsDir);

    // Find highest feature number
    let highest = 0;
    try {
      const entries = await fs.readdir(specsDir);
      for (const entry of entries) {
        const fullPath = path.join(specsDir, entry);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          const match = entry.match(/^(\d+)/);
          if (match) {
            const number = parseInt(match[1], 10);
            if (number > highest) {
              highest = number;
            }
          }
        }
      }
    } catch {
      // Directory doesn't exist or can't be read
    }

    const next = highest + 1;
    const featureNum = next.toString().padStart(3, "0");

    // Create branch name from description
    const branchName = featureDescription
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Take first 3 words
    const words = branchName
      .split("-")
      .filter((w) => w.length > 0)
      .slice(0, 3)
      .join("-");

    const finalBranchName = `${featureNum}-${words}`;

    // Create git branch if git is available
    if (hasGitRepo) {
      try {
        execSync(`git checkout -b ${finalBranchName}`, {
          cwd: repoRoot,
          stdio: ["pipe", "pipe", "pipe"],
        });
      } catch (error) {
        console.error(`Error creating git branch: ${error}`);
        process.exit(1);
      }
    } else {
      console.error(
        `[specify] Warning: Git repository not detected; skipped branch creation for ${finalBranchName}`
      );
    }

    // Create feature directory
    const featureDir = path.join(specsDir, finalBranchName);
    await ensureDir(featureDir);

    // Copy template
    const template = path.join(repoRoot, ".specify", "templates", "spec-template.md");
    const specFile = path.join(featureDir, "spec.md");

    const copied = await copyFileIfExists(template, specFile);
    if (!copied) {
      // Create empty spec file if template doesn't exist
      await fs.writeFile(specFile, "");
    }

    // Set environment variable (note: only affects this process)
    process.env.SPECIFY_FEATURE = finalBranchName;

    // Output results
    if (options.json) {
      console.log(
        JSON.stringify({
          BRANCH_NAME: finalBranchName,
          SPEC_FILE: specFile,
          FEATURE_NUM: featureNum,
        })
      );
    } else {
      console.log(`BRANCH_NAME: ${finalBranchName}`);
      console.log(`SPEC_FILE: ${specFile}`);
      console.log(`FEATURE_NUM: ${featureNum}`);
      console.log(`SPECIFY_FEATURE environment variable set to: ${finalBranchName}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
