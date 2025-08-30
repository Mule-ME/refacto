import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger } from '../../src/lib/logger.js';

describe('Logger', () => {
  let consoleSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('basic logging', () => {
    it('should log info messages', () => {
      const logger = new Logger(false, { colors: false });
      
      logger.info('Test message');
      
      expect(consoleSpy).toHaveBeenCalledWith('Test message');
    });

    it('should log error messages to stderr', () => {
      const logger = new Logger(false, { colors: false });
      
      logger.error('Error message');
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Error message');
    });

    it('should log warning messages', () => {
      const logger = new Logger(false, { colors: false });
      
      logger.warn('Warning message');
      
      expect(consoleSpy).toHaveBeenCalledWith('[WARN] Warning message');
    });

    it('should log success messages', () => {
      const logger = new Logger(false, { colors: false });
      
      logger.success('Success message');
      
      expect(consoleSpy).toHaveBeenCalledWith('Success message');
    });
  });

  describe('verbose mode', () => {
    it('should show debug messages when verbose is true', () => {
      const logger = new Logger(true, { colors: false });
      
      logger.debug('Debug message');
      
      expect(consoleSpy).toHaveBeenCalledWith('[DEBUG] Debug message');
    });

    it('should hide debug messages when verbose is false', () => {
      const logger = new Logger(false, { colors: false });
      
      logger.debug('Debug message');
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('silent mode', () => {
    it('should not log anything when silent is true', () => {
      const logger = new Logger(false, { silent: true, colors: false });
      
      logger.info('Info message');
      logger.error('Error message');
      logger.warn('Warning message');
      
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('color handling', () => {
    it('should add colors when colors option is true', () => {
      const logger = new Logger(false, { colors: true });
      
      logger.error('Error message');
      
      // Check that ANSI color codes are present
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('\x1b[31m') // Red color code
      );
    });

    it('should not add colors when colors option is false', () => {
      const logger = new Logger(false, { colors: false });
      
      logger.error('Error message');
      
      // Check that no ANSI color codes are present
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Error message');
    });
  });

  describe('child logger', () => {
    it('should create child logger with modified options', () => {
      const parentLogger = new Logger(false, { colors: false });
      const childLogger = parentLogger.child({ verbose: true });
      
      childLogger.debug('Debug message');
      
      expect(consoleSpy).toHaveBeenCalledWith('[DEBUG] Debug message');
    });

    it('should inherit parent options', () => {
      const parentLogger = new Logger(false, { colors: false, silent: false });
      const childLogger = parentLogger.child({ verbose: true });
      
      childLogger.info('Info message');
      
      expect(consoleSpy).toHaveBeenCalledWith('Info message');
    });
  });

  describe('setters', () => {
    it('should update verbose mode', () => {
      const logger = new Logger(false, { colors: false });
      
      logger.debug('Before verbose');
      expect(consoleSpy).not.toHaveBeenCalled();
      
      logger.setVerbose(true);
      logger.debug('After verbose');
      expect(consoleSpy).toHaveBeenCalledWith('[DEBUG] After verbose');
    });

    it('should update silent mode', () => {
      const logger = new Logger(false, { colors: false });
      
      logger.info('Before silent');
      expect(consoleSpy).toHaveBeenCalledWith('Before silent');
      
      consoleSpy.mockClear();
      logger.setSilent(true);
      logger.info('After silent');
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('additional arguments', () => {
    it('should pass additional arguments to console methods', () => {
      const logger = new Logger(false, { colors: false });
      const obj = { key: 'value' };
      
      logger.info('Message with object:', obj);
      
      expect(consoleSpy).toHaveBeenCalledWith('Message with object:', obj);
    });
  });
});