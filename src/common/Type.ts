export const isNotDefinedOrOfType = (obj: object, prop: string, type: "string" | "number" | "boolean") => {
  return obj[prop] == null || typeof obj[prop] == type;
};

export const isArrayOfType = (arr: any, type: "string" | "number" | "boolean") => {
  return Array.isArray(arr) && arr.every((val: any) => typeof val == type);
};
