import React, { ReactNode } from "react";
import Reconciler from "react-reconciler";
import { LegacyRoot } from "react-reconciler/constants";
import { getHostConfig } from "./host-config";
import { JsonNode, PrimitiveComponent } from "./types";

export type ReactJsxJson = {
  render: (element: ReactNode) => JsonNode;
  unmount: () => void;
};

export type ReactJsxJsonOptions = {
  knownPrimitives: PrimitiveComponent<any>[];
};

export const createReactJsxJson = ({
  knownPrimitives,
}: ReactJsxJsonOptions): ReactJsxJson => {
  if (knownPrimitives.length === 0) {
    throw new Error("At least one primitive component must be provided");
  }

  const root = { container: [] };

  const reconciler = Reconciler(getHostConfig(knownPrimitives));

  reconciler.injectIntoDevTools({
    findFiberByHostInstance: () => null,
    bundleType: "__DEV__" in global ? 1 : 0,
    version: React.version,
    rendererPackageName: "react-jsx-json",
  });

  const mountNode = reconciler.createContainer(
    root,
    LegacyRoot,
    null,
    false,
    false,
    "",
    () => {},
    null
  );

  return {
    render: (element: ReactNode) => {
      reconciler.flushSync(() => {
        reconciler.updateContainer(element, mountNode);
      });
      return root.container[0] as unknown as JsonNode;
    },
    unmount: () => {
      reconciler.updateContainer(null, mountNode);
    },
  };
};
