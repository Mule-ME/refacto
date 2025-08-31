#!/usr/bin/env node

/**
 * CLI interface for the refacto tool
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import { ProjectRenamer } from './lib/renamer.js';
import { Logger } from './lib/logger.js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

interface CliOptions {
  from: string;
  to: string;
  dryRun: boolean;
  verbose: boolean;
  skipGit: boolean;
  ignore?: string[];
  force: boolean;
  interactive: boolean;
}

async function confirmChanges(analysis: any, logger: Logger): Promise<boolean> {
  logger.info('📊 Changes to be made:');
  logger.warn(`  • ${analysis.contentChanges} files will have content changes`);
  logger.warn(`  • ${analysis.fileRenames} files will be renamed`);
  logger.warn(`  • ${analysis.dirRenames} directories will be renamed`);
  logger.warn(`  • ${analysis.totalReplacements} total text replacements`);
  logger.info(`  • Estimated duration: ${analysis.estimatedDuration}s`);

  const { proceed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: '⚠️  This will modify files in your project. Do you want to proceed?',
      default: false
    }
  ]);

  return proceed;
}

async function interactiveMode(logger: Logger): Promise<CliOptions> {
  logger.info('🚀 Welcome to the Interactive Project Rename Tool!');
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'from',
      message: 'Current project name:',
      validate: (input: string) => input.length > 0 || 'Please enter the current project name'
    },
    {
      type: 'input', 
      name: 'to',
      message: 'New project name:',
      validate: (input: string) => input.length > 0 || 'Please enter the new project name'
    },
    {
      type: 'confirm',
      name: 'dryRun',
      message: 'Run in dry-run mode first? (recommended)',
      default: true
    },
    {
      type: 'confirm',
      name: 'verbose',
      message: 'Enable verbose output?',
      default: false
    },
    {
      type: 'confirm',
      name: 'skipGit',
      message: 'Skip git configuration updates?',
      default: false
    }
  ]);

  return {
    ...answers,
    force: false,
    interactive: true,
    ignore: []
  };
}

async function main(): Promise<void> {
  const program = new Command();

  program
    .name('refacto')
    .description('Rename all occurrences of project name throughout the codebase with smart case preservation')
    .version(packageJson.version)
    .requiredOption('--from <name>', 'Current project name (e.g., "Refacto")')
    .requiredOption('--to <name>', 'New project name (e.g., "TestProject")')
    .option('--dry-run', 'Show what would be renamed without making changes', false)
    .option('-v, --verbose', 'Show detailed output', false)
    .option('--skip-git', 'Skip git repository updates', false)
    .option('--ignore <patterns...>', 'Additional ignore patterns')
    .option('--force', 'Skip confirmation prompts (use with caution)', false)
    .option('-i, --interactive', 'Run in interactive mode', false);

  // Add examples in help
  program.addHelpText('after', `
Examples:
  $ refacto --from "Refacto" --to "MyProject" --dry-run
  $ refacto --from "old-name" --to "new-name" --verbose
  $ refacto --interactive
  $ refacto --from "Company" --to "NewCorp" --ignore "docs/**" "tests/**"
`);

  program.parse();
  const options = program.opts() as CliOptions;

  const logger = new Logger(options.verbose);

  try {
    let finalOptions: CliOptions;

    // Interactive mode
    if (options.interactive) {
      finalOptions = await interactiveMode(logger);
    } else {
      // Validate required options
      if (!options.from || !options.to) {
        logger.error('Both --from and --to options are required (or use --interactive)');
        process.exit(1);
      }
      finalOptions = options;
    }

    // Create renamer instance
    const renamer = new ProjectRenamer(finalOptions);

    // If not dry-run and not force, analyze and ask for confirmation
    if (!finalOptions.dryRun && !finalOptions.force) {
      const analysis = await renamer.analyze();
      const confirmed = await confirmChanges(analysis, logger);
      
      if (!confirmed) {
        logger.warn('❌ Rename cancelled by user');
        process.exit(0);
      }
    }

    // Perform the rename
    await renamer.rename();

    // If it was a dry run, suggest next steps
    if (finalOptions.dryRun) {
      logger.info('\n💡 Next steps:');
      logger.info('  1. Review the changes shown above');
      logger.info('  2. Run without --dry-run to apply changes:');
      logger.info(`     refacto --from "${finalOptions.from}" --to "${finalOptions.to}"`);
    }

  } catch (error) {
    logger.error('❌ Rename failed:');
    logger.error(error instanceof Error ? error.message : String(error));
    
    if (options.verbose && error instanceof Error) {
      logger.debug('Stack trace:');
      logger.debug(error.stack || '');
    }
    
    process.exit(1);
  }
}

// Only run if this file is being executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}