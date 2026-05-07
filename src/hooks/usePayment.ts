"use client";

import { useState } from "react";

import { PaymentPayload } from "@/types/payment";

import { usePaymentStore } from "@/store/paymentStore";

export const usePayment = () => {
  const { setStatus, addOrUpdateTransaction } = usePaymentStore();

  const [attempts, setAttempts] = useState(1);

  const [error, setError] = useState("");

  const processPayment = async (
    payload: PaymentPayload,
    existingAttempts = 1,
  ) => {
    setStatus("PROCESSING");

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 6000);

    try {
      const response = await fetch("/api/pay", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        setStatus("FAILED");

        setError(data.message);

        addOrUpdateTransaction({
          id: payload.transactionId,
          amount: payload.amount,
          currency: payload.currency,
          status: "FAILED",
          timestamp: new Date().toISOString(),
          attempts: existingAttempts,
          failureReason: data.message,
        });

        return;
      }

      setStatus("SUCCESS");

      addOrUpdateTransaction({
        id: payload.transactionId,
        amount: payload.amount,
        currency: payload.currency,
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        attempts: existingAttempts,
      });
    } catch (error: unknown) {
      console.error("Error while processing payment:", error);
      setStatus("TIMEOUT");

      setError("Payment request timed out");

      addOrUpdateTransaction({
        id: payload.transactionId,
        amount: payload.amount,
        currency: payload.currency,
        status: "TIMEOUT",
        timestamp: new Date().toISOString(),
        attempts: existingAttempts,
      });
    }
  };

  return {
    processPayment,
    attempts,
    setAttempts,
    error,
  };
};
