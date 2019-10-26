export class UnreachableError extends Error {
  constructor (message?: any) {
    super(`${message}`);
  }
}

export class AssertionError extends Error {
}

export const assert = (val: boolean) => {
  if (!val) {
    throw new AssertionError(`Assertion error`);
  }
};

export const assertExists = <T> (val: T | null | undefined): T => {
  if (val == undefined) {
    throw new AssertionError(`Assertion error`);
  }
  return val;
};
