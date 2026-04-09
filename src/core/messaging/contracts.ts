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
