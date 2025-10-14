#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { BANNER, TAGLINE } from "./config.js";
import { checkCommand } from "./commands/check.js";
import { initCommand } from "./commands/init.js";

const program = new Command();

/**
 * Show banner
 */
function showBanner(): void {
  const bannerLines = BANNER.trim().split("\n");
  const colors = [
    chalk.blue,
    chalk.blue,
    chalk.cyan,
    chalk.cyan,
    chalk.white,
    chalk.white,
  ];

  console.log();
  bannerLines.forEach((line, i) => {
    console.log(colors[i % colors.length](line));
  });
  console.log(chalk.yellow.italic(`\n${TAGLINE}\n`));
}

// Override help to show banner first
const originalHelp = program.helpInformation.bind(program);
program.helpInformation = function () {
  showBanner();
  return originalHelp();
};

program
  .name("course-specify")
  .description("Setup tool for Specify spec-driven course development projects")
  .version("0.0.23");

// Check command
program
  .command("check")
  .description("Check that all required tools are installed")
  .action(async () => {
    try {
      await checkCommand();
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

// Init command
program
  .command("init [project-name]")
  .description("Initialize a new Specify project from the latest template")
  .option(
    "--ai <assistant>",
    "AI assistant to use: claude, gemini, copilot, cursor-agent, qwen, opencode, codex, windsurf, kilocode, auggie, roo, codebuddy, or q"
  )
  .option("--ignore-agent-tools", "Skip checks for AI agent tools like Claude Code")
  .option("--no-git", "Skip git repository initialization")
  .option("--here", "Initialize project in the current directory instead of creating a new one")
  .option(
    "--force",
    "Force merge/overwrite when initializing in current directory (skip confirmation)"
  )
  .option("--skip-tls", "Skip SSL/TLS verification (not recommended)")
  .option("--debug", "Enable detailed debug output for troubleshooting")
  .option(
    "--github-token <token>",
    "GitHub token for API requests (or set GH_TOKEN/GITHUB_TOKEN env variable)"
  )
  .action(async (projectName, options) => {
    try {
      await initCommand(projectName, options);
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

// Show banner when no command is provided
program.action(() => {
  showBanner();
  console.log(chalk.gray("Run 'course-specify --help' for usage information\n"));
});

// Parse arguments
program.parse();
