const amountFormat = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 2,
});

export const parseAmount = (raw: string): number | null => {
  const normalized = raw.trim().replace(",", ".");

  if (!normalized) return null;

  const value = Number(normalized);

  return Number.isFinite(value) ? value : null;
};

export const formatAmount = (value: number) =>
  amountFormat.format(value).replace(/[\u00a0\u202f]/g, " ");
