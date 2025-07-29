import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'bot-service.log');

class Logger {
  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const formattedMessage = args.length > 0 ? `${message} ${args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ')}` : message;
    return `[${timestamp}] ${level.toUpperCase()}: ${formattedMessage}`;
  }

  private writeLog(level: string, message: string, ...args: any[]): void {
    const logMessage = this.formatMessage(level, message, ...args);
    
    // Write to console
    console.log(logMessage);
    
    // Write to file
    try {
      fs.appendFileSync(logFile, logMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  info(message: string, ...args: any[]): void {
    this.writeLog('info', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.writeLog('error', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.writeLog('warn', message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.writeLog('debug', message, ...args);
  }
}

export const logger = new Logger();