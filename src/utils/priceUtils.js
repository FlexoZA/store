/**
 * Formats a price in South African currency format
 * @param {number} price - The price to format
 * @returns {string} Formatted price string (e.g., "55,999.00")
 */
export const formatPrice = (price) => {
  if (!price) return '0.00'
  // First format with standard locale
  const formatted = price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatted
}
