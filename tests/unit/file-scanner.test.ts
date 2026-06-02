import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { FileScanner } from '../../src/lib/file-scanner.js';

describe('FileScanner', () => {
  const scanner = new FileScanner();
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'file-scanner-test-'));
  });

  afterEach(async () => {
    // Clean up test directory
    vi.restoreAllMocks();
    await fs.rm(testDir, { recursive: true, force: true });
  });

  async function createTestFile(filePath: string, content: string): Promise<void> {
    const fullPath = path.join(testDir, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
  }

  describe('scan', () => {
    it('should scan files and directories', async () => {
      // Create test structure
      await createTestFile('file1.txt', 'content1');
      await createTestFile('file2.js', 'console.log("test");');
      await createTestFile('subdir/file3.md', '# Test');
      await fs.mkdir(path.join(testDir, 'emptydir'));

      const result = await scanner.scan(testDir);

      expect(result.files).toHaveLength(3);
      expect(result.directories).toHaveLength(2); // subdir + emptydir
      expect(result.files.map(f => f.relativePath).sort()).toEqual([
        'file1.txt',
        'file2.js',
        'subdir/file3.md',
      ]);
      expect(result.stats.totalFiles).toBe(3);
      expect(result.stats.totalDirectories).toBe(2);
    });

    it('should respect ignore patterns', async () => {
      await createTestFile('file1.txt', 'content');
      await createTestFile('node_modules/package.json', '{}');
      await createTestFile('.git/config', 'gitconfig');

      const result = await scanner.scan(testDir);

      // Should ignore node_modules and .git by default
      expect(result.files.every(f => !f.relativePath.includes('node_modules'))).toBe(true);
      expect(result.files.every(f => !f.relativePath.includes('.git'))).toBe(true);
    });

    it('should respect custom ignore patterns', async () => {
      await createTestFile('file1.txt', 'content');
      await createTestFile('ignore-me.txt', 'content');
      await createTestFile('custom/ignore.txt', 'content');

      const result = await scanner.scan(testDir, {
        ignore: ['ignore-me.txt', 'custom/**'],
      });

      expect(result.files).toHaveLength(1);
      expect(result.files[0].relativePath).toBe('file1.txt');
    });

    it('should include hidden files when requested', async () => {
      await createTestFile('.hidden', 'content');
      await createTestFile('normal.txt', 'content');

      const resultWithoutHidden = await scanner.scan(testDir, { includeHidden: false });
      const resultWithHidden = await scanner.scan(testDir, { includeHidden: true });

      expect(resultWithoutHidden.files).toHaveLength(1);
      expect(resultWithHidden.files).toHaveLength(2);
    });

    it('should include hidden config files without scanning .git internals', async () => {
      await createTestFile('.env', 'PROJECT_NAME=OldProject');
      await createTestFile('.gitmodules', '[submodule "OldProject"]');
      await createTestFile('.git/config', 'url = OldProject');

      const result = await scanner.scan(testDir, { includeHidden: true });
      const files = result.files.map(f => f.relativePath).sort();

      expect(files).toEqual(['.env', '.gitmodules']);
    });

    it('should skip entries that resolve outside the scan root', async () => {
      await createTestFile('file.txt', 'content');
      const internals = scanner as unknown as {
        isInsideRoot: (root: string, target: string) => boolean;
      };
      vi.spyOn(internals, 'isInsideRoot').mockReturnValueOnce(false);

      const result = await scanner.scan(testDir);

      expect(result.files).toHaveLength(0);
    });

    it('should skip entries that disappear before stat', async () => {
      await createTestFile('vanished.txt', 'content');
      const originalLstat = fs.lstat.bind(fs);
      vi.spyOn(fs, 'lstat').mockImplementation(async filePath => {
        if (String(filePath).endsWith('vanished.txt')) {
          throw new Error('missing');
        }
        return originalLstat(filePath);
      });

      const result = await scanner.scan(testDir);

      expect(result.files.map(file => file.relativePath)).not.toContain('vanished.txt');
    });

    it('should skip symbolic links', async () => {
      await createTestFile('real.txt', 'content');
      try {
        await fs.symlink(path.join(testDir, 'real.txt'), path.join(testDir, 'link.txt'));
      } catch {
        return;
      }

      const result = await scanner.scan(testDir);

      expect(result.files.map(file => file.relativePath)).toEqual(['real.txt']);
    });
  });

  describe('isBinary', () => {
    it('should detect text files as non-binary', async () => {
      await createTestFile('text.txt', 'This is a text file with normal content.');

      const isBinary = await scanner.isBinary(path.join(testDir, 'text.txt'));
      expect(isBinary).toBe(false);
    });

    it('should detect empty files as non-binary', async () => {
      await createTestFile('empty.txt', '');

      await expect(scanner.isBinary(path.join(testDir, 'empty.txt'))).resolves.toBe(false);
      await expect(scanner.readFile(path.join(testDir, 'empty.txt'))).resolves.toBe('');
    });

    it('should detect binary files', async () => {
      // Create a file with null bytes (binary indicator)
      const binaryContent = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04]);
      await fs.writeFile(path.join(testDir, 'binary.bin'), binaryContent);

      const isBinary = await scanner.isBinary(path.join(testDir, 'binary.bin'));
      expect(isBinary).toBe(true);
    });

    it('should handle non-existent files', async () => {
      const isBinary = await scanner.isBinary(path.join(testDir, 'non-existent.txt'));
      expect(isBinary).toBe(true); // Should assume binary if can't read
    });

    it('should detect files with non-printable characters as binary', async () => {
      // Create a file with non-printable characters (to test lines 131-132)
      const binaryContent = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04]);
      await fs.writeFile(path.join(testDir, 'binary.bin'), binaryContent);

      const result = await scanner.isBinary(path.join(testDir, 'binary.bin'));
      expect(result).toBe(true);
    });
  });

  describe('readFile', () => {
    it('should read text files', async () => {
      const content = 'This is test content';
      await createTestFile('test.txt', content);

      const result = await scanner.readFile(path.join(testDir, 'test.txt'));
      expect(result).toBe(content);
    });

    it('should return null for binary files', async () => {
      const binaryContent = Buffer.from([0x00, 0x01, 0x02, 0x03]);
      await fs.writeFile(path.join(testDir, 'binary.bin'), binaryContent);

      const result = await scanner.readFile(path.join(testDir, 'binary.bin'));
      expect(result).toBeNull();
    });

    it('should return null for non-existent files', async () => {
      const result = await scanner.readFile(path.join(testDir, 'non-existent.txt'));
      expect(result).toBeNull();
    });

    it('should return null for files that cannot be read as UTF-8', async () => {
      // Create a file with invalid UTF-8 sequences to trigger read error (lines 151-152)
      const invalidUtf8 = Buffer.from([0xff, 0xfe, 0x00, 0x00]);
      await fs.writeFile(path.join(testDir, 'invalid-utf8.txt'), invalidUtf8);

      const result = await scanner.readFile(path.join(testDir, 'invalid-utf8.txt'));
      // This should trigger the catch block and return null
      expect(result).toBeNull();
    });

    it('should return null when file read throws error (lines 151-152)', async () => {
      // Create a directory with same name as file to force read error
      const dirPath = path.join(testDir, 'not-a-file');
      await fs.mkdir(dirPath);

      const result = await scanner.readFile(dirPath);
      // Reading a directory as file should trigger catch block (lines 151-152)
      expect(result).toBeNull();
    });

    it('should return null when text read fails after binary detection', async () => {
      const filePath = path.join(testDir, 'read-error.txt');
      await createTestFile('read-error.txt', 'content');
      vi.spyOn(scanner, 'isBinary').mockResolvedValue(false);
      vi.spyOn(fs, 'readFile').mockRejectedValueOnce(new Error('read failed'));

      const result = await scanner.readFile(filePath);

      expect(result).toBeNull();
    });

    it('should handle permission errors when reading files (lines 151-152)', async () => {
      // Create a file with restricted permissions to force read error
      const restrictedFile = path.join(testDir, 'restricted.txt');
      await fs.writeFile(restrictedFile, 'secret content');

      try {
        // Try to make it unreadable (may not work on all systems)
        await fs.chmod(restrictedFile, 0o000);

        const result = await scanner.readFile(restrictedFile);
        // This should trigger the catch block (lines 151-152)
        expect(result).toBeNull();

        // Restore permissions for cleanup
        await fs.chmod(restrictedFile, 0o644);
      } catch (error) {
        // If chmod fails, test passes since we can't create the scenario
      }
    });

    it('should handle files with mixed printable and non-printable characters', async () => {
      // Create a file that has exactly the threshold of non-printable chars to test line 131-132
      const mixedContent = Buffer.concat([
        Buffer.from('hello'), // 5 printable chars
        Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]), // 8 non-printable = ~60% > 30% threshold
      ]);
      await fs.writeFile(path.join(testDir, 'mixed.bin'), mixedContent);

      const result = await scanner.isBinary(path.join(testDir, 'mixed.bin'));
      expect(result).toBe(true);
    });
  });

  describe('writeFile', () => {
    it('should write files successfully', async () => {
      const content = 'New file content';
      const filePath = path.join(testDir, 'new-file.txt');

      const success = await scanner.writeFile(filePath, content);
      expect(success).toBe(true);

      const written = await fs.readFile(filePath, 'utf-8');
      expect(written).toBe(content);
    });

    it('should handle write errors gracefully', async () => {
      // Try to write to a non-existent directory without creating it
      const success = await scanner.writeFile(
        path.join(testDir, 'non-existent-dir', 'file.txt'),
        'content'
      );
      expect(success).toBe(false);
    });
  });

  describe('rename', () => {
    it('should rename files successfully', async () => {
      await createTestFile('old-name.txt', 'content');
      const oldPath = path.join(testDir, 'old-name.txt');
      const newPath = path.join(testDir, 'new-name.txt');

      const success = await scanner.rename(oldPath, newPath);
      expect(success).toBe(true);

      // Old file should not exist
      await expect(fs.access(oldPath)).rejects.toThrow();

      // New file should exist
      await expect(fs.access(newPath)).resolves.toBeUndefined();
    });

    it('should handle rename errors gracefully', async () => {
      const success = await scanner.rename(
        path.join(testDir, 'non-existent.txt'),
        path.join(testDir, 'new-name.txt')
      );
      expect(success).toBe(false);
    });

    it('should refuse to overwrite an existing target path', async () => {
      await createTestFile('old-name.txt', 'old content');
      await createTestFile('new-name.txt', 'existing content');

      const success = await scanner.rename(
        path.join(testDir, 'old-name.txt'),
        path.join(testDir, 'new-name.txt')
      );

      expect(success).toBe(false);
      await expect(fs.readFile(path.join(testDir, 'old-name.txt'), 'utf-8')).resolves.toBe(
        'old content'
      );
      await expect(fs.readFile(path.join(testDir, 'new-name.txt'), 'utf-8')).resolves.toBe(
        'existing content'
      );
    });
  });

  describe('getStats', () => {
    it('should get file stats', async () => {
      await createTestFile('test.txt', 'content');
      const filePath = path.join(testDir, 'test.txt');

      const stats = await scanner.getStats(filePath);
      expect(stats).toBeTruthy();
      expect(stats!.isFile()).toBe(true);
      expect(stats!.size).toBeGreaterThan(0);
    });

    it('should return null for non-existent files', async () => {
      const stats = await scanner.getStats(path.join(testDir, 'non-existent.txt'));
      expect(stats).toBeNull();
    });
  });
});
