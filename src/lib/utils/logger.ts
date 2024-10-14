import { ILogger } from "./ILogger";

export class Logger implements ILogger {
  info(message: string, metadata?: object): void {
    console.log(`[INFO] ${message}`, metadata);
  }

  error(message: string, metadata?: object): void {
    console.error(`[ERROR] ${message}`, metadata);
  }

  warn(message: string, metadata?: object): void {
    console.warn(`[WARN] ${message}`, metadata);
  }

  debug(message: string, metadata?: object): void {
    console.debug(`[DEBUG] ${message}`, metadata);
  }
}

export const logger = new Logger();
