#!/usr/bin/env node

/**
 * Example script showing programmatic usage of refacto
 * 
 * Usage:
 *   node rename-script.js --from "OldName" --to "NewName" [--dry-run]
 */

import { ProjectRenamer } from 'refacto';
import { program } from 'commander';
import chalk from 'chalk';

// Parse command line arguments
program
  .option('--from <name>', 'Current project name')
  .option('--to <name>', 'New project name')
  .option('--dry-run', 'Preview changes without applying')
  .option('--skip-git', 'Skip git configuration updates')
  .parse(process.argv);

const options = program.opts();

if (!options.from || !options.to) {
  console.error(chalk.red('Error: --from and --to are required'));
  process.exit(1);
}

async function main() {
  console.log(chalk.blue('🔄 Starting project rename...'));
  console.log(chalk.gray(`From: ${options.from}`));
  console.log(chalk.gray(`To: ${options.to}`));
  
  if (options.dryRun) {
    console.log(chalk.yellow('🔍 DRY RUN MODE - No changes will be made'));
  }

  try {
    // Create renamer instance
    const renamer = new ProjectRenamer({
      from: options.from,
      to: options.to,
      dryRun: options.dryRun || false,
      skipGit: options.skipGit || false,
      verbose: true
    });

    // Analyze changes
    console.log(chalk.blue('\n📊 Analyzing project...'));
    const analysis = await renamer.analyze();
    
    console.log(chalk.green('\n✨ Analysis Results:'));
    console.log(`  📄 Files with content changes: ${analysis.contentChanges}`);
    console.log(`  📝 Files to rename: ${analysis.fileRenames}`);
    console.log(`  📁 Directories to rename: ${analysis.dirRenames}`);
    console.log(`  🔄 Total replacements: ${analysis.totalReplacements}`);
    console.log(`  ⏱️  Estimated duration: ${analysis.estimatedDuration}s`);

    if (analysis.totalReplacements === 0) {
      console.log(chalk.yellow('\n⚠️  No changes needed!'));
      return;
    }

    // Ask for confirmation if not dry run
    if (!options.dryRun) {
      console.log(chalk.yellow('\n⚠️  This will modify your files!'));
      console.log(chalk.gray('Press Ctrl+C to cancel, or wait 5 seconds to continue...'));
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Perform rename
    console.log(chalk.blue('\n🚀 Performing rename...'));
    await renamer.rename();

    // Get and display changes
    const changes = renamer.getChanges();
    
    if (options.verbose) {
      console.log(chalk.green('\n📋 Detailed Changes:'));
      changes.forEach(change => {
        if (change.type === 'content') {
          console.log(`  ✏️  ${change.oldPath} (${change.changes} changes)`);
        } else if (change.type === 'file') {
          console.log(`  📄 ${change.oldPath} → ${change.newPath}`);
        } else if (change.type === 'directory') {
          console.log(`  📁 ${change.oldPath} → ${change.newPath}`);
        }
      });
    }

    if (options.dryRun) {
      console.log(chalk.yellow('\n✅ DRY RUN COMPLETE - No changes were made'));
      console.log(chalk.gray('Remove --dry-run to apply changes'));
    } else {
      console.log(chalk.green('\n✅ Rename complete!'));
      console.log(chalk.gray('\nNext steps:'));
      console.log(chalk.gray('  1. Review the changes'));
      console.log(chalk.gray('  2. Run your tests'));
      console.log(chalk.gray('  3. Update git remote URL if needed'));
      console.log(chalk.gray('  4. Update any external references'));
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error(chalk.red('Unexpected error:'), error);
  process.exit(1);
});