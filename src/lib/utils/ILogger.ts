export interface ILogger {
  info(message: any, metadata?: object): void;
  error(message: string, metadata?: object): void;
  warn(message: string, metadata?: object): void;
  debug(message: string, metadata?: object): void;
}
