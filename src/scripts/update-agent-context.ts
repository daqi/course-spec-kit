#!/usr/bin/env node

import path from "path";
import fs from "fs/promises";
import { getFeaturePaths, checkFeatureBranch } from "../utils/feature.js";
import { fileExists, ensureDir } from "../utils/files.js";

interface AgentFileConfig {
  path: string;
  name: string;
}

const AGENT_FILES: Record<string, AgentFileConfig> = {
  claude: { path: "CLAUDE.md", name: "Claude Code" },
  gemini: { path: "GEMINI.md", name: "Gemini CLI" },
  copilot: { path: ".github/copilot-instructions.md", name: "GitHub Copilot" },
  "cursor-agent": { path: ".cursor/rules/specify-rules.mdc", name: "Cursor IDE" },
  qwen: { path: "QWEN.md", name: "Qwen Code" },
  opencode: { path: "OPENCODE.md", name: "opencode" },
  codex: { path: "CODEX.md", name: "Codex CLI" },
  windsurf: { path: ".windsurf/rules/specify-rules.md", name: "Windsurf" },
  kilocode: { path: ".kilocode/rules/specify-rules.md", name: "Kilo Code" },
  auggie: { path: ".augment/rules/specify-rules.md", name: "Auggie CLI" },
  roo: { path: ".roo/rules/specify-rules.md", name: "Roo Code" },
  codebuddy: { path: ".codebuddy/rules/specify-rules.md", name: "CodeBuddy" },
  q: { path: ".amazonq/prompts/agents-instructions.md", name: "Amazon Q Developer" },
};

interface PlanData {
  language?: string;
  framework?: string;
  database?: string;
  projectType?: string;
}

/**
 * Extract field from plan.md
 */
async function extractPlanField(field: string, planFile: string): Promise<string> {
  try {
    const content = await fs.readFile(planFile, "utf-8");
    const regex = new RegExp(`^\\*\\*${field}\\*\\*:\\s*(.+)$`, "m");
    const match = content.match(regex);
    if (match && match[1]) {
      const value = match[1].trim();
      if (value && value !== "NEEDS CLARIFICATION" && value !== "N/A") {
        return value;
      }
    }
  } catch {
    // Ignore errors
  }
  return "";
}

/**
 * Parse plan data from plan.md
 */
async function parsePlanData(planFile: string): Promise<PlanData> {
  const language = await extractPlanField("Language/Version", planFile);
  const framework = await extractPlanField("Primary Dependencies", planFile);
  const database = await extractPlanField("Storage", planFile);
  const projectType = await extractPlanField("Project Type", planFile);

  return { language, framework, database, projectType };
}

/**
 * Get project structure based on project type
 */
function getProjectStructure(projectType?: string): string {
  if (projectType && projectType.toLowerCase().includes("web")) {
    return "backend/\nfrontend/\ntests/";
  }
  return "src/\ntests/";
}

/**
 * Get build/test commands for language
 */
function getCommandsForLanguage(language?: string): string {
  if (!language) return "# Add commands here";

  if (language.includes("Python")) {
    return "cd src && pytest && ruff check .";
  } else if (language.includes("Rust")) {
    return "cargo test && cargo clippy";
  } else if (language.includes("JavaScript") || language.includes("TypeScript")) {
    return "npm test && npm run lint";
  }

  return `# Add commands for ${language}`;
}

/**
 * Get language conventions
 */
function getLanguageConventions(language?: string): string {
  return language ? `${language}: Follow standard conventions` : "General: Follow standard conventions";
}

/**
 * Format technology stack
 */
function formatTechnologyStack(language?: string, framework?: string): string {
  const parts: string[] = [];
  if (language) parts.push(language);
  if (framework) parts.push(framework);
  return parts.join(" + ");
}

/**
 * Create new agent file from template
 */
async function createNewAgentFile(
  targetFile: string,
  projectName: string,
  currentDate: string,
  planData: PlanData,
  currentBranch: string,
  templateFile: string
): Promise<boolean> {
  try {
    if (!(await fileExists(templateFile))) {
      console.error(`Template not found at ${templateFile}`);
      return false;
    }

    let content = await fs.readFile(templateFile, "utf-8");

    const projectStructure = getProjectStructure(planData.projectType);
    const commands = getCommandsForLanguage(planData.language);
    const languageConventions = getLanguageConventions(planData.language);

    const techStack = formatTechnologyStack(planData.language, planData.framework);
    const techStackEntry = techStack ? `- ${techStack} (${currentBranch})` : `- (${currentBranch})`;

    const recentChange = techStack
      ? `- ${currentBranch}: Added ${techStack}`
      : `- ${currentBranch}: Added`;

    // Replace template placeholders
    content = content
      .replace(/\[PROJECT NAME\]/g, projectName)
      .replace(/\[DATE\]/g, currentDate)
      .replace(/\[EXTRACTED FROM ALL PLAN\.MD FILES\]/g, techStackEntry)
      .replace(/\[ACTUAL STRUCTURE FROM PLANS\]/g, projectStructure)
      .replace(/\[ONLY COMMANDS FOR ACTIVE TECHNOLOGIES\]/g, commands)
      .replace(/\[LANGUAGE-SPECIFIC, ONLY FOR LANGUAGES IN USE\]/g, languageConventions)
      .replace(/\[LAST 3 FEATURES AND WHAT THEY ADDED\]/g, recentChange);

    // Ensure directory exists
    const targetDir = path.dirname(targetFile);
    await ensureDir(targetDir);

    await fs.writeFile(targetFile, content, "utf-8");
    return true;
  } catch (error) {
    console.error(`Failed to create agent file: ${error}`);
    return false;
  }
}

/**
 * Update existing agent file
 */
async function updateExistingAgentFile(
  targetFile: string,
  currentDate: string,
  planData: PlanData,
  currentBranch: string
): Promise<boolean> {
  try {
    let content = await fs.readFile(targetFile, "utf-8");

    const techStack = formatTechnologyStack(planData.language, planData.framework);

    // Update technology stack section
    if (techStack && !content.includes(techStack)) {
      const techStackMarker = "## Technology Stack";
      if (content.includes(techStackMarker)) {
        const entry = `- ${techStack} (${currentBranch})`;
        content = content.replace(
          techStackMarker,
          `${techStackMarker}\n\n${entry}`
        );
      }
    }

    // Update recent changes section
    const recentChange = techStack
      ? `- ${currentBranch}: Added ${techStack}`
      : `- ${currentBranch}: Added`;

    const recentChangesMarker = "## Recent Changes";
    if (content.includes(recentChangesMarker)) {
      content = content.replace(
        recentChangesMarker,
        `${recentChangesMarker}\n\n${recentChange}`
      );
    }

    // Update last updated date
    const dateRegex = /Last Updated: \d{4}-\d{2}-\d{2}/;
    content = content.replace(dateRegex, `Last Updated: ${currentDate}`);

    await fs.writeFile(targetFile, content, "utf-8");
    return true;
  } catch (error) {
    console.error(`Failed to update agent file: ${error}`);
    return false;
  }
}

/**
 * Update specific agent file
 */
async function updateAgentFile(
  agentKey: string,
  repoRoot: string,
  planData: PlanData,
  currentBranch: string
): Promise<boolean> {
  const config = AGENT_FILES[agentKey];
  if (!config) {
    console.error(`Unknown agent type: ${agentKey}`);
    return false;
  }

  const targetFile = path.join(repoRoot, config.path);
  const projectName = path.basename(repoRoot);
  const currentDate = new Date().toISOString().split("T")[0];
  const templateFile = path.join(repoRoot, ".specify", "templates", "agent-template.md");

  console.log(`Updating ${config.name} context file: ${targetFile}`);

  if (await fileExists(targetFile)) {
    // Update existing file
    const success = await updateExistingAgentFile(targetFile, currentDate, planData, currentBranch);
    if (success) {
      console.log(`✓ Updated existing ${config.name} context file`);
    } else {
      console.error(`✗ Failed to update ${config.name} context file`);
    }
    return success;
  } else {
    // Create new file from template
    const success = await createNewAgentFile(
      targetFile,
      projectName,
      currentDate,
      planData,
      currentBranch,
      templateFile
    );
    if (success) {
      console.log(`✓ Created new ${config.name} context file`);
    } else {
      console.error(`✗ Failed to create ${config.name} context file`);
    }
    return success;
  }
}

/**
 * Update all existing agent files
 */
async function updateAllExistingAgents(
  repoRoot: string,
  planData: PlanData,
  currentBranch: string
): Promise<boolean> {
  let anyFound = false;
  let allSuccess = true;

  for (const [agentKey, config] of Object.entries(AGENT_FILES)) {
    const targetFile = path.join(repoRoot, config.path);
    if (await fileExists(targetFile)) {
      anyFound = true;
      const success = await updateAgentFile(agentKey, repoRoot, planData, currentBranch);
      if (!success) {
        allSuccess = false;
      }
    }
  }

  // If no agent files exist, create a default Claude file
  if (!anyFound) {
    console.log("No agent files found, creating default Claude file...");
    const success = await updateAgentFile("claude", repoRoot, planData, currentBranch);
    return success;
  }

  return allSuccess;
}

async function main() {
  const args = process.argv.slice(2);
  const agentType = args[0];

  try {
    const paths = await getFeaturePaths();

    // Check feature branch validity
    if (!checkFeatureBranch(paths.CURRENT_BRANCH, paths.HAS_GIT)) {
      process.exit(1);
    }

    console.log(`=== Updating agent context files for feature ${paths.CURRENT_BRANCH} ===`);

    // Check if plan.md exists
    if (!(await fileExists(paths.IMPL_PLAN))) {
      console.error(`ERROR: No plan.md found at ${paths.IMPL_PLAN}`);
      console.error("Make sure you're working on a feature with a corresponding spec directory");
      process.exit(1);
    }

    // Parse plan data
    const planData = await parsePlanData(paths.IMPL_PLAN);

    let success: boolean;

    if (agentType) {
      // Update specific agent
      console.log(`Updating specific agent: ${agentType}`);
      success = await updateAgentFile(agentType, paths.REPO_ROOT, planData, paths.CURRENT_BRANCH);
    } else {
      // Update all existing agent files
      console.log("No agent specified, updating all existing agent files...");
      success = await updateAllExistingAgents(paths.REPO_ROOT, planData, paths.CURRENT_BRANCH);
    }

    // Print summary
    console.log("");
    if (planData.language) {
      console.log(`  - Added language: ${planData.language}`);
    }
    if (planData.framework) {
      console.log(`  - Added framework: ${planData.framework}`);
    }
    if (planData.database && planData.database !== "N/A") {
      console.log(`  - Added database: ${planData.database}`);
    }

    if (success) {
      console.log("\n✓ Agent context update completed successfully");
      process.exit(0);
    } else {
      console.error("\n✗ Agent context update completed with errors");
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
