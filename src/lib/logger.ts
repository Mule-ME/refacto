/**
 * Logger utility for consistent output formatting
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

export interface LoggerOptions {
  verbose?: boolean;
  silent?: boolean;
  colors?: boolean;
}

export class Logger {
  private options: LoggerOptions;

  constructor(verbose = false, options: Partial<LoggerOptions> = {}) {
    this.options = {
      verbose,
      silent: false,
      colors: process.stdout.isTTY && !process.env.NO_COLOR,
      ...options
    };
  }

  private colorize(text: string, color: string): string {
    if (!this.options.colors) return text;
    
    const colors = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      gray: '\x1b[90m',
      reset: '\x1b[0m'
    };

    return `${colors[color as keyof typeof colors] || ''}${text}${colors.reset}`;
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (this.options.silent) return;
    
    // Skip debug messages unless verbose
    if (level === 'debug' && !this.options.verbose) return;

    const timestamp = new Date().toISOString();
    let coloredMessage = message;
    let prefix = '';

    switch (level) {
      case 'debug':
        coloredMessage = this.colorize(message, 'gray');
        prefix = this.colorize('[DEBUG]', 'gray');
        break;
      case 'info':
        coloredMessage = this.colorize(message, 'blue');
        break;
      case 'warn':
        coloredMessage = this.colorize(message, 'yellow');
        prefix = this.colorize('[WARN]', 'yellow');
        break;
      case 'error':
        coloredMessage = this.colorize(message, 'red');
        prefix = this.colorize('[ERROR]', 'red');
        break;
      case 'success':
        coloredMessage = this.colorize(message, 'green');
        break;
    }

    const output = prefix ? `${prefix} ${coloredMessage}` : coloredMessage;
    
    if (level === 'error') {
      console.error(output, ...args);
    } else {
      console.log(output, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  success(message: string, ...args: any[]): void {
    this.log('success', message, ...args);
  }

  /**
   * Create a child logger with modified options
   */
  child(options: Partial<LoggerOptions>): Logger {
    return new Logger(this.options.verbose, {
      ...this.options,
      ...options
    });
  }

  /**
   * Set verbose mode
   */
  setVerbose(verbose: boolean): void {
    this.options.verbose = verbose;
  }

  /**
   * Set silent mode
   */
  setSilent(silent: boolean): void {
    this.options.silent = silent;
  }
}