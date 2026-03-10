import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount, currency) {
  const safeCurrency = (currency && typeof currency === 'string' && currency.length === 3) ? currency.toUpperCase() : 'USD';
  const num = typeof amount === 'number' ? amount : parseFloat(amount || 0);
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  } catch (error) {
    // Fallback if the currency code is still somehow invalid
    console.error("Currency format error:", error);
    return `$${num.toFixed(2)}`;
  }
}
