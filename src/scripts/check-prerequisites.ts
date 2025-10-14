#!/usr/bin/env node

import { getFeaturePaths, checkFeatureBranch } from "../utils/feature.js";
import { fileExists, dirExistsAndNotEmpty, checkFile, checkDir } from "../utils/files.js";

interface CheckPrerequisitesOptions {
  json?: boolean;
  requireTasks?: boolean;
  includeTasks?: boolean;
  pathsOnly?: boolean;
}

async function main() {
  const args = process.argv.slice(2);
  const options: CheckPrerequisitesOptions = {
    json: args.includes("--json"),
    requireTasks: args.includes("--require-tasks"),
    includeTasks: args.includes("--include-tasks"),
    pathsOnly: args.includes("--paths-only"),
  };

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`Usage: check-prerequisites [OPTIONS]

Consolidated prerequisite checking for Spec-Driven Development workflow.

OPTIONS:
  --json              Output in JSON format
  --require-tasks     Require tasks.md to exist (for implementation phase)
  --include-tasks     Include tasks.md in AVAILABLE_DOCS list
  --paths-only        Only output path variables (no prerequisite validation)
  --help, -h          Show this help message

EXAMPLES:
  # Check task prerequisites (plan.md required)
  check-prerequisites --json
  
  # Check implementation prerequisites (plan.md + tasks.md required)
  check-prerequisites --json --require-tasks --include-tasks
  
  # Get feature paths only (no validation)
  check-prerequisites --paths-only
`);
    process.exit(0);
  }

  try {
    const paths = await getFeaturePaths();

    // Check feature branch validity
    if (!checkFeatureBranch(paths.CURRENT_BRANCH, paths.HAS_GIT)) {
      process.exit(1);
    }

    // If paths-only mode, output paths and exit
    if (options.pathsOnly) {
      if (options.json) {
        console.log(
          JSON.stringify({
            REPO_ROOT: paths.REPO_ROOT,
            BRANCH: paths.CURRENT_BRANCH,
            FEATURE_DIR: paths.FEATURE_DIR,
            FEATURE_SPEC: paths.FEATURE_SPEC,
            IMPL_PLAN: paths.IMPL_PLAN,
            TASKS: paths.TASKS,
          })
        );
      } else {
        console.log(`REPO_ROOT: ${paths.REPO_ROOT}`);
        console.log(`BRANCH: ${paths.CURRENT_BRANCH}`);
        console.log(`FEATURE_DIR: ${paths.FEATURE_DIR}`);
        console.log(`FEATURE_SPEC: ${paths.FEATURE_SPEC}`);
        console.log(`IMPL_PLAN: ${paths.IMPL_PLAN}`);
        console.log(`TASKS: ${paths.TASKS}`);
      }
      process.exit(0);
    }

    // Validate required directories and files
    if (!(await fileExists(paths.FEATURE_DIR))) {
      console.error(`ERROR: Feature directory not found: ${paths.FEATURE_DIR}`);
      console.error("Run /course.specify first to create the feature structure.");
      process.exit(1);
    }

    if (!(await fileExists(paths.IMPL_PLAN))) {
      console.error(`ERROR: plan.md not found in ${paths.FEATURE_DIR}`);
      console.error("Run /course.plan first to create the implementation plan.");
      process.exit(1);
    }

    // Check for tasks.md if required
    if (options.requireTasks && !(await fileExists(paths.TASKS))) {
      console.error(`ERROR: tasks.md not found in ${paths.FEATURE_DIR}`);
      console.error("Run /course.tasks first to create the task list.");
      process.exit(1);
    }

    // Build list of available documents
    const docs: string[] = [];

    if (await fileExists(paths.RESEARCH)) {
      docs.push("research.md");
    }
    if (await fileExists(paths.DATA_MODEL)) {
      docs.push("data-model.md");
    }
    if (await dirExistsAndNotEmpty(paths.CONTRACTS_DIR)) {
      docs.push("contracts/");
    }
    if (await fileExists(paths.QUICKSTART)) {
      docs.push("quickstart.md");
    }
    if (options.includeTasks && (await fileExists(paths.TASKS))) {
      docs.push("tasks.md");
    }

    // Output results
    if (options.json) {
      console.log(
        JSON.stringify({
          FEATURE_DIR: paths.FEATURE_DIR,
          AVAILABLE_DOCS: docs,
        })
      );
    } else {
      console.log(`FEATURE_DIR:${paths.FEATURE_DIR}`);
      console.log("AVAILABLE_DOCS:");

      console.log(await checkFile(paths.RESEARCH, "research.md"));
      console.log(await checkFile(paths.DATA_MODEL, "data-model.md"));
      console.log(await checkDir(paths.CONTRACTS_DIR, "contracts/"));
      console.log(await checkFile(paths.QUICKSTART, "quickstart.md"));

      if (options.includeTasks) {
        console.log(await checkFile(paths.TASKS, "tasks.md"));
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
