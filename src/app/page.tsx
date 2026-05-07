"use client";

import { useRef, useState } from "react";

import PaymentForm from "@/components/payment/PaymentForm";

import StatusScreen from "@/components/payment/StatusScreen";

import TransactionHistory from "@/components/payment/TransactionHistory";

import { usePayment } from "@/hooks/usePayment";

import { usePaymentStore } from "@/store/paymentStore";
import { FormValues, PaymentPayload } from "@/types/payment";

export default function HomePage() {
  const { processPayment, attempts, setAttempts, error } = usePayment();

  const { status, transactions } = usePaymentStore();

  const [lastPayload, setLastPayload] = useState<PaymentPayload | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (
    data: FormValues,
  ) => {
    const payload = {
      ...data,
      transactionId: crypto.randomUUID(),
    };

    setLastPayload(payload);

    await processPayment(payload);

    resultRef.current?.focus();
  };

  const handleRetry = async () => {
    if (!lastPayload || attempts >= 3) {
      return;
    }

    const nextAttempt = attempts + 1;

    setAttempts(nextAttempt);

    await processPayment(lastPayload, nextAttempt);
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-8 p-6 md:grid-cols-2">
      <div>
        <PaymentForm
          onSubmit={handleSubmit}
          disabled={status === "PROCESSING"}
        />
      </div>

      <div className="space-y-6">
        <div ref={resultRef} tabIndex={-1}>
          <StatusScreen
            status={status}
            error={error}
            attempts={attempts}
            onRetry={handleRetry}
          />
        </div>

        <TransactionHistory transactions={transactions} />
      </div>
    </main>
  );
}
