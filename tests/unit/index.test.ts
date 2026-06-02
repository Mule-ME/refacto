import { describe, it, expect } from 'vitest';
import {
  ProjectRenamer,
  CaseConverter,
  FileScanner,
  Logger,
  default as DefaultExport,
} from '../../src/index.js';

describe('Package Exports', () => {
  it('should export all main classes', () => {
    expect(ProjectRenamer).toBeDefined();
    expect(CaseConverter).toBeDefined();
    expect(FileScanner).toBeDefined();
    expect(Logger).toBeDefined();
  });

  it('should export default as ProjectRenamer', () => {
    expect(DefaultExport).toBe(ProjectRenamer);
  });

  it('should create instances of exported classes', () => {
    const renamer = new ProjectRenamer({ from: 'test', to: 'demo' });
    const converter = new CaseConverter();
    const scanner = new FileScanner();
    const logger = new Logger();

    expect(renamer).toBeInstanceOf(ProjectRenamer);
    expect(converter).toBeInstanceOf(CaseConverter);
    expect(scanner).toBeInstanceOf(FileScanner);
    expect(logger).toBeInstanceOf(Logger);
  });
});
