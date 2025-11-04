import { DefaultEventPriority } from "react-reconciler/constants";
import type { ReactNode } from "react";
import type { JsonNode, PrimitiveComponent } from "./types";
import {
  getPrimitiveType,
  isPrimitiveComponent,
  TEXT_NODE_TYPE,
} from "./primitive";
import * as noHydration from "./host-config/no-hydration";
import * as noScopes from "./host-config/no-scopes";
import * as noTestSelectors from "./host-config/no-test-selectors";
import * as noPersistence from "./host-config/no-persistence";
import * as noMicrotasks from "./host-config/no-microtasks";

const NO_CONTEXT = {};

type Instance = JsonNode;

const appendInitialChild = (parentInstance: Instance, child: Instance) => {
  if (!parentInstance.c) {
    parentInstance.c = [];
  }
  parentInstance.c.push(child);
};

const createTextInstance = (text: string): Instance => {
  return {
    t: TEXT_NODE_TYPE,
    v: text,
  };
};

const finalizeInitialChildren = (
  _instance: Instance,
  _type: string,
  _props: Record<string, unknown>,
  _rootContainerInstance: unknown,
  _hostContext: unknown
) => {
  return false;
};

const getPublicInstance = (instance: Instance) => {
  return instance;
};

const prepareForCommit = () => {
  return null;
};

const prepareUpdate = (
  _instance: Instance,
  _type: string,
  _oldProps: Record<string, unknown>,
  _newProps: Record<string, unknown>,
  _rootContainerInstance: unknown,
  _hostContext: unknown
) => {
  return null;
};

const resetAfterCommit = () => {};

const resetTextContent = () => {};

const getRootHostContext = () => {
  return NO_CONTEXT;
};

const getChildHostContext = () => {
  return NO_CONTEXT;
};

const scheduleTimeout = setTimeout;
const cancelTimeout = clearTimeout;
const noTimeout = -1;

const shouldSetTextContent = () => {
  return false;
};

const getCurrentEventPriority = () => {
  return DefaultEventPriority;
};

const isPrimaryRenderer = false;

const warnsIfNotActing = false;

const supportsMutation = true;

const appendChild = (parentInstance: Instance, child: Instance) => {
  if (!parentInstance.c) {
    parentInstance.c = [];
  }
  parentInstance.c.push(child);
};

const appendChildToContainer = (
  container: Instance | Instance[],
  child: Instance
) => {
  const containerArray = Array.isArray(container)
    ? container
    : (container as unknown as { container: Instance[] }).container;
  containerArray.push(child);
};

const insertBefore = (
  parentInstance: Instance,
  child: Instance,
  beforeChild: Instance
) => {
  if (!parentInstance.c) {
    parentInstance.c = [];
  }
  const index = parentInstance.c.indexOf(beforeChild);
  if (index >= 0) {
    parentInstance.c.splice(index, 0, child);
  } else {
    parentInstance.c.push(child);
  }
};

const insertInContainerBefore = (
  container: Instance | Instance[],
  child: Instance,
  beforeChild: Instance
) => {
  const containerArray = Array.isArray(container)
    ? container
    : (container as unknown as { container: Instance[] }).container;
  const index = containerArray.indexOf(beforeChild);
  if (index >= 0) {
    containerArray.splice(index, 0, child);
  } else {
    containerArray.push(child);
  }
};

const removeChild = (parentInstance: Instance, child: Instance) => {
  if (parentInstance.c) {
    const index = parentInstance.c.indexOf(child);
    if (index >= 0) {
      parentInstance.c.splice(index, 1);
    }
  }
};

const removeChildFromContainer = (
  container: Instance | Instance[],
  child: Instance
) => {
  const containerArray = Array.isArray(container)
    ? container
    : (container as unknown as { container: Instance[] }).container;
  const index = containerArray.indexOf(child);
  if (index >= 0) {
    containerArray.splice(index, 1);
  }
};

const commitTextUpdate = (
  textInstance: Instance,
  _oldText: string,
  newText: string
) => {
  if (textInstance.t === TEXT_NODE_TYPE) {
    textInstance.v = newText;
  }
};

const commitMount = (
  _instance: Instance,
  _type: string,
  _newProps: Record<string, unknown>
) => {};

const commitUpdate = (
  instance: Instance,
  _updatePayload: unknown,
  _type: string,
  _oldProps: Record<string, unknown>,
  newProps: Record<string, unknown>
) => {
  if (instance) {
    const { children: _children, ...restProps } = newProps as {
      children?: ReactNode;
      [key: string]: unknown;
    };
    if (Object.keys(restProps).length > 0) {
      instance.p = restProps;
    } else {
      delete instance.p;
    }
  }
};

const hideInstance = (_instance: Instance) => {};

const hideTextInstance = () => {};

const unhideInstance = (
  _instance: Instance,
  _props: Record<string, unknown>
) => {};

const unhideTextInstance = () => {};

const clearContainer = (container: Instance | Instance[]) => {
  const containerArray = Array.isArray(container)
    ? container
    : (container as unknown as { container: Instance[] }).container;
  containerArray.length = 0;
};

const getInstanceFromNode = () => {
  throw new Error("Not implemented.");
};

const beforeActiveInstanceBlur = () => {};

const afterActiveInstanceBlur = () => {};

const preparePortalMount = (): void => {};

const detachDeletedInstance = (): void => {};

export const getHostConfig = (
  knownPrimitives: PrimitiveComponent<any>[]
): any => {
  const knownPrimitivesMap = new Map<string, number>(
    knownPrimitives.map((primitive, index) => {
      if (!isPrimitiveComponent(primitive)) {
        throw new Error(
          "All primitives must be created using createPrimitiveComponent"
        );
      }
      const typeName = getPrimitiveType(primitive);
      return [typeName, index];
    })
  );

  const createInstance = (
    type: string,
    props: Record<string, unknown>
  ): Instance => {
    const primitiveIndex = knownPrimitivesMap.get(type);

    if (primitiveIndex === undefined) {
      const availablePrimitives = Array.from(knownPrimitivesMap.keys()).join(
        ", "
      );
      throw new Error(
        `Unknown primitive type: "${type}". Available primitives: ${availablePrimitives || "none"}. Make sure you registered this primitive component with createReactJsonx.`
      );
    }

    const instance: JsonNode = {
      t: primitiveIndex,
    };

    const { children: _children, ...restProps } = props as {
      children?: ReactNode;
      [key: string]: unknown;
    };

    if (Object.keys(restProps).length > 0) {
      instance.p = restProps;
    }

    return instance;
  };

  return {
    ...noHydration,
    ...noScopes,
    ...noTestSelectors,
    ...noPersistence,
    ...noMicrotasks,
    appendInitialChild,
    createInstance,
    createTextInstance,
    finalizeInitialChildren,
    getPublicInstance,
    prepareForCommit,
    prepareUpdate,
    resetAfterCommit,
    resetTextContent,
    getRootHostContext,
    getChildHostContext,
    scheduleTimeout,
    cancelTimeout,
    noTimeout,
    shouldSetTextContent,
    getCurrentEventPriority,
    isPrimaryRenderer,
    warnsIfNotActing,
    supportsMutation,
    appendChild,
    appendChildToContainer,
    insertBefore,
    insertInContainerBefore,
    removeChild,
    removeChildFromContainer,
    commitTextUpdate,
    commitMount,
    commitUpdate,
    hideInstance,
    hideTextInstance,
    unhideInstance,
    unhideTextInstance,
    clearContainer,
    getInstanceFromNode,
    beforeActiveInstanceBlur,
    afterActiveInstanceBlur,
    preparePortalMount,
    detachDeletedInstance,
  };
};
