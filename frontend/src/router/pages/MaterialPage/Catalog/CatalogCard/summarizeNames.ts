export default function summarizeNames(names: string[]): string {
  const shown = names.slice(0, 3);
  const remaining = names.length - shown.length;

  if (remaining === 0) {
    return shown.join(", ");
  }

  return [shown.join(", "), "и ещё", remaining].join(" ");
}
