export const normalizeName = (value: string) => value.trim().toLowerCase();

export const sameName = (left: string, right: string) =>
  normalizeName(left) === normalizeName(right);
