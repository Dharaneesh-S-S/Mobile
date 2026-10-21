/**
 * Currency utilities for Indian Rupee (₹, INR) and Paise handling.
 * 1 Rupee = 100 Paise.
 */

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Formats paise into Indian Rupee string according to Indian numbering system (en-IN).
 * Examples:
 *   paise = 12345600 -> "₹1,23,456"
 *   paise = -3700    -> "-₹37"
 *   paise = 720900   -> "₹7,209"
 *   paise = 1217900  -> "₹12,179"
 */
export function formatInr(
  paise: number,
  options?: {
    showDecimals?: boolean;
    includeSymbol?: boolean;
    useInternationalGrouping?: boolean;
    spaceAfterSymbol?: boolean;
  }
): string {
  const {
    showDecimals = false,
    includeSymbol = true,
    useInternationalGrouping = false,
    spaceAfterSymbol = false,
  } = options || {};

  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupees = absPaise / 100;

  const locale = useInternationalGrouping ? 'en-US' : 'en-IN';
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  const formattedNumber = formatter.format(rupees);

  if (!includeSymbol) {
    return isNegative ? `-${formattedNumber}` : formattedNumber;
  }

  const symbol = spaceAfterSymbol ? '₹ ' : '₹';
  return isNegative ? `-${symbol}${formattedNumber}` : `${symbol}${formattedNumber}`;
}

/**
 * Compact formatting for small spaces like calendar cells or small badges.
 * Examples:
 *   mode = 'lakhs':
 *     150000 paise (₹1,500) -> "1.5K"
 *     12000000 paise (₹1,20,000) -> "1.2L"
 *     250000000 paise (₹25,00,000) -> "25L"
 *     3500000000 paise (₹3.5 Cr) -> "3.5Cr"
 *   mode = 'full':
 *     2438700 paise -> "24,387"
 */
export function formatCompactInr(
  paise: number,
  mode: 'full' | 'short' | 'lakhs' = 'lakhs',
  includeSymbol: boolean = false
): string {
  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupees = absPaise / 100;
  const symbol = includeSymbol ? '₹' : '';

  if (mode === 'full') {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(rupees);
    return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
  }

  if (rupees >= 10000000) {
    // Crores
    const cr = (rupees / 10000000).toFixed(1).replace(/\.0$/, '');
    return isNegative ? `-${symbol}${cr}Cr` : `${symbol}${cr}Cr`;
  } else if (rupees >= 100000) {
    // Lakhs
    const l = (rupees / 100000).toFixed(1).replace(/\.0$/, '');
    return isNegative ? `-${symbol}${l}L` : `${symbol}${l}L`;
  } else if (rupees >= 1000) {
    // Thousands
    const k = (rupees / 1000).toFixed(1).replace(/\.0$/, '');
    return isNegative ? `-${symbol}${k}K` : `${symbol}${k}K`;
  } else {
    const val = Math.round(rupees).toString();
    return isNegative ? `-${symbol}${val}` : `${symbol}${val}`;
  }
}

/**
 * Parse an input string like "12,345", "123.50", "₹ 450" into integer paise.
 */
export function parseInrToPaise(input: string): number {
  if (!input) return 0;
  const cleaned = input.replace(/[₹,\s]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}
