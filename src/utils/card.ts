import { CardType } from "@/types/payment";

/**
 * Remove all non-digit characters
 */
const cleanCardNumber = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Format card number with spaces
 *
 * VISA / MASTERCARD:
 * 4242 4242 4242 4242
 *
 * AMEX:
 * 3782 822463 10005
 */
export const formatCardNumber = (value: string): string => {
  const digits = cleanCardNumber(value);

  const cardType = detectCardType(digits);

  // AMEX formatting: 4-6-5
  if (cardType === "AMEX") {
    return digits
      .slice(0, 15)
      .replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" ")
      );
  }

  // VISA / MASTERCARD / UNKNOWN formatting: groups of 4
  return digits
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
};

/**
 * Detect card type from number
 */
export const detectCardType = (cardNumber: string): CardType => {
  const digits = cleanCardNumber(cardNumber);

  // VISA: starts with 4
  if (/^4/.test(digits)) {
    return "VISA";
  }

  // MASTERCARD: 51-55 or 2221-2720
  if (
    /^(5[1-5])/.test(digits) ||
    /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(digits)
  ) {
    return "MASTERCARD";
  }

  // AMEX: 34 or 37
  if (/^3[47]/.test(digits)) {
    return "AMEX";
  }

  return "UNKNOWN";
};

/**
 * Luhn's Algorithm Validation
 * reference -> https://dev.to/mnotr/luhn-algorithm-explained-credit-card-validation-in-javascript-4ggd
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  const digits = cleanCardNumber(cardNumber);

  if (!digits) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (shouldDouble) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * Validate expiry date
 *
 * All Past dates are invalid
 * Accepts:
 * MM/YY
 */
export const validateExpiry = (expiry: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return false;
  }

  const [monthStr, yearStr] = expiry.split("/");

  const month = parseInt(monthStr, 10);
  const year = parseInt(`20${yearStr}`, 10);

  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();

  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Expired
  if (
    year < currentYear ||
    (year === currentYear && month < currentMonth)
  ) {
    return false;
  }

  return true;
};

/**
 * Format expiry date
 *
 * Converts MMYY into MM/YY
 */
export const formatExpiry = (value: string): string => {
  // Remove non-digits
  const digits = value.replace(/\D/g, "").slice(0, 4);

  // Add slash after MM
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return digits;
};

/**
 * Validate CVV
 *
 * VISA / MASTERCARD => 3 digits
 * AMEX => 4 digits
 */
export const validateCVV = (
  cvv: string,
  cardType: CardType = "UNKNOWN"
): boolean => {
  const digits = cvv.replace(/\D/g, "");

  if (cardType === "AMEX") {
    return /^\d{4}$/.test(digits);
  }

  return /^\d{3}$/.test(digits);
};