import type { ComponentType } from "react";
import { REACT_JSONX_PRIMITIVE } from "./primitive";

export type JsonNode = {
  t: number;
  p?: Record<string, unknown>;
  c?: JsonNode[];
  v?: string;
};

export type PrimitiveComponent<P> = ComponentType<P> & {
  readonly [REACT_JSONX_PRIMITIVE]: string;
};
