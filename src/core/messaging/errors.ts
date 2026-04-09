export class MessagingTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MessagingTimeoutError";
  }
}

export function toRuntimeFailure(error: unknown) {
  if (error instanceof Error) {
    return {
      ok: false,
      error: {
        message: error.message,
      },
    } as const;
  }

  return {
    ok: false,
    error: {
      message: "Unknown messaging error",
    },
  } as const;
}

