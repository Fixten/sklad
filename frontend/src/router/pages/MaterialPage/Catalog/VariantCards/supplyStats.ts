import type { SupplyModel } from "@/features/Supply/Supply.model";

export interface VariantSupplyStats {
  stock: number;
  lastSupply?: string;
}

export function supplyStatsByVariant(
  rows: SupplyModel[],
): Map<number, VariantSupplyStats> {
  const stats = new Map<number, VariantSupplyStats>();

  rows.forEach((row) => {
    const previous = stats.get(row.material_variant_id);
    stats.set(row.material_variant_id, {
      stock: (previous?.stock ?? 0) + row.remaining_quantity,
      lastSupply:
        previous?.lastSupply && previous.lastSupply > row.created_at
          ? previous.lastSupply
          : row.created_at,
    });
  });

  return stats;
}
