export type Functions = {
  [name: string]: Function;
};

export const createCyclicFunctionDependenciesManager = <T extends Functions> (): {
  values: T,
  provide: (name: (keyof T) & string, value: Function) => void,
} => {
  const values = new Map<string, Function>();
  const provided = new Map<string, Function>();
  const proxy = new Proxy({}, {
    get (target, name) {
      if (typeof name != 'string') {
        throw new TypeError(`Invalid property type`);
      }
      if (values.has(name)) {
        return values.get(name);
      }
      values.set(name, function (this: any) {
        const realFn = provided.get(name);
        if (!realFn) {
          throw new Error(`Attempted to access cyclic function dependency "${name}" before provided`);
        }
        realFn.apply(this, arguments);
      });
      return values.get(name);
    },
  }) as T;
  return {
    values: proxy,
    provide (name, value) {
      provided.set(name, value);
    },
  };
};
