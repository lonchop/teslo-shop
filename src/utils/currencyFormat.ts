export const currencyFormat = (value: number) => {
  // * Intl.NumberFormat es una clase incorporada en JavaScript que permite el formateo de números en diferentes formatos locales.
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

