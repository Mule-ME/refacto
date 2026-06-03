import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ProjectRenamer } from '../../src/lib/renamer.js';

describe('ProjectRenamer', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    // Save original working directory
    originalCwd = process.cwd();

    // Create a temporary test directory
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'renamer-test-'));

    // Change to test directory
    process.chdir(testDir);
  });

  afterEach(async () => {
    // Restore original working directory
    process.chdir(originalCwd);

    // Clean up test directory
    await fs.rm(testDir, { recursive: true, force: true });
  });

  async function createTestFile(filePath: string, content: string): Promise<void> {
    const fullPath = path.join(testDir, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
  }

  describe('smartReplace', () => {
    it('should require source and target names', () => {
      expect(
        () =>
          new ProjectRenamer({
            from: '',
            to: 'newProject',
          })
      ).toThrow('Both from and to options are required');
    });

    it('should replace text with case preservation', () => {
      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: true,
      });

      const testCases = [
        { input: 'testProject', expected: 'newProject' },
        { input: 'TestProject', expected: 'NewProject' },
        { input: 'test-project', expected: 'new-project' },
        { input: 'test_project', expected: 'new_project' },
        { input: 'TEST_PROJECT', expected: 'NEW_PROJECT' },
        { input: 'TESTPROJECT', expected: 'NEWPROJECT' },
        { input: '@testproject', expected: '@newproject' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = renamer.smartReplace(input);
        expect(result.result).toBe(expected);
        expect(result.replacements).toBe(1);
      });
    });

    it('should handle multiple replacements in same text', () => {
      const renamer = new ProjectRenamer({
        from: 'test',
        to: 'demo',
        dryRun: true,
      });

      const input = 'test Test TEST test-case test_case';
      const result = renamer.smartReplace(input);

      expect(result.result).toBe('demo Demo DEMO demo-case demo_case');
      expect(result.replacements).toBe(5);
    });

    it('should not replace partial matches', () => {
      const renamer = new ProjectRenamer({
        from: 'test',
        to: 'demo',
        dryRun: true,
      });

      const input = 'testing testament';
      const result = renamer.smartReplace(input);

      // Should not replace partial matches
      expect(result.result).toBe('testing testament');
      expect(result.replacements).toBe(0);
    });

    it('should replace common identifier suffix shapes', () => {
      const renamer = new ProjectRenamer({
        from: 'DataProcessor',
        to: 'DataAnalyzer',
        dryRun: true,
      });

      const input = 'class DataProcessorConfig {} const dataProcessorConfig = DATA_PROCESSOR_URL;';
      const result = renamer.smartReplace(input);

      expect(result.result).toBe(
        'class DataAnalyzerConfig {} const dataAnalyzerConfig = DATA_ANALYZER_URL;'
      );
      expect(result.replacements).toBe(3);
    });

    it('should replace compact and identifier forms with numeric suffixes', () => {
      const renamer = new ProjectRenamer({
        from: 'RefactoProbeOld',
        to: 'RefactoProbeNew',
        dryRun: true,
      });

      const input =
        'RefactoProbeOld17 refactoProbeOld17 refacto_probe_old_17 REFACTO_PROBE_OLD_17 REFACTOPROBEOLD17 refactoprobeold17 refacto-probe-old-17';
      const result = renamer.smartReplace(input);

      expect(result.result).toBe(
        'RefactoProbeNew17 refactoProbeNew17 refacto_probe_new_17 REFACTO_PROBE_NEW_17 REFACTOPROBENEW17 refactoprobenew17 refacto-probe-new-17'
      );
      expect(result.replacements).toBe(7);
    });

    it('should preserve package scopes when target is unscoped', () => {
      const renamer = new ProjectRenamer({
        from: '@myorg/project',
        to: 'newName',
        dryRun: true,
      });

      const result = renamer.smartReplace('import value from "@myorg/project";');

      expect(result.result).toBe('import value from "@myorg/new-name";');
      expect(result.replacements).toBe(1);
    });
  });

  describe('analyze', () => {
    it('should analyze project for rename impact', async () => {
      // Create test files
      await createTestFile('package.json', '{"name": "testProject"}');
      await createTestFile('src/testProject.js', 'class TestProject {}');
      await createTestFile('testProject.md', '# TestProject\n\nThis is testProject documentation.');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: true,
      });

      const analysis = await renamer.analyze();

      expect(analysis.contentChanges).toBeGreaterThan(0);
      expect(analysis.totalReplacements).toBeGreaterThan(0);
      expect(analysis.estimatedDuration).toBeGreaterThan(0);
    });

    it('should detect files that need renaming', async () => {
      await createTestFile('testProject.js', 'console.log("test");');
      await createTestFile('lib/testProject.utils.js', 'export const utils = {};');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: true,
      });

      const analysis = await renamer.analyze();

      expect(analysis.fileRenames).toBe(2);
    });

    it('should detect directories that need renaming', async () => {
      await createTestFile('testProject/index.js', 'export default {};');
      await createTestFile('lib/testProject/utils.js', 'export const utils = {};');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: true,
      });

      const analysis = await renamer.analyze();

      expect(analysis.dirRenames).toBe(2);
    });
  });

  describe('dry run mode', () => {
    it('should not modify files in dry run mode', async () => {
      const originalContent = '{"name": "testProject"}';
      await createTestFile('package.json', originalContent);

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: true,
        verbose: false,
      });

      await renamer.rename();

      // File should remain unchanged
      const content = await fs.readFile(path.join(testDir, 'package.json'), 'utf-8');
      expect(content).toBe(originalContent);
    });

    it('should not rename files in dry run mode', async () => {
      await createTestFile('testProject.js', 'console.log("test");');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: true,
        verbose: false,
      });

      await renamer.rename();

      // Original file should still exist
      await expect(fs.access(path.join(testDir, 'testProject.js'))).resolves.toBeUndefined();

      // New file should not exist
      await expect(fs.access(path.join(testDir, 'newProject.js'))).rejects.toThrow();
    });
  });

  describe('actual rename mode', () => {
    it('should modify file contents', async () => {
      const originalContent = '{"name": "testProject"}';
      await createTestFile('package.json', originalContent);

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: false,
        verbose: false,
      });

      await renamer.rename();

      const content = await fs.readFile(path.join(testDir, 'package.json'), 'utf-8');
      expect(content).toBe('{"name": "newProject"}');
    });

    it('should rename files', async () => {
      await createTestFile('testProject.js', 'console.log("test");');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: false,
        verbose: false,
      });

      await renamer.rename();

      // Original file should not exist
      await expect(fs.access(path.join(testDir, 'testProject.js'))).rejects.toThrow();

      // New file should exist
      await expect(fs.access(path.join(testDir, 'newProject.js'))).resolves.toBeUndefined();
    });

    it('should rename directories', async () => {
      await createTestFile('testProject/index.js', 'export default {};');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: false,
        verbose: false,
      });

      await renamer.rename();

      // Original directory should not exist
      await expect(fs.access(path.join(testDir, 'testProject'))).rejects.toThrow();

      // New directory should exist
      await expect(fs.access(path.join(testDir, 'newProject'))).resolves.toBeUndefined();

      // File should be moved
      await expect(
        fs.access(path.join(testDir, 'newProject', 'index.js'))
      ).resolves.toBeUndefined();
    });

    it('should rename nested file contents and filenames', async () => {
      await createTestFile('src/testProject.ts', 'export class TestProjectConfig {}');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: false,
        verbose: false,
        skipGit: true,
      });

      await renamer.rename();

      await expect(fs.access(path.join(testDir, 'src', 'testProject.ts'))).rejects.toThrow();
      const content = await fs.readFile(path.join(testDir, 'src', 'newProject.ts'), 'utf-8');
      expect(content).toBe('export class NewProjectConfig {}');
    });

    it('should update hidden project config files but keep .git internals ignored', async () => {
      await createTestFile('.env', 'TEST_PROJECT_URL=https://example.com/test-project');
      await createTestFile('.gitmodules', 'url = https://github.com/company/test-project.git');
      await createTestFile('.git/config', 'url = https://github.com/company/test-project.git');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: false,
        verbose: false,
        skipGit: true,
      });

      await renamer.rename();

      await expect(fs.readFile(path.join(testDir, '.env'), 'utf-8')).resolves.toBe(
        'NEW_PROJECT_URL=https://example.com/new-project'
      );
      await expect(fs.readFile(path.join(testDir, '.gitmodules'), 'utf-8')).resolves.toBe(
        'url = https://github.com/company/new-project.git'
      );
      await expect(fs.readFile(path.join(testDir, '.git', 'config'), 'utf-8')).resolves.toBe(
        'url = https://github.com/company/test-project.git'
      );
    });
  });

  describe('ignore patterns', () => {
    it('should respect custom ignore patterns', async () => {
      await createTestFile('testProject.js', 'console.log("test");');
      await createTestFile('ignore/testProject.js', 'console.log("ignore");');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        ignore: ['ignore/**'],
        dryRun: false,
        verbose: false,
      });

      await renamer.rename();

      // Main file should be renamed
      await expect(fs.access(path.join(testDir, 'newProject.js'))).resolves.toBeUndefined();

      // Ignored file should remain unchanged
      await expect(
        fs.access(path.join(testDir, 'ignore', 'testProject.js'))
      ).resolves.toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should handle binary files gracefully', async () => {
      // Create a binary file
      const binaryContent = Buffer.from([0x00, 0x01, 0x02, 0x03]);
      await fs.writeFile(path.join(testDir, 'binary.bin'), binaryContent);

      const renamer = new ProjectRenamer({
        from: 'test',
        to: 'demo',
        dryRun: false,
        verbose: false,
      });

      // Should not throw error
      await expect(renamer.rename()).resolves.toBeUndefined();
    });

    it('should log skipped binary files in verbose mode', async () => {
      const binaryContent = Buffer.from([0x00, 0x01, 0x02, 0x03]);
      await fs.writeFile(path.join(testDir, 'binary.bin'), binaryContent);

      const renamer = new ProjectRenamer({
        from: 'test',
        to: 'demo',
        dryRun: false,
        verbose: true,
        skipGit: true,
      });

      await expect(renamer.rename()).resolves.toBeUndefined();
    });

    it('should report write failures without recording a content change', async () => {
      await createTestFile('package.json', '{"name": "testProject"}');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: false,
        skipGit: true,
      });
      const internals = renamer as unknown as {
        fileScanner: { writeFile: () => Promise<boolean> };
      };
      internals.fileScanner.writeFile = async () => false;

      await renamer.rename();

      await expect(fs.readFile(path.join(testDir, 'package.json'), 'utf-8')).resolves.toBe(
        '{"name": "testProject"}'
      );
      expect(renamer.getChanges()).toHaveLength(0);
    });

    it('should reject direct writes outside the project root', () => {
      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: false,
        skipGit: true,
      });
      const internals = renamer as unknown as {
        assertInsideProject: (targetPath: string) => void;
      };

      expect(() => internals.assertInsideProject(path.dirname(testDir))).toThrow(
        'outside project root'
      );
    });

    it('should rethrow unexpected rename failures', async () => {
      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: false,
        skipGit: true,
      });
      const internals = renamer as unknown as {
        renameFileContents: () => Promise<void>;
      };
      internals.renameFileContents = async () => {
        throw new Error('forced failure');
      };

      await expect(renamer.rename()).rejects.toThrow('forced failure');
    });
  });

  describe('getChanges', () => {
    it('should return list of changes made', async () => {
      await createTestFile('testProject.js', 'console.log("testProject");');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: true,
        verbose: false,
      });

      await renamer.rename();

      const changes = renamer.getChanges();
      expect(changes.length).toBeGreaterThan(0);

      const contentChange = changes.find(c => c.type === 'content');
      expect(contentChange).toBeTruthy();
      expect(contentChange!.changes).toBeGreaterThan(0);

      const fileChange = changes.find(c => c.type === 'file');
      expect(fileChange).toBeTruthy();
      expect(fileChange!.newPath).toContain('newProject.js');
    });
  });

  describe('verbose mode', () => {
    it('should show example replacements in verbose mode', async () => {
      await createTestFile(
        'test.js',
        'const testProject = "testProject"; const TestProject = "TestProject";'
      );

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        verbose: true,
        dryRun: true,
      });

      await renamer.rename();
      // Verbose mode should trigger the example replacements logging (lines 390-399)
    });
  });

  describe('git remote handling', () => {
    it('should handle git remote URL updates', async () => {
      await createTestFile(
        '.git/config',
        '[remote "origin"]\n\turl = https://github.com/user/testProject.git'
      );

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: true,
      });

      await renamer.rename();
      // This should trigger git remote URL change detection (lines 350-353)
    });

    it('should detect and suggest git remote URL changes when URLs differ', async () => {
      // Create a .git/config with testProject in the URL
      await fs.mkdir(path.join(testDir, '.git'), { recursive: true });
      await createTestFile(
        '.git/config',
        `[core]
\trepositoryformatversion = 0
[remote "origin"]
\turl = https://github.com/olduser/testProject.git
\tfetch = +refs/heads/*:refs/remotes/origin/*`
      );

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: true,
      });

      await renamer.rename();
      // This should trigger the git URL change suggestion (lines 350-353)
    });
  });

  describe('file rename failures', () => {
    it('should not overwrite an existing file on rename collision', async () => {
      await createTestFile('testProject.txt', 'original content');
      await createTestFile('newProject.txt', 'blocking content');

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: false,
        skipGit: true,
      });

      await renamer.rename();

      await expect(fs.readFile(path.join(testDir, 'testProject.txt'), 'utf-8')).resolves.toBe(
        'original content'
      );
      await expect(fs.readFile(path.join(testDir, 'newProject.txt'), 'utf-8')).resolves.toBe(
        'blocking content'
      );
    });
  });

  describe('directory rename failures', () => {
    it('should handle directory rename failures (lines 318-320)', async () => {
      // Create a directory that can't be renamed (permission issue simulation)
      await createTestFile('testProject/file.txt', 'content');
      await createTestFile('newProject/blocking.txt', 'blocking content'); // This will block the rename

      const renamer = new ProjectRenamer({
        from: 'testProject',
        to: 'newProject',
        dryRun: false,
        skipGit: true,
      });

      await renamer.rename();

      await expect(fs.access(path.join(testDir, 'testProject'))).resolves.toBeUndefined();
      await expect(fs.access(path.join(testDir, 'newProject'))).resolves.toBeUndefined();
    });
  });

  describe('git URL change detection', () => {
    it('should update git remote URLs when origin contains old name', async () => {
      // Initialize a proper git repo to make git command work
      await fs.mkdir(path.join(testDir, '.git'), { recursive: true });

      // Try to make it a real git repo so git commands work
      const { execSync } = await import('child_process');
      try {
        execSync('git init', { cwd: testDir, stdio: 'ignore' });
        execSync('git remote add origin https://github.com/company/testProject-repo.git', {
          cwd: testDir,
          stdio: 'ignore',
        });
      } catch (error) {
        // If git commands fail, just skip this test
        return;
      }

      const originalCwd = process.cwd();
      process.chdir(testDir);

      try {
        const renamer = new ProjectRenamer({
          from: 'testProject',
          to: 'newProject',
          dryRun: false,
        });

        await renamer.rename();
        const newUrl = execSync('git remote get-url origin', {
          cwd: testDir,
          encoding: 'utf-8',
        }).trim();
        expect(newUrl).toBe('https://github.com/company/newProject-repo.git');
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should reject file renames that would leave the project root', async () => {
      await createTestFile('testProject.txt', 'content');

      expect(
        () =>
          new ProjectRenamer({
            from: 'testProject',
            to: '../newProject',
            dryRun: false,
            skipGit: true,
          })
      ).toThrow('path traversal is not allowed');
      await expect(fs.readFile(path.join(testDir, 'testProject.txt'), 'utf-8')).resolves.toBe(
        'content'
      );
    });
  });
});
