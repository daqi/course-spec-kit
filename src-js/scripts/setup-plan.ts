#!/usr/bin/env node

import path from "path";
import fs from "fs/promises";
import { getFeaturePaths, checkFeatureBranch } from "../utils/feature.js";
import { ensureDir, copyFileIfExists } from "../utils/files.js";

interface SetupPlanOptions {
  json?: boolean;
}

async function main() {
  const args = process.argv.slice(2);
  const options: SetupPlanOptions = {
    json: args.includes("--json"),
  };

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`Usage: setup-plan [--json]
  --json    Output results in JSON format
  --help    Show this help message`);
    process.exit(0);
  }

  try {
    const paths = await getFeaturePaths();

    // Check feature branch validity
    if (!checkFeatureBranch(paths.CURRENT_BRANCH, paths.HAS_GIT)) {
      process.exit(1);
    }

    // Ensure the feature directory exists
    await ensureDir(paths.FEATURE_DIR);

    // Copy plan template if it exists
    const template = path.join(paths.REPO_ROOT, ".specify", "templates", "plan-template.md");
    const copied = await copyFileIfExists(template, paths.IMPL_PLAN);

    if (copied) {
      console.log(`Copied plan template to ${paths.IMPL_PLAN}`);
    } else {
      console.log(`Warning: Plan template not found at ${template}`);
      // Create a basic plan file if template doesn't exist
      await fs.writeFile(paths.IMPL_PLAN, "");
    }

    // Output results
    if (options.json) {
      console.log(
        JSON.stringify({
          FEATURE_SPEC: paths.FEATURE_SPEC,
          IMPL_PLAN: paths.IMPL_PLAN,
          SPECS_DIR: paths.FEATURE_DIR,
          BRANCH: paths.CURRENT_BRANCH,
          HAS_GIT: paths.HAS_GIT.toString(),
        })
      );
    } else {
      console.log(`FEATURE_SPEC: ${paths.FEATURE_SPEC}`);
      console.log(`IMPL_PLAN: ${paths.IMPL_PLAN}`);
      console.log(`SPECS_DIR: ${paths.FEATURE_DIR}`);
      console.log(`BRANCH: ${paths.CURRENT_BRANCH}`);
      console.log(`HAS_GIT: ${paths.HAS_GIT}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
