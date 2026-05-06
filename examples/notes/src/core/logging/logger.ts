type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel = import.meta.env.DEV ? "debug" : "warn";

function shouldLog(level: LogLevel) {
  return LOG_LEVEL_WEIGHT[level] >= LOG_LEVEL_WEIGHT[MIN_LEVEL];
}

export function createLogger(context: string) {
  const prefix = `[${context}]`;

  return {
    debug: (...args: unknown[]) => shouldLog("debug") && console.debug(prefix, ...args),
    info: (...args: unknown[]) => shouldLog("info") && console.info(prefix, ...args),
    warn: (...args: unknown[]) => shouldLog("warn") && console.warn(prefix, ...args),
    error: (...args: unknown[]) => shouldLog("error") && console.error(prefix, ...args),
  };
}

export const backgroundLogger = createLogger("background");
export const contentLogger = createLogger("content");
export const popupLogger = createLogger("popup");

