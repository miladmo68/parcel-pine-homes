export const money = (value: number) => new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
}).format(value);

export const compactMoney = (value: number) => value >= 1000000 ? `$${(value / 1000000).toFixed(value % 1000000 ? 2 : 0)}m` : `$${Math.round(value / 1000)}k`;
