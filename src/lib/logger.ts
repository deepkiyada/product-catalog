// Production-ready logging utility
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  meta?: any;
  stack?: string;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = this.getLogLevel();
  }

  private getLogLevel(): LogLevel {
    const level = process.env.LOG_LEVEL?.toLowerCase();
    switch (level) {
      case 'error':
        return LogLevel.ERROR;
      case 'warn':
        return LogLevel.WARN;
      case 'info':
        return LogLevel.INFO;
      case 'debug':
        return LogLevel.DEBUG;
      default:
        return this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
    }
  }

  private formatLog(level: string, message: string, meta?: any, stack?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(meta && { meta }),
      ...(stack && { stack }),
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private writeLog(logEntry: LogEntry): void {
    if (this.isDevelopment) {
      // Pretty print for development
      console.log(`[${logEntry.timestamp}] ${logEntry.level.toUpperCase()}: ${logEntry.message}`);
      if (logEntry.meta) {
        console.log('Meta:', logEntry.meta);
      }
      if (logEntry.stack) {
        console.log('Stack:', logEntry.stack);
      }
    } else {
      // JSON format for production
      console.log(JSON.stringify(logEntry));
    }
  }

  error(message: string, meta?: any, error?: Error): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const logEntry = this.formatLog('error', message, meta, error?.stack);
    this.writeLog(logEntry);
  }

  warn(message: string, meta?: any): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const logEntry = this.formatLog('warn', message, meta);
    this.writeLog(logEntry);
  }

  info(message: string, meta?: any): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const logEntry = this.formatLog('info', message, meta);
    this.writeLog(logEntry);
  }

  debug(message: string, meta?: any): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const logEntry = this.formatLog('debug', message, meta);
    this.writeLog(logEntry);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logError = (message: string, meta?: any, error?: Error) => logger.error(message, meta, error);
export const logWarn = (message: string, meta?: any) => logger.warn(message, meta);
export const logInfo = (message: string, meta?: any) => logger.info(message, meta);
export const logDebug = (message: string, meta?: any) => logger.debug(message, meta);
