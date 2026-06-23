const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Formats a numeric price as a currency string, e.g. 89.9 -> "$89.90". */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
