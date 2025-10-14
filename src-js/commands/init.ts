import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import ora from "ora";
import { AGENT_CONFIG } from "../config.js";
import { selectAIAssistant, selectScriptType } from "./check.js";
import { downloadAndExtractTemplate } from "../utils/download.js";
import { checkTool, isGitRepo, initGitRepo, ensureExecutableScripts } from "../utils/system.js";
import { StepTracker } from "../utils/tracker.js";

export interface InitOptions {
  ai?: string;
  script?: string;
  ignoreAgentTools?: boolean;
  noGit?: boolean;
  here?: boolean;
  force?: boolean;
  skipTls?: boolean;
  debug?: boolean;
  githubToken?: string;
}

/**
 * Initialize a new Specify project
 */
export async function initCommand(
  projectName: string | undefined,
  options: InitOptions
): Promise<void> {
  // Validate project name/path
  let projectPath: string;
  let isCurrentDir = false;

  if (options.here || projectName === ".") {
    projectPath = process.cwd();
    isCurrentDir = true;
  } else if (projectName) {
    projectPath = path.resolve(projectName);
  } else {
    console.error(chalk.red("Error: Project name is required when not using --here or '.'"));
    process.exit(1);
  }

  // Check if directory exists and is not empty
  if (isCurrentDir) {
    try {
      const files = await fs.readdir(projectPath);
      if (files.length > 0 && !options.force) {
        const proceed = await confirm({
          message: chalk.yellow(
            "Current directory is not empty. Files will be merged/overwritten. Continue?"
          ),
          default: false,
        });

        if (!proceed) {
          console.log(chalk.yellow("Initialization cancelled."));
          process.exit(0);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
      console.error(chalk.red("Error: Cannot access current directory"));
      process.exit(1);
    }
  } else {
    try {
      await fs.access(projectPath);
      console.error(chalk.red(`Error: Directory ${projectPath} already exists`));
      process.exit(1);
    } catch {
      // Directory doesn't exist, which is what we want
      await fs.mkdir(projectPath, { recursive: true });
    }
  }

  // Select AI assistant and script type
  const selectedAi = await selectAIAssistant(options.ai);
  const selectedScript = await selectScriptType(options.script);

  console.log(chalk.cyan(`Selected AI assistant: ${selectedAi}`));
  console.log(chalk.cyan(`Selected script type: ${selectedScript}`));

  // Check for agent CLI tools if needed
  if (!options.ignoreAgentTools) {
    const agentConfig = AGENT_CONFIG[selectedAi];
    if (agentConfig.requires_cli) {
      const toolInstalled = await checkTool(selectedAi);
      if (!toolInstalled) {
        console.error(
          chalk.red(
            `Error: ${agentConfig.name} CLI is required for ${selectedAi} projects`
          )
        );
        if (agentConfig.install_url) {
          console.error(chalk.yellow(`Install from: ${agentConfig.install_url}`));
        }
        process.exit(1);
      }
    }
  }

  // Initialize progress tracker
  const tracker = new StepTracker("Initialize Specify Project");

  tracker.add("precheck", "Check required tools");
  tracker.complete("precheck", "ok");

  tracker.add("ai-select", "Select AI assistant");
  tracker.complete("ai-select", selectedAi);

  tracker.add("script-select", "Select script type");
  tracker.complete("script-select", selectedScript);

  tracker.add("fetch", "Fetch latest release");
  tracker.add("download", "Download template");
  tracker.add("extract", "Extract template");
  tracker.add("chmod", "Ensure scripts executable");
  tracker.add("git", "Initialize git repository");
  tracker.add("cleanup", "Cleanup");
  tracker.add("final", "Finalize");

  try {
    // Download and extract template
    tracker.start("fetch");
    tracker.start("download");
    tracker.start("extract");

    await downloadAndExtractTemplate(projectPath, selectedAi, selectedScript, options.githubToken);

    tracker.complete("fetch", "ok");
    tracker.complete("download", "ok");
    tracker.complete("extract", "ok");

    // Ensure scripts are executable
    tracker.start("chmod");
    await ensureExecutableScripts(projectPath);
    tracker.complete("chmod", "ok");

    // Initialize git repository
    if (!options.noGit) {
      tracker.start("git");
      const gitExists = await isGitRepo(projectPath);

      if (gitExists) {
        tracker.complete("git", "existing repo detected");
      } else {
        const gitAvailable = await checkTool("git");
        if (gitAvailable) {
          const result = await initGitRepo(projectPath);
          if (result.success) {
            tracker.complete("git", "initialized");
          } else {
            tracker.error("git", "init failed");
            console.error(chalk.red(`Git error: ${result.error}`));
          }
        } else {
          tracker.skip("git", "git not available");
        }
      }
    } else {
      tracker.skip("git", "skipped by user");
    }

    // Cleanup
    tracker.start("cleanup");
    tracker.complete("cleanup", "ok");

    // Final
    tracker.start("final");
    tracker.complete("final", "ok");

    // Success message
    console.log();
    console.log(chalk.green.bold("✓ Project initialized successfully!"));
    console.log();
    console.log(chalk.cyan("Next steps:"));
    console.log(chalk.white(`  cd ${isCurrentDir ? "." : path.basename(projectPath)}`));
    console.log(chalk.white("  # Start your AI coding assistant"));
    console.log(
      chalk.white(
        "  # Use /speckit.constitution, /speckit.specify, /speckit.plan, /speckit.tasks, /speckit.implement"
      )
    );
    console.log();

    // Agent folder security notice
    const agentConfig = AGENT_CONFIG[selectedAi];
    if (agentConfig.folder && agentConfig.folder !== ".github/") {
      console.log(chalk.yellow("⚠️  Security Notice:"));
      console.log(
        chalk.yellow(
          `Some AI agents may store credentials in ${agentConfig.folder}. Consider adding it to .gitignore.`
        )
      );
      console.log();
    }
  } catch (error) {
    tracker.error("final", "failed");
    console.error();
    console.error(chalk.red("Error during initialization:"));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}
