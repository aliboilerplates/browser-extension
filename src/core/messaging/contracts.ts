export const MESSAGE_TARGET = {
  background: "BACKGROUND",
  content: "CONTENT",
  offscreen: "OFFSCREEN",
} as const;

export type MessageTarget =
  (typeof MESSAGE_TARGET)[keyof typeof MESSAGE_TARGET];

type BaseContract<
  TTarget extends MessageTarget,
  TRequest,
  TResponse,
  TRequiresResponse extends boolean,
> = {
  target: TTarget;
  requiresResponse: TRequiresResponse;
  defaultTimeoutMs?: number;
  __request?: TRequest;
  __response?: TResponse;
};

export function defineMessage<
  TTarget extends MessageTarget,
  TRequest,
  TResponse = void,
>(config: {
  target: TTarget;
  requiresResponse: true;
  defaultTimeoutMs?: number;
}): BaseContract<TTarget, TRequest, TResponse, true>;

export function defineMessage<
  TTarget extends MessageTarget,
  TRequest,
>(config: {
  target: TTarget;
  requiresResponse: false;
  defaultTimeoutMs?: number;
}): BaseContract<TTarget, TRequest, void, false>;

export function defineMessage(config: {
  target: MessageTarget;
  requiresResponse: boolean;
  defaultTimeoutMs?: number;
}) {
  return config;
}

export const messageContracts = {
  "core/getSettings": defineMessage<
    typeof MESSAGE_TARGET.background,
    undefined,
    { theme: "light" | "dark" | "system"; maxNotes: number }
  >({
    target: MESSAGE_TARGET.background,
    requiresResponse: true,
    defaultTimeoutMs: 3_000,
  }),
  "core/updateSettings": defineMessage<
    typeof MESSAGE_TARGET.background,
    Partial<{ theme: "light" | "dark" | "system"; maxNotes: number }>,
    { theme: "light" | "dark" | "system"; maxNotes: number }
  >({
    target: MESSAGE_TARGET.background,
    requiresResponse: true,
    defaultTimeoutMs: 3_000,
  }),
  "demoNotes/getNotes": defineMessage<
    typeof MESSAGE_TARGET.background,
    undefined,
    Array<{
      id: string;
      text: string;
      source: "popup" | "content" | "context-menu";
      createdAt: number;
    }>
  >({
    target: MESSAGE_TARGET.background,
    requiresResponse: true,
    defaultTimeoutMs: 3_000,
  }),
  "demoNotes/createNote": defineMessage<
    typeof MESSAGE_TARGET.background,
    { text: string; source: "popup" | "content" | "context-menu" },
    {
      id: string;
      text: string;
      source: "popup" | "content" | "context-menu";
      createdAt: number;
    }
  >({
    target: MESSAGE_TARGET.background,
    requiresResponse: true,
    defaultTimeoutMs: 3_000,
  }),
  "demoNotes/deleteNote": defineMessage<
    typeof MESSAGE_TARGET.background,
    { id: string }
  >({
    target: MESSAGE_TARGET.background,
    requiresResponse: false,
  }),
  "demoNotes/saveSelectedText": defineMessage<
    typeof MESSAGE_TARGET.background,
    { text: string }
  >({
    target: MESSAGE_TARGET.background,
    requiresResponse: false,
  }),
  "content/showToast": defineMessage<
    typeof MESSAGE_TARGET.content,
    { message: string }
  >({
    target: MESSAGE_TARGET.content,
    requiresResponse: false,
  }),
  "offscreen/ping": defineMessage<
    typeof MESSAGE_TARGET.offscreen,
    undefined,
    { ok: true }
  >({
    target: MESSAGE_TARGET.offscreen,
    requiresResponse: true,
    defaultTimeoutMs: 3_000,
  }),
} as const;

export type AppMessageMap = typeof messageContracts;
export type AppMessageType = keyof AppMessageMap;
export type MessageTypeForTarget<TTarget extends MessageTarget> = {
  [K in AppMessageType]: AppMessageMap[K]["target"] extends TTarget ? K : never;
}[AppMessageType];

export type RequestPayload<TType extends AppMessageType> =
  AppMessageMap[TType] extends { __request?: infer TRequest } ? TRequest : never;

export type ResponsePayload<TType extends AppMessageType> =
  AppMessageMap[TType] extends { __response?: infer TResponse } ? TResponse : never;

export type TargetForMessage<TType extends AppMessageType> = AppMessageMap[TType]["target"];
export type RequiresResponse<TType extends AppMessageType> =
  AppMessageMap[TType]["requiresResponse"];

export type RuntimeRequest<TType extends AppMessageType = AppMessageType> = {
  type: TType;
  target: TargetForMessage<TType>;
  payload: RequestPayload<TType>;
};

export type RuntimeSuccess<TType extends AppMessageType> = {
  ok: true;
  data: ResponsePayload<TType>;
};

export type RuntimeFailure = {
  ok: false;
  error: {
    message: string;
  };
};

export type RuntimeResponse<TType extends AppMessageType> =
  | RuntimeSuccess<TType>
  | RuntimeFailure;

export function isKnownMessageType(value: unknown): value is AppMessageType {
  return typeof value === "string" && value in messageContracts;
}

export function getContract<TType extends AppMessageType>(type: TType) {
  return messageContracts[type];
}

