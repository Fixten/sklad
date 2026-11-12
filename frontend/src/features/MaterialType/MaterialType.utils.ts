export function typeNamesById(
  types: { id: number; name: string }[],
): Map<number, string> {
  return new Map(types.map((type) => [type.id, type.name]));
}
