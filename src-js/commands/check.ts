import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { AGENT_CONFIG } from "../config.js";
import { checkTool } from "../utils/system.js";

/**
 * Check all installed tools
 */
export async function checkCommand(): Promise<void> {
  console.log(chalk.cyan("\n=== System Requirements Check ===\n"));

  // Check git
  console.log(chalk.bold("Required Tools:"));
  const gitInstalled = await checkTool("git");
  console.log(
    gitInstalled
      ? chalk.green("  ✓ git")
      : chalk.red("  ✗ git") + chalk.dim(" (install from: https://git-scm.com/)")
  );

  if (!gitInstalled) {
    console.log(chalk.dim("Tip: Install git for repository management"));
  }

  // Check AI agents
  console.log(chalk.bold("\nAI Assistants:"));
  const agentResults: Record<string, boolean> = {};

  for (const [key, config] of Object.entries(AGENT_CONFIG)) {
    if (config.requires_cli) {
      const installed = await checkTool(key);
      agentResults[key] = installed;

      const statusSymbol = installed ? chalk.green("✓") : chalk.red("✗");
      const installInfo = config.install_url
        ? chalk.dim(` (install from: ${config.install_url})`)
        : "";

      console.log(`  ${statusSymbol} ${config.name}${!installed ? installInfo : ""}`);
    }
  }

  const anyAgentInstalled = Object.values(agentResults).some((v) => v);
  if (!anyAgentInstalled) {
    console.log(chalk.dim("\nTip: Install an AI assistant for the best experience"));
  }

  console.log();
}

/**
 * Select AI assistant interactively or validate provided one
 */
export async function selectAIAssistant(providedAI?: string): Promise<string> {
  const options = Object.entries(AGENT_CONFIG).map(([key, config]) => ({
    value: key,
    name: `${config.name}${config.folder ? ` (${config.folder})` : ""}`,
  }));

  if (providedAI) {
    if (AGENT_CONFIG[providedAI]) {
      return providedAI;
    }
    console.error(chalk.red(`Error: Invalid AI assistant: ${providedAI}`));
    console.error(
      chalk.yellow(`Valid options: ${Object.keys(AGENT_CONFIG).join(", ")}`)
    );
    process.exit(1);
  }

  const answer = await select({
    message: "Select AI assistant:",
    choices: options,
    default: "copilot",
  });

  return answer;
}

/**
 * Select script type interactively or validate provided one
 */
export async function selectScriptType(providedScript?: string): Promise<string> {
  const options = [
    { value: "sh", name: "Bash/Zsh (sh)" },
    { value: "ps", name: "PowerShell (ps)" },
  ];

  if (providedScript) {
    if (["sh", "ps"].includes(providedScript)) {
      return providedScript;
    }
    console.error(chalk.red(`Error: Invalid script type: ${providedScript}`));
    console.error(chalk.yellow("Valid options: sh, ps"));
    process.exit(1);
  }

  const answer = await select({
    message: "Select script type:",
    choices: options,
    default: "sh",
  });

  return answer;
}
