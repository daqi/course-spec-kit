import fs from "fs/promises";
import path from "path";

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a directory exists and is not empty
 */
export async function dirExistsAndNotEmpty(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    if (!stat.isDirectory()) {
      return false;
    }
    const files = await fs.readdir(dirPath);
    return files.length > 0;
  } catch {
    return false;
  }
}

/**
 * Check file for display output
 */
export async function checkFile(filePath: string, label: string): Promise<string> {
  const exists = await fileExists(filePath);
  return exists ? `  ✓ ${label}` : `  ✗ ${label}`;
}

/**
 * Check directory for display output
 */
export async function checkDir(dirPath: string, label: string): Promise<string> {
  const exists = await dirExistsAndNotEmpty(dirPath);
  return exists ? `  ✓ ${label}` : `  ✗ ${label}`;
}

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Copy file if source exists
 */
export async function copyFileIfExists(src: string, dest: string): Promise<boolean> {
  try {
    await fs.copyFile(src, dest);
    return true;
  } catch {
    return false;
  }
}
