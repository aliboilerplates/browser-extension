import {
  backgroundMessageConfig,
  type BackgroundMessageMap,
} from "./definitions/backgroundMessages";
import {
  contentMessageConfig,
  type ContentMessageMap,
} from "./definitions/contentMessages";
import { MESSAGE_TARGET } from "./messageConstants";
import {
  offscreenMessageConfig,
  type OffscreenMessageMap,
} from "./definitions/offscreenMessages";

export type MessageTarget =
  (typeof MESSAGE_TARGET)[keyof typeof MESSAGE_TARGET];

export interface MessageTargetMap {
  [MESSAGE_TARGET.background]: BackgroundMessageMap;
  [MESSAGE_TARGET.content]: ContentMessageMap;
  [MESSAGE_TARGET.offscreen]: OffscreenMessageMap;
}

export interface MessageConfig {
  requiresResponse: boolean;
}

export type MessageConfigMap<TMap> = {
  [K in keyof TMap]: MessageConfig;
};

type AllMessageConfig = typeof backgroundMessageConfig &
  typeof contentMessageConfig &
  typeof offscreenMessageConfig;

export type AppMessageType = {
  [TTarget in MessageTarget]: Extract<keyof MessageTargetMap[TTarget], string>;
}[MessageTarget];

export type MessageTypeForTarget<TTarget extends MessageTarget> = Extract<
  keyof MessageTargetMap[TTarget],
  AppMessageType
>;

type MessageDefinition<TType extends AppMessageType> = {
  [TTarget in MessageTarget]: TType extends keyof MessageTargetMap[TTarget]
    ? MessageTargetMap[TTarget][TType]
    : never;
}[MessageTarget];

export type RequestPayload<TType extends AppMessageType> =
  MessageDefinition<TType>["request"];

export type ResponsePayload<TType extends AppMessageType> =
  MessageDefinition<TType>["response"];

export type TargetForMessage<TType extends AppMessageType> = {
  [TTarget in MessageTarget]: TType extends keyof MessageTargetMap[TTarget]
    ? TTarget
    : never;
}[MessageTarget];

export type RequiresResponse<TType extends AppMessageType> =
  AllMessageConfig[TType]["requiresResponse"];

export interface RuntimeRequest<TType extends AppMessageType = AppMessageType> {
  type: TType;
  target: TargetForMessage<TType>;
  payload: RequestPayload<TType>;
}

export interface RuntimeSuccess<TType extends AppMessageType> {
  ok: true;
  data: ResponsePayload<TType>;
}

export interface RuntimeFailure {
  ok: false;
  error: {
    message: string;
  };
}

export type RuntimeResponse<TType extends AppMessageType> =
  | RuntimeSuccess<TType>
  | RuntimeFailure;

/**
 * Discriminated success/failure union for handler response payloads.
 *
 * `RuntimeResponse` is the *transport* layer: did the message round-trip?
 * `Result` is the *domain* layer: did the handler's business logic succeed?
 *
 * The two compose. A handler's `RuntimeSuccess.data` is often a `Result`,
 * which means consumers see two `ok` fields stacked:
 *
 *     const response = await sendMessage("core/ping");
 *     if (!response.ok) return;        // transport failure
 *     const result = response.data;    // Result<...>
 *     if (!result.ok) return;          // domain failure: result.error.code
 *     // success: spread fields from TData are flat on result
 *
 * `TCode` is a string-literal union of error codes; defaults to `string` for
 * untyped failures. `TData` carries success-only fields. `TErrorData` carries
 * extra error context alongside `code`. All default to empty so bare
 * `Result` is valid.
 */
export type Result<
  TCode extends string = string,
  TData extends object = object,
  TErrorData extends object = object,
> =
  | ({ ok: true } & TData)
  | { ok: false; error: { code: TCode } & TErrorData };
