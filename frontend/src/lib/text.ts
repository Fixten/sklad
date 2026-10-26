export const normalizeName = (value: string) =>
  value.trim().toLocaleLowerCase();

export const sameName = (left: string, right: string) =>
  normalizeName(left) === normalizeName(right);
