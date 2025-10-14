/**
 * Agent configuration with name, folder, install URL, and CLI tool requirement
 */
export interface AgentConfig {
  name: string;
  folder: string;
  install_url: string | null;
  requires_cli: boolean;
}

export const AGENT_CONFIG: Record<string, AgentConfig> = {
  copilot: {
    name: "GitHub Copilot",
    folder: ".github/",
    install_url: null, // IDE-based, no CLI check needed
    requires_cli: false,
  },
  claude: {
    name: "Claude Code",
    folder: ".claude/",
    install_url: "https://docs.anthropic.com/en/docs/claude-code/setup",
    requires_cli: true,
  },
  gemini: {
    name: "Gemini CLI",
    folder: ".gemini/",
    install_url: "https://github.com/google-gemini/gemini-cli",
    requires_cli: true,
  },
  "cursor-agent": {
    name: "Cursor",
    folder: ".cursor/",
    install_url: null, // IDE-based
    requires_cli: false,
  },
  qwen: {
    name: "Qwen Code",
    folder: ".qwen/",
    install_url: "https://github.com/QwenLM/qwen-code",
    requires_cli: true,
  },
  opencode: {
    name: "opencode",
    folder: ".opencode/",
    install_url: "https://opencode.ai",
    requires_cli: true,
  },
  codex: {
    name: "Codex CLI",
    folder: ".codex/",
    install_url: "https://github.com/openai/codex",
    requires_cli: true,
  },
  windsurf: {
    name: "Windsurf",
    folder: ".windsurf/",
    install_url: null, // IDE-based
    requires_cli: false,
  },
  kilocode: {
    name: "Kilo Code",
    folder: ".kilocode/",
    install_url: null, // IDE-based
    requires_cli: false,
  },
  auggie: {
    name: "Auggie CLI",
    folder: ".augment/",
    install_url: "https://docs.augmentcode.com/cli/overview",
    requires_cli: true,
  },
  roo: {
    name: "Roo Code",
    folder: ".roo/",
    install_url: null, // IDE-based
    requires_cli: false,
  },
  codebuddy: {
    name: "CodeBuddy",
    folder: ".codebuddy/",
    install_url: "https://www.codebuddy.ai/",
    requires_cli: true,
  },
  q: {
    name: "Amazon Q Developer CLI",
    folder: ".amazonq/",
    install_url: "https://aws.amazon.com/developer/learning/q-developer-cli/",
    requires_cli: true,
  },
};

export const BANNER = `
 ██████╗ ██████╗ ██╗   ██╗██████╗ ███████╗███████╗
██╔════╝██╔═══██╗██║   ██║██╔══██╗██╔════╝██╔════╝
██║     ██║   ██║██║   ██║██████╔╝███████╗█████╗  
██║     ██║   ██║██║   ██║██╔══██╗╚════██║██╔══╝  
╚██████╗╚██████╔╝╚██████╔╝██║  ██║███████║███████╗
 ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝`;

export const TAGLINE = "Course Spec Kit - Spec-Driven Course Development Toolkit";

export const GITHUB_REPO_OWNER = "daqi";
export const GITHUB_REPO_NAME = "course-spec-kit";
