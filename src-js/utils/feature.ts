import { execSync } from "child_process";
import path from "path";
import fs from "fs/promises";

/**
 * Get repository root, with fallback for non-git repositories
 */
export async function getRepoRoot(): Promise<string> {
  try {
    // Try git first
    const root = execSync("git rev-parse --show-toplevel", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
    return root;
  } catch {
    // Fall back to current working directory for non-git repos
    return process.cwd();
  }
}

/**
 * Get current branch, with fallback for non-git repositories
 */
export async function getCurrentBranch(repoRoot: string): Promise<string> {
  // First check if SPECIFY_FEATURE environment variable is set
  if (process.env.SPECIFY_FEATURE) {
    return process.env.SPECIFY_FEATURE;
  }

  // Then check git if available
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
    return branch;
  } catch {
    // For non-git repos, try to find the latest feature directory
    const specsDir = path.join(repoRoot, "specs");
    try {
      const entries = await fs.readdir(specsDir);
      let latestFeature = "";
      let highest = 0;

      for (const entry of entries) {
        const fullPath = path.join(specsDir, entry);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          const match = entry.match(/^(\d{3})-/);
          if (match) {
            const number = parseInt(match[1], 10);
            if (number > highest) {
              highest = number;
              latestFeature = entry;
            }
          }
        }
      }

      if (latestFeature) {
        return latestFeature;
      }
    } catch {
      // Specs directory doesn't exist or can't be read
    }

    // Final fallback
    return "main";
  }
}

/**
 * Check if we have git available
 */
export function hasGit(): boolean {
  try {
    execSync("git rev-parse --show-toplevel", {
      stdio: ["pipe", "pipe", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if branch is a valid feature branch (only for git repos)
 */
export function checkFeatureBranch(branch: string, hasGitRepo: boolean): boolean {
  // For non-git repos, we can't enforce branch naming but still allow operation
  if (!hasGitRepo) {
    console.warn("[specify] Warning: Git repository not detected; skipped branch validation");
    return true;
  }

  if (!/^\d{3}-/.test(branch)) {
    console.error(`ERROR: Not on a feature branch. Current branch: ${branch}`);
    console.error("Feature branches should be named like: 001-feature-name");
    return false;
  }

  return true;
}

/**
 * Get feature directory path
 */
export function getFeatureDir(repoRoot: string, branch: string): string {
  return path.join(repoRoot, "specs", branch);
}

/**
 * Get all feature paths
 */
export interface FeaturePaths {
  REPO_ROOT: string;
  CURRENT_BRANCH: string;
  HAS_GIT: boolean;
  FEATURE_DIR: string;
  FEATURE_SPEC: string;
  IMPL_PLAN: string;
  TASKS: string;
  RESEARCH: string;
  DATA_MODEL: string;
  QUICKSTART: string;
  CONTRACTS_DIR: string;
}

export async function getFeaturePaths(): Promise<FeaturePaths> {
  const repoRoot = await getRepoRoot();
  const currentBranch = await getCurrentBranch(repoRoot);
  const hasGitRepo = hasGit();
  const featureDir = getFeatureDir(repoRoot, currentBranch);

  return {
    REPO_ROOT: repoRoot,
    CURRENT_BRANCH: currentBranch,
    HAS_GIT: hasGitRepo,
    FEATURE_DIR: featureDir,
    FEATURE_SPEC: path.join(featureDir, "spec.md"),
    IMPL_PLAN: path.join(featureDir, "plan.md"),
    TASKS: path.join(featureDir, "tasks.md"),
    RESEARCH: path.join(featureDir, "research.md"),
    DATA_MODEL: path.join(featureDir, "data-model.md"),
    QUICKSTART: path.join(featureDir, "quickstart.md"),
    CONTRACTS_DIR: path.join(featureDir, "contracts"),
  };
}
