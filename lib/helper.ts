export function toTitleCase (str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function isEmpty(value: any): boolean {
  // null or undefined
  if (value == null) return true;

  // boolean
  if (typeof value === "boolean") return false;

  // number
  if (typeof value === "number") return isNaN(value);

  // string
  if (typeof value === "string") return value.trim().length === 0;

  // array
  if (Array.isArray(value)) return value.length === 0;

  // Map / Set
  if (value instanceof Map || value instanceof Set) return value.size === 0;

  // object
  if (typeof value === "object") return Object.keys(value).length === 0;

  // function
  if (typeof value === "function") return false;

  // everything else (symbol, bigint, etc.)
  return false;
}