const shim = (): void => {
  throw new Error(
    "The current renderer does not support microtasks. " +
      "This error is likely caused by a bug in React. " +
      "Please file an issue."
  );
};

export const supportsMicrotasks = false;
export const scheduleMicrotask = shim;
