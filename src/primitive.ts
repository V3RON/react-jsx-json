import { Attributes, createElement } from "react";
import type { PrimitiveComponent } from "./types";

export const REACT_JSONX_PRIMITIVE: unique symbol = Symbol.for(
  "react.jsonx.primitive"
);

export const TEXT_NODE_TYPE: number = -1;

export function isPrimitiveComponent(
  component: unknown
): component is PrimitiveComponent<any> {
  return (
    typeof component === "function" &&
    REACT_JSONX_PRIMITIVE in component &&
    component[REACT_JSONX_PRIMITIVE] !== undefined
  );
}

export function getPrimitiveType<P>(component: PrimitiveComponent<P>): string {
  if (isPrimitiveComponent(component)) {
    return component[REACT_JSONX_PRIMITIVE];
  }
  throw new Error("Component is not a primitive component");
}

export function createPrimitiveComponent<P>(
  type: string
): PrimitiveComponent<P> {
  const Primitive = (props: P) => {
    return createElement(type, props as Attributes);
  };

  Primitive[REACT_JSONX_PRIMITIVE] = type;
  Primitive.displayName = type;

  return Primitive as PrimitiveComponent<P>;
}
