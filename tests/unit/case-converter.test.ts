import { describe, it, expect } from 'vitest';
import { CaseConverter } from '../../src/lib/case-converter.js';

describe('CaseConverter', () => {
  const converter = new CaseConverter();

  describe('detectCaseStyle', () => {
    it('should detect camelCase', () => {
      expect(converter.detectCaseStyle('camelCase')).toBe('camelCase');
      expect(converter.detectCaseStyle('myVariable')).toBe('camelCase');
      expect(converter.detectCaseStyle('someValue')).toBe('camelCase');
    });

    it('should detect PascalCase', () => {
      expect(converter.detectCaseStyle('PascalCase')).toBe('PascalCase');
      expect(converter.detectCaseStyle('MyClass')).toBe('PascalCase');
      expect(converter.detectCaseStyle('SomeComponent')).toBe('PascalCase');
    });

    it('should detect kebab-case', () => {
      expect(converter.detectCaseStyle('kebab-case')).toBe('kebab-case');
      expect(converter.detectCaseStyle('my-variable')).toBe('kebab-case');
      expect(converter.detectCaseStyle('some-value')).toBe('kebab-case');
    });

    it('should detect snake_case', () => {
      expect(converter.detectCaseStyle('snake_case')).toBe('snake_case');
      expect(converter.detectCaseStyle('my_variable')).toBe('snake_case');
      expect(converter.detectCaseStyle('some_value')).toBe('snake_case');
    });

    it('should detect UPPERCASE', () => {
      expect(converter.detectCaseStyle('UPPERCASE')).toBe('UPPERCASE');
      expect(converter.detectCaseStyle('MY_CONSTANT')).toBe('UPPERCASE');
      expect(converter.detectCaseStyle('SOME_VALUE')).toBe('UPPERCASE');
    });

    it('should detect lowercase', () => {
      expect(converter.detectCaseStyle('lowercase')).toBe('lowercase');
      expect(converter.detectCaseStyle('myvariable')).toBe('lowercase');
      expect(converter.detectCaseStyle('somevalue')).toBe('lowercase');
    });

    it('should detect package-scope', () => {
      expect(converter.detectCaseStyle('@package')).toBe('package-scope');
      expect(converter.detectCaseStyle('@my-org')).toBe('package-scope');
      expect(converter.detectCaseStyle('@refacto')).toBe('package-scope');
    });
  });

  describe('convertToCase', () => {
    const testWord = 'testWord';

    it('should convert to camelCase', () => {
      expect(converter.convertToCase('test word', 'camelCase')).toBe('testWord');
      expect(converter.convertToCase('TestWord', 'camelCase')).toBe('testWord');
      expect(converter.convertToCase('test-word', 'camelCase')).toBe('testWord');
      expect(converter.convertToCase('test_word', 'camelCase')).toBe('testWord');
    });

    it('should convert to PascalCase', () => {
      expect(converter.convertToCase('test word', 'PascalCase')).toBe('TestWord');
      expect(converter.convertToCase('testWord', 'PascalCase')).toBe('TestWord');
      expect(converter.convertToCase('test-word', 'PascalCase')).toBe('TestWord');
      expect(converter.convertToCase('test_word', 'PascalCase')).toBe('TestWord');
    });

    it('should convert to kebab-case', () => {
      expect(converter.convertToCase('test word', 'kebab-case')).toBe('test-word');
      expect(converter.convertToCase('testWord', 'kebab-case')).toBe('test-word');
      expect(converter.convertToCase('TestWord', 'kebab-case')).toBe('test-word');
      expect(converter.convertToCase('test_word', 'kebab-case')).toBe('test-word');
    });

    it('should convert to snake_case', () => {
      expect(converter.convertToCase('test word', 'snake_case')).toBe('test_word');
      expect(converter.convertToCase('testWord', 'snake_case')).toBe('test_word');
      expect(converter.convertToCase('TestWord', 'snake_case')).toBe('test_word');
      expect(converter.convertToCase('test-word', 'snake_case')).toBe('test_word');
    });

    it('should convert to UPPERCASE', () => {
      expect(converter.convertToCase('testWord', 'UPPERCASE')).toBe('TESTWORD');
      expect(converter.convertToCase('test-word', 'UPPERCASE')).toBe('TEST-WORD');
    });

    it('should convert to lowercase', () => {
      expect(converter.convertToCase('TestWord', 'lowercase')).toBe('testword');
      expect(converter.convertToCase('TEST-WORD', 'lowercase')).toBe('test-word');
    });

    it('should convert to package-scope', () => {
      expect(converter.convertToCase('testWord', 'package-scope')).toBe('@testword');
      expect(converter.convertToCase('test-word', 'package-scope')).toBe('@testword');
    });
  });

  describe('generateVariations', () => {
    it('should generate all case variations', () => {
      const variations = converter.generateVariations('testWord');
      
      expect(variations.has('testWord')).toBe(true);
      expect(variations.has('TestWord')).toBe(true);
      expect(variations.has('test-word')).toBe(true);
      expect(variations.has('test_word')).toBe(true);
      expect(variations.has('TESTWORD')).toBe(true);
      expect(variations.has('testword')).toBe(true);
      expect(variations.has('@testword')).toBe(true);
    });

    it('should map variations to correct styles', () => {
      const variations = converter.generateVariations('myProject');
      
      expect(variations.get('myProject')).toBe('camelCase');
      expect(variations.get('MyProject')).toBe('PascalCase');
      expect(variations.get('my-project')).toBe('kebab-case');
      expect(variations.get('my_project')).toBe('snake_case');
      expect(variations.get('@myproject')).toBe('package-scope');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(converter.convertToCase('', 'camelCase')).toBe('');
      expect(converter.detectCaseStyle('')).toBe('lowercase');
    });

    it('should handle single character strings', () => {
      expect(converter.convertToCase('a', 'PascalCase')).toBe('A');
      expect(converter.convertToCase('A', 'camelCase')).toBe('a');
    });

    it('should handle numbers', () => {
      expect(converter.convertToCase('test123', 'kebab-case')).toBe('test-123');
      expect(converter.convertToCase('test123word', 'kebab-case')).toBe('test-123-word');
    });

    it('should handle special characters', () => {
      expect(converter.convertToCase('test@word', 'camelCase')).toBe('testWord');
      expect(converter.convertToCase('test.word', 'kebab-case')).toBe('test-word');
    });

    it('should return original string for unknown case style', () => {
      // This should hit the default case (line 95)
      const result = converter.convertToCase('test', 'unknown' as any);
      expect(result).toBe('test');
    });
  });
});