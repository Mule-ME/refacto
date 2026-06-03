/**
 * Main entry point for the refacto package
 * Exports both programmatic API and CLI functionality
 */

// Core exports for programmatic use
export { ProjectRenamer } from './lib/renamer.js';
export { CaseConverter } from './lib/case-converter.js';
export { FileScanner } from './lib/file-scanner.js';
export { Logger } from './lib/logger.js';

// Type exports
export type { RenameOptions, RenameChange, RenameAnalysis } from './lib/renamer.js';
export type { CaseStyle, CaseVariation } from './lib/case-converter.js';
export type { ScanOptions, FileInfo, ScanResult } from './lib/file-scanner.js';
export type { LogLevel, LoggerOptions } from './lib/logger.js';

// Default export for simple usage
export { ProjectRenamer as default } from './lib/renamer.js';
