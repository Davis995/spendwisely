// Currency utility for Ugandan Shillings (UGX)
export const formatCurrency = (amount: number): string => {
  // Format with thousands separators and no decimal places (UGX doesn't use decimals)
  return `UGX ${Math.round(amount).toLocaleString('en-UG')}`;
};

export const formatCurrencyInput = (amount: number): string => {
  // For input fields, show without currency symbol
  return Math.round(amount).toLocaleString('en-UG');
};

export const getCurrencySymbol = (): string => {
  return 'UGX';
};

export const getCurrencyName = (): string => {
  return 'Ugandan Shillings';
};

// Sample budget amounts in UGX for reference
export const SAMPLE_AMOUNTS = {
  COFFEE: 5000,           // ~$1.35
  LUNCH: 15000,           // ~$4
  TRANSPORT: 8000,        // ~$2.15
  MONTHLY_BUDGET: 1500000, // ~$400
  MONTHLY_INCOME: 2000000, // ~$540
  DAILY_BUDGET: 50000,    // ~$13.50
};
