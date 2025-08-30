/**
 * File system scanning utilities
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import type { Stats } from 'fs';

export interface ScanOptions {
  ignore?: string[];
  includeHidden?: boolean;
  maxDepth?: number;
}

export interface FileInfo {
  path: string;
  relativePath: string;
  isDirectory: boolean;
  size?: number;
  extension?: string;
}

export interface ScanResult {
  files: FileInfo[];
  directories: FileInfo[];
  stats: {
    totalFiles: number;
    totalDirectories: number;
    totalSize: number;
  };
}

export class FileScanner {
  private defaultIgnorePatterns = [
    'node_modules/**',
    '.git/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '*.log',
    '*.lock',
    '.DS_Store',
    '**/.cache/**'
  ];

  /**
   * Scan directory for files and directories
   */
  async scan(rootDir: string, options: ScanOptions = {}): Promise<ScanResult> {
    const ignorePatterns = [
      ...this.defaultIgnorePatterns,
      ...(options.ignore || [])
    ];

    const files: FileInfo[] = [];
    const directories: FileInfo[] = [];
    let totalSize = 0;

    // Get all files
    const allFiles = await glob('**/*', {
      cwd: rootDir,
      ignore: ignorePatterns,
      dot: options.includeHidden || false,
      withFileTypes: true
    });

    for (const entry of allFiles) {
      const fullPath = path.join(rootDir, entry.name);
      const relativePath = entry.name;

      if (entry.isDirectory()) {
        directories.push({
          path: fullPath,
          relativePath,
          isDirectory: true
        });
      } else {
        let size = 0;
        try {
          const stats = await fs.stat(fullPath);
          size = stats.size;
          totalSize += size;
        } catch (error) {
          // File might have been deleted, skip
          continue;
        }

        files.push({
          path: fullPath,
          relativePath,
          isDirectory: false,
          size,
          extension: path.extname(fullPath)
        });
      }
    }

    return {
      files,
      directories,
      stats: {
        totalFiles: files.length,
        totalDirectories: directories.length,
        totalSize
      }
    };
  }

  /**
   * Check if a file is binary
   */
  async isBinary(filePath: string): Promise<boolean> {
    try {
      const buffer = await fs.readFile(filePath);
      
      // Check for null bytes (common in binary files)
      for (let i = 0; i < Math.min(buffer.length, 8000); i++) {
        if (buffer[i] === 0) {
          return true;
        }
      }
      
      // Check for high ratio of non-printable characters
      let nonPrintableCount = 0;
      const sampleSize = Math.min(buffer.length, 8000);
      
      for (let i = 0; i < sampleSize; i++) {
        const byte = buffer[i];
        if (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13) {
          nonPrintableCount++;
        }
      }
      
      return (nonPrintableCount / sampleSize) > 0.3;
    } catch (error) {
      return true; // Assume binary if we can't read it
    }
  }

  /**
   * Read file content safely
   */
  async readFile(filePath: string): Promise<string | null> {
    try {
      if (await this.isBinary(filePath)) {
        return null;
      }
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      return null;
    }
  }

  /**
   * Write file content safely
   */
  async writeFile(filePath: string, content: string): Promise<boolean> {
    try {
      await fs.writeFile(filePath, content, 'utf-8');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Rename file or directory
   */
  async rename(oldPath: string, newPath: string): Promise<boolean> {
    try {
      await fs.rename(oldPath, newPath);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file stats
   */
  async getStats(filePath: string): Promise<Stats | null> {
    try {
      return await fs.stat(filePath);
    } catch (error) {
      return null;
    }
  }
}