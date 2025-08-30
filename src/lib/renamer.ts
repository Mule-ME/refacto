/**
 * Core project renaming logic
 */

import path from 'path';
import { CaseConverter, CaseStyle } from './case-converter.js';
import { FileScanner } from './file-scanner.js';
import { Logger } from './logger.js';

export interface RenameOptions {
  from: string;
  to: string;
  dryRun?: boolean;
  verbose?: boolean;
  skipGit?: boolean;
  ignore?: string[];
  force?: boolean;
}

export interface RenameChange {
  type: 'content' | 'file' | 'directory';
  oldPath: string;
  newPath?: string;
  changes?: number;
}

export interface RenameAnalysis {
  contentChanges: number;
  fileRenames: number;
  dirRenames: number;
  totalReplacements: number;
  estimatedDuration: number; // in seconds
}

export class ProjectRenamer {
  private caseConverter = new CaseConverter();
  private fileScanner = new FileScanner();
  private logger: Logger;
  private changes: RenameChange[] = [];
  private fromVariations = new Map<string, CaseStyle>();
  private toVariations = new Map<CaseStyle, string>();

  constructor(private options: RenameOptions) {
    this.logger = new Logger(options.verbose || false);
    this.generateVariations();
  }

  /**
   * Generate all case variations for from/to strings
   */
  private generateVariations(): void {
    const { from, to } = this.options;
    
    // Generate from variations
    this.fromVariations = this.caseConverter.generateVariations(from);
    
    // Generate to variations
    const toVariationsMap = this.caseConverter.generateVariations(to);
    toVariationsMap.forEach((style, value) => {
      this.toVariations.set(style, value);
    });

    if (this.options.verbose) {
      this.logger.info('Smart case preservation enabled:');
      this.logger.debug('Pattern mappings:');
      this.fromVariations.forEach((style, fromVar) => {
        const toVar = this.toVariations.get(style);
        this.logger.debug(`  ${fromVar} → ${toVar}`);
      });
    }
  }

  /**
   * Smart replace that preserves case style
   */
  smartReplace(text: string): { result: string; replacements: number } {
    let result = text;
    let totalReplacements = 0;
    
    this.fromVariations.forEach((style, fromVariation) => {
      if (text.includes(fromVariation)) {
        const toVariation = this.toVariations.get(style) || this.options.to;
        const escaped = fromVariation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Use word boundaries to avoid partial matches
        const regex = new RegExp(`\\b${escaped}\\b`, 'g');
        const matches = result.match(regex);
        
        if (matches) {
          totalReplacements += matches.length;
          result = result.replace(regex, toVariation);
        }
      }
    });
    
    return { result, replacements: totalReplacements };
  }

  /**
   * Analyze changes without making them
   */
  async analyze(): Promise<RenameAnalysis> {
    this.logger.info('📊 Analyzing project for rename impact...');
    
    const scanResult = await this.fileScanner.scan(process.cwd(), {
      ignore: this.options.ignore
    });

    let contentChanges = 0;
    let fileRenames = 0;
    let dirRenames = 0;
    let totalReplacements = 0;

    // Analyze file contents
    for (const file of scanResult.files) {
      const content = await this.fileScanner.readFile(file.path);
      if (content !== null) {
        const { replacements } = this.smartReplace(content);
        if (replacements > 0) {
          contentChanges++;
          totalReplacements += replacements;
        }
      }
    }

    // Analyze file renames
    for (const file of scanResult.files) {
      const basename = path.basename(file.path);
      const { result: newBasename } = this.smartReplace(basename);
      if (newBasename !== basename) {
        fileRenames++;
      }
    }

    // Analyze directory renames
    for (const dir of scanResult.directories) {
      const basename = path.basename(dir.path);
      const { result: newBasename } = this.smartReplace(basename);
      if (newBasename !== basename) {
        dirRenames++;
      }
    }

    // Estimate duration (very rough)
    const estimatedDuration = Math.ceil(
      (contentChanges * 0.1) + // 100ms per file content change
      (fileRenames * 0.05) +   // 50ms per file rename
      (dirRenames * 0.1)       // 100ms per directory rename
    );

    return {
      contentChanges,
      fileRenames,
      dirRenames,
      totalReplacements,
      estimatedDuration
    };
  }

  /**
   * Main rename process
   */
  async rename(): Promise<void> {
    this.logger.info('🔄 Starting project rename with smart case preservation...');
    this.logger.info(`From: ${this.options.from}`);
    this.logger.info(`To: ${this.options.to}`);
    
    if (this.options.dryRun) {
      this.logger.warn('🔍 DRY RUN MODE - No changes will be made');
    }

    // Reset changes
    this.changes = [];

    try {
      // Step 1: Rename file contents
      await this.renameFileContents();
      
      // Step 2: Rename files
      await this.renameFiles();
      
      // Step 3: Rename directories
      await this.renameDirectories();
      
      // Step 4: Show summary
      this.showSummary();
      
      // Step 5: Update git if needed
      if (!this.options.skipGit && !this.options.dryRun) {
        await this.updateGit();
      }
    } catch (error) {
      this.logger.error('❌ Rename failed:', error);
      throw error;
    }
  }

  /**
   * Rename file contents
   */
  private async renameFileContents(): Promise<void> {
    this.logger.info('📝 Renaming file contents...');
    
    const scanResult = await this.fileScanner.scan(process.cwd(), {
      ignore: this.options.ignore
    });

    for (const file of scanResult.files) {
      await this.processFile(file.path);
    }
  }

  /**
   * Process a single file for content replacement
   */
  private async processFile(filePath: string): Promise<void> {
    const content = await this.fileScanner.readFile(filePath);
    if (content === null) {
      if (this.options.verbose) {
        this.logger.debug(`Skipped ${filePath} (binary or unreadable)`);
      }
      return;
    }

    const { result: newContent, replacements } = this.smartReplace(content);
    
    if (replacements > 0) {
      if (!this.options.dryRun) {
        const success = await this.fileScanner.writeFile(filePath, newContent);
        if (!success) {
          this.logger.error(`Failed to write ${filePath}`);
          return;
        }
      }
      
      this.changes.push({
        type: 'content',
        oldPath: filePath,
        changes: replacements
      });
      
      if (this.options.verbose) {
        const relativePath = path.relative(process.cwd(), filePath);
        this.logger.success(`✓ ${relativePath} (${replacements} replacements)`);
      }
    }
  }

  /**
   * Rename files
   */
  private async renameFiles(): Promise<void> {
    this.logger.info('📄 Renaming files...');
    
    const scanResult = await this.fileScanner.scan(process.cwd(), {
      ignore: this.options.ignore
    });

    // Sort by path depth (deepest first) to avoid conflicts
    const sortedFiles = scanResult.files.sort((a, b) => 
      b.path.split(path.sep).length - a.path.split(path.sep).length
    );

    for (const file of sortedFiles) {
      const dir = path.dirname(file.path);
      const basename = path.basename(file.path);
      const { result: newBasename } = this.smartReplace(basename);
      
      if (newBasename !== basename) {
        const newPath = path.join(dir, newBasename);
        
        if (!this.options.dryRun) {
          const success = await this.fileScanner.rename(file.path, newPath);
          if (!success) {
            this.logger.error(`Failed to rename ${file.path}`);
            continue;
          }
        }
        
        this.changes.push({
          type: 'file',
          oldPath: file.path,
          newPath: newPath
        });
        
        const relativeOld = path.relative(process.cwd(), file.path);
        const relativeNew = path.relative(process.cwd(), newPath);
        this.logger.success(`✓ ${relativeOld} → ${relativeNew}`);
      }
    }
  }

  /**
   * Rename directories
   */
  private async renameDirectories(): Promise<void> {
    this.logger.info('📁 Renaming directories...');
    
    const scanResult = await this.fileScanner.scan(process.cwd(), {
      ignore: this.options.ignore
    });

    // Sort by path depth (deepest first) to avoid conflicts
    const sortedDirs = scanResult.directories.sort((a, b) => 
      b.path.split(path.sep).length - a.path.split(path.sep).length
    );

    for (const dir of sortedDirs) {
      const parentDir = path.dirname(dir.path);
      const basename = path.basename(dir.path);
      const { result: newBasename } = this.smartReplace(basename);
      
      if (newBasename !== basename) {
        const newPath = path.join(parentDir, newBasename);
        
        if (!this.options.dryRun) {
          const success = await this.fileScanner.rename(dir.path, newPath);
          if (!success) {
            this.logger.error(`Failed to rename ${dir.path}`);
            continue;
          }
        }
        
        this.changes.push({
          type: 'directory',
          oldPath: dir.path,
          newPath: newPath
        });
        
        const relativeOld = path.relative(process.cwd(), dir.path);
        const relativeNew = path.relative(process.cwd(), newPath);
        this.logger.success(`✓ ${relativeOld} → ${relativeNew}`);
      }
    }
  }

  /**
   * Update git repository (origin URL)
   */
  private async updateGit(): Promise<void> {
    this.logger.info('🔧 Checking git configuration...');
    
    try {
      const { execSync } = await import('child_process');
      
      // Get current origin URL
      const originUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
      const { result: newOriginUrl } = this.smartReplace(originUrl);
      
      if (newOriginUrl !== originUrl) {
        this.logger.warn(`Current origin: ${originUrl}`);
        this.logger.success(`New origin: ${newOriginUrl}`);
        this.logger.info(`Run this command to update: git remote set-url origin ${newOriginUrl}`);
      }
    } catch (error) {
      this.logger.debug('No git repository found or unable to read origin');
    }
  }

  /**
   * Show summary of changes
   */
  private showSummary(): void {
    this.logger.info('📊 Summary:');
    
    const contentChanges = this.changes.filter(c => c.type === 'content');
    const fileChanges = this.changes.filter(c => c.type === 'file');
    const dirChanges = this.changes.filter(c => c.type === 'directory');
    
    this.logger.success(`✓ ${contentChanges.length} files with content changes`);
    this.logger.success(`✓ ${fileChanges.length} files renamed`);
    this.logger.success(`✓ ${dirChanges.length} directories renamed`);
    
    const totalReplacements = contentChanges.reduce((sum, c) => sum + (c.changes || 0), 0);
    this.logger.success(`✓ ${totalReplacements} total text replacements`);
    
    if (this.options.dryRun) {
      this.logger.warn('⚠️  DRY RUN COMPLETE - No actual changes were made');
      this.logger.warn('Remove --dry-run flag to apply changes');
    } else {
      this.logger.success('✅ Rename complete!');
      this.logger.info('Next steps:');
      this.logger.info('  1. Review the changes');
      this.logger.info('  2. Run your tests to ensure everything works');
      this.logger.info('  3. Update git remote URL if needed');
      this.logger.info('  4. Update any external references');
    }
    
    // Show some example replacements if verbose
    if (this.options.verbose && contentChanges.length > 0) {
      this.logger.info('📋 Example replacements made:');
      const examples = new Set<string>();
      this.fromVariations.forEach((style, fromVar) => {
        const toVar = this.toVariations.get(style);
        if (toVar && fromVar !== this.options.from && examples.size < 5) {
          examples.add(`  ${fromVar} → ${toVar}`);
        }
      });
      examples.forEach(ex => this.logger.debug(ex));
    }
  }

  /**
   * Get analysis of changes that would be made
   */
  getChanges(): RenameChange[] {
    return [...this.changes];
  }
}