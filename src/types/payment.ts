export type PaymentStatus =
  | "IDLE"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "TIMEOUT";

export type CardType = "VISA" | "MASTERCARD" | "AMEX" | "UNKNOWN";

export interface FormValues {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: number;
  currency: "INR" | "USD";
}

export type PaymentPayload = FormValues & {
  transactionId: string;
}; 

export type Currency = "INR" | "USD";

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  timestamp: string;
  attempts: number;
  failureReason?: string;
}
