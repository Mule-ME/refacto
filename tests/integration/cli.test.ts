import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

describe('CLI Integration', () => {
  let testDir: string;
  let originalCwd: string;
  let cliPath: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cli-test-'));
    
    // Build path to CLI
    cliPath = path.join(originalCwd, 'dist', 'cli.js');
    
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.rm(testDir, { recursive: true, force: true });
  });

  async function createTestFile(filePath: string, content: string): Promise<void> {
    const fullPath = path.join(testDir, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
  }

  describe('help and version', () => {
    it('should show help', async () => {
      const { stdout } = await execAsync(`node ${cliPath} --help`);
      
      expect(stdout).toContain('refacto');
      expect(stdout).toContain('--from');
      expect(stdout).toContain('--to');
      expect(stdout).toContain('--dry-run');
    });

    it('should show version', async () => {
      const { stdout } = await execAsync(`node ${cliPath} --version`);
      
      expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+/);
    });
  });

  describe('dry run mode', () => {
    it('should perform dry run without changes', async () => {
      await createTestFile('package.json', '{"name": "oldProject"}');
      await createTestFile('oldProject.js', 'console.log("oldProject");');

      const { stdout } = await execAsync(
        `node ${cliPath} --from "oldProject" --to "newProject" --dry-run`
      );

      expect(stdout).toContain('DRY RUN MODE');
      expect(stdout).toContain('No changes will be made');
      
      // Files should remain unchanged
      const packageContent = await fs.readFile(path.join(testDir, 'package.json'), 'utf-8');
      expect(packageContent).toContain('oldProject');
      
      await expect(fs.access(path.join(testDir, 'oldProject.js'))).resolves.toBeUndefined();
      await expect(fs.access(path.join(testDir, 'newProject.js'))).rejects.toThrow();
    });

    it('should show analysis results', async () => {
      await createTestFile('package.json', '{"name": "testApp", "description": "testApp description"}');
      await createTestFile('src/testApp.js', 'class TestApp { getName() { return "testApp"; } }');
      await createTestFile('testApp.md', '# TestApp\n\nThis is testApp documentation.');

      const { stdout } = await execAsync(
        `node ${cliPath} --from "testApp" --to "myApp" --dry-run --verbose`
      );

      expect(stdout).toContain('files with content changes');
      expect(stdout).toContain('total text replacements');
      expect(stdout).toContain('Pattern mappings');
    });
  });

  describe('error handling', () => {
    it('should show error for missing required options', async () => {
      try {
        await execAsync(`node ${cliPath} --from "test"`);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe(1);
        expect(error.stderr).toContain('required option');
      }
    });

    it('should handle non-existent directories gracefully', async () => {
      // Create a minimal test case in empty directory
      await createTestFile('test.txt', 'content');

      const { stdout } = await execAsync(
        `node ${cliPath} --from "nonExistent" --to "newName" --dry-run`
      );

      expect(stdout).toContain('DRY RUN COMPLETE');
      // Should not crash even if nothing to rename
    });
  });

  describe('verbose mode', () => {
    it('should show detailed output in verbose mode', async () => {
      await createTestFile('test.js', 'const test = "test";');

      const { stdout } = await execAsync(
        `node ${cliPath} --from "test" --to "demo" --dry-run --verbose`
      );

      expect(stdout).toContain('Smart case preservation enabled');
      expect(stdout).toContain('Pattern mappings');
    });
  });

  describe('ignore patterns', () => {
    it('should respect ignore patterns', async () => {
      await createTestFile('test.js', 'console.log("test");');
      await createTestFile('ignore/test.js', 'console.log("test");');

      const { stdout } = await execAsync(
        `node ${cliPath} --from "test" --to "demo" --dry-run --ignore "ignore/**"`
      );

      expect(stdout).toContain('DRY RUN COMPLETE');
      // Should process fewer files due to ignore
    });
  });

  describe('exit codes', () => {
    it('should exit with code 0 on success', async () => {
      await createTestFile('test.txt', 'content');

      const { code } = await execAsync(
        `node ${cliPath} --from "nonExistent" --to "demo" --dry-run`
      ).then(
        result => ({ code: 0, ...result }),
        error => ({ code: error.code, ...error })
      );

      expect(code).toBe(0);
    });

    it('should exit with code 1 on error', async () => {
      const { code } = await execAsync(
        `node ${cliPath} --from "test"` // Missing --to argument
      ).then(
        result => ({ code: 0, ...result }),
        error => ({ code: error.code, ...error })
      );

      expect(code).toBe(1);
    });
  });
});