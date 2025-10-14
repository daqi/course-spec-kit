import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import os from "os";

const execAsync = promisify(exec);

/**
 * Check if a tool is available in the system PATH
 */
export async function checkTool(tool: string): Promise<boolean> {
  // Special handling for Claude CLI after `claude migrate-installer`
  if (tool === "claude") {
    const claudeLocalPath = path.join(os.homedir(), ".claude", "local", "claude");
    try {
      await fs.access(claudeLocalPath, fs.constants.X_OK);
      return true;
    } catch {
      // Fall through to normal check
    }
  }

  try {
    const command = process.platform === "win32" ? "where" : "which";
    await execAsync(`${command} ${tool}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if current directory is a git repository
 */
export async function isGitRepo(dir?: string): Promise<boolean> {
  try {
    const cwd = dir || process.cwd();
    await execAsync("git rev-parse --show-toplevel", { cwd });
    return true;
  } catch {
    return false;
  }
}

/**
 * Initialize a git repository
 */
export async function initGitRepo(projectPath: string): Promise<{ success: boolean; error?: string }> {
  try {
    await execAsync("git init", { cwd: projectPath });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get GitHub token from CLI argument or environment
 */
export function getGitHubToken(cliToken?: string): string | null {
  const token = cliToken || process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
  return token.trim() || null;
}

/**
 * Get GitHub auth headers
 */
export function getGitHubAuthHeaders(cliToken?: string): Record<string, string> {
  const token = getGitHubToken(cliToken);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Run a shell command
 */
export async function runCommand(
  cmd: string,
  options?: {
    cwd?: string;
    capture?: boolean;
  }
): Promise<string | null> {
  try {
    const { stdout } = await execAsync(cmd, { cwd: options?.cwd });
    return options?.capture ? stdout.trim() : null;
  } catch (error) {
    throw error;
  }
}

/**
 * Ensure scripts are executable (Unix-like systems only)
 */
export async function ensureExecutableScripts(projectPath: string): Promise<void> {
  if (process.platform === "win32") {
    return; // No-op on Windows
  }

  const scriptsDir = path.join(projectPath, ".specify", "scripts");

  try {
    const entries = await fs.readdir(scriptsDir, { withFileTypes: true, recursive: true });
    
    for (const entry of entries) {
      const fullPath = path.join(entry.path || scriptsDir, entry.name);
      if (entry.isFile() && entry.name.endsWith(".sh")) {
        try {
          await fs.chmod(fullPath, 0o755);
        } catch (err) {
          console.warn(`Could not make ${fullPath} executable:`, err);
        }
      }
    }
  } catch (error) {
    console.warn("Could not process scripts directory:", error);
  }
}
