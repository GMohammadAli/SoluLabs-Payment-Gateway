import { z } from "zod";

import {
  detectCardType,
  validateCardNumber,
  validateCVV,
  validateExpiry,
} from "./card";

export const paymentSchema = z
  .object({
    cardHolder: z.string().min(3, "Cardholder name is required"),

    cardNumber: z
      .string()
      .min(16, "Card number must be 16 digits")
      .refine(validateCardNumber, {
        message: "Invalid card number",
      }),

    expiry: z.string().refine(validateExpiry, {
      message: "Invalid expiry date",
    }),

    cvv: z.string(),

    amount: z
      .number({
        error: "Amount is required",
      })
      .positive("Amount must be greater than 0"),

    currency: z.enum(["INR", "USD"]),
  })
  .superRefine((data, ctx) => {
    const cardType = detectCardType(data.cardNumber);

    if (!validateCVV(data.cvv, cardType)) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid CVV",
        path: ["cvv"],
      });
    }
  });
