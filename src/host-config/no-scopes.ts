const shim = (): void => {
  throw new Error(
    "The current renderer does not support React Scopes. " +
      "This error is likely caused by a bug in React. " +
      "Please file an issue."
  );
};

export const prepareScopeUpdate = shim;
export const getInstanceFromScope = shim;
