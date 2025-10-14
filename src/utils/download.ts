import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import os from "os";
import extract from "extract-zip";
import { GITHUB_REPO_OWNER, GITHUB_REPO_NAME } from "../config.js";
import { getGitHubAuthHeaders } from "./system.js";

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: ReleaseAsset[];
}

/**
 * Fetch the latest release from GitHub
 */
export async function fetchLatestRelease(githubToken?: string): Promise<GitHubRelease> {
  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`;
  const headers = {
    ...getGitHubAuthHeaders(githubToken),
    "User-Agent": "specify-cli",
  };

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch release: ${response.statusText}`);
  }

  return (await response.json()) as GitHubRelease;
}

/**
 * Download template from GitHub release
 */
export async function downloadTemplate(
  aiAssistant: string,
  downloadDir: string,
  githubToken?: string
): Promise<{ zipPath: string; release: GitHubRelease }> {
  const release = await fetchLatestRelease(githubToken);
  const assetName = `spec-kit-template-${aiAssistant}-${release.tag_name}.zip`;

  const asset = release.assets.find((a) => a.name === assetName);
  if (!asset) {
    throw new Error(
      `Template not found: ${assetName}\nAvailable assets: ${release.assets.map((a) => a.name).join(", ")}`
    );
  }

  const zipPath = path.join(downloadDir, assetName);
  const headers = {
    ...getGitHubAuthHeaders(githubToken),
    "User-Agent": "specify-cli",
  };

  const response = await fetch(asset.browser_download_url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to download template: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  await fs.writeFile(zipPath, Buffer.from(buffer));

  return { zipPath, release };
}

/**
 * Extract template zip to destination
 */
export async function extractTemplate(zipPath: string, destination: string): Promise<void> {
  await extract(zipPath, { dir: path.resolve(destination) });
}

/**
 * Download and extract template
 */
export async function downloadAndExtractTemplate(
  projectPath: string,
  aiAssistant: string,
  githubToken?: string
): Promise<void> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "specify-"));

  try {
    const { zipPath } = await downloadTemplate(aiAssistant, tmpDir, githubToken);
    await extractTemplate(zipPath, projectPath);
  } finally {
    // Clean up temp directory
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch (err) {
      // Ignore cleanup errors
    }
  }
}
