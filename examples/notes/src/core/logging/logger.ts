export type ConsoleMethod = (...args: unknown[]) => void;

export interface ILogger {
  info: ConsoleMethod;
  warn: ConsoleMethod;
  error: ConsoleMethod;
  debug: ConsoleMethod;
}

export class Logger implements ILogger {
  public info: ConsoleMethod;
  public warn: ConsoleMethod;
  public error: ConsoleMethod;
  public debug: ConsoleMethod;

  private readonly isProduction: boolean;
  private readonly prefix: string | undefined;

  constructor(prefix?: string) {
    this.isProduction = import.meta.env.PROD;
    this.prefix = prefix;

    const make = (methodName: keyof Console, enabled = true): ConsoleMethod => {
      const fn = console[methodName] as ConsoleMethod;
      if (typeof fn !== "function") {
        return () => {
          /* Empty */
        };
      }
      if (!enabled) {
        return () => {
          /* Empty */
        };
      }
      return this.prefix ? fn.bind(console, this.prefix) : fn.bind(console);
    };

    this.info = make("info", !this.isProduction);
    this.warn = make("warn", !this.isProduction);
    this.error = make("error", true);
    this.debug = make("debug", !this.isProduction);
  }
}

export const backgroundLogger = new Logger("[background]");
export const contentLogger = new Logger("[content]");
export const popupLogger = new Logger("[popup]");
export const pageLogger = new Logger("[page]");
