/**
 * Case conversion utilities for smart case preservation
 */

export type CaseStyle =
  | 'camelCase'
  | 'PascalCase'
  | 'kebab-case'
  | 'snake_case'
  | 'UPPERCASE'
  | 'UPPERCASE_COMPACT'
  | 'lowercase'
  | 'package-scope'
  | 'unknown';

export interface CaseVariation {
  value: string;
  style: CaseStyle;
}

export class CaseConverter {
  /**
   * Detect the case style of a string
   */
  detectCaseStyle(str: string): CaseStyle {
    if (!str) return 'lowercase';

    // Package scope (@package)
    if (str.startsWith('@')) {
      return 'package-scope';
    }

    // kebab-case (check before lowercase)
    if (str.includes('-')) {
      return 'kebab-case';
    }

    // snake_case (check for underscore but distinguish from UPPERCASE)
    if (str.includes('_')) {
      // If it's all uppercase with underscores, it's UPPERCASE
      if (str === str.toUpperCase() && str !== str.toLowerCase()) {
        return 'UPPERCASE';
      }
      return 'snake_case';
    }

    // UPPERCASE (no underscores)
    if (str === str.toUpperCase() && str !== str.toLowerCase()) {
      return 'UPPERCASE_COMPACT';
    }

    // PascalCase (starts with uppercase)
    if (str[0] === str[0].toUpperCase() && str[0] !== str[0].toLowerCase()) {
      return 'PascalCase';
    }

    // camelCase (starts with lowercase and has mixed case)
    if (str[0] === str[0].toLowerCase() && str !== str.toLowerCase()) {
      return 'camelCase';
    }

    // lowercase (fallback)
    return 'lowercase';
  }

  /**
   * Convert a string to a specific case style
   */
  convertToCase(str: string, caseStyle: CaseStyle): string {
    const words = this.extractWords(str);

    switch (caseStyle) {
      case 'UPPERCASE':
        return words.join('_').toUpperCase();

      case 'UPPERCASE_COMPACT':
        return words.join('').toUpperCase();

      case 'lowercase':
        return words.join('');

      case 'kebab-case':
        return words.join('-');

      case 'snake_case':
        return words.join('_');

      case 'PascalCase':
        return words.map(w => this.capitalizeFirst(w)).join('');

      case 'camelCase':
        if (words.length === 0) return '';
        return (
          words[0] +
          words
            .slice(1)
            .map(w => this.capitalizeFirst(w))
            .join('')
        );

      case 'package-scope':
        return `@${words.join('')}`;

      default:
        return str;
    }
  }

  /**
   * Generate all case variations of a string
   */
  generateVariations(str: string): Map<string, CaseStyle> {
    const variations = new Map<string, CaseStyle>();

    const caseStyles: CaseStyle[] = [
      'camelCase',
      'PascalCase',
      'kebab-case',
      'snake_case',
      'UPPERCASE',
      'UPPERCASE_COMPACT',
      'lowercase',
    ];

    // Add original
    variations.set(str, this.detectCaseStyle(str));

    // Add all case variations
    caseStyles.forEach(style => {
      const converted = this.convertToCase(str, style);
      variations.set(converted, style);
    });

    if (!str.startsWith('@')) {
      const lowercaseWords = this.extractWords(str);
      const packageScope = `@${lowercaseWords.join('')}`;
      variations.set(packageScope, 'package-scope');
    }

    return variations;
  }

  /**
   * Extract words from a string (handles various separators)
   */
  private extractWords(str: string): string[] {
    return str
      .replace(/([A-Z])/g, ' $1') // Split on capital letters
      .replace(/[-_@./]/g, ' ') // Replace separators with spaces
      .replace(/(\d+)/g, ' $1 ') // Split on numbers
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0)
      .map(w => w.toLowerCase());
  }

  /**
   * Capitalize the first letter of a word
   */
  private capitalizeFirst(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
