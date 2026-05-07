"use client";

import { useEffect, useState } from "react";

import PaymentForm from "@/components/payment/PaymentForm";

import StatusScreen from "@/components/payment/StatusScreen";

import TransactionHistory from "@/components/payment/TransactionHistory";

import { usePayment } from "@/hooks/usePayment";

import { usePaymentStore } from "@/store/paymentStore";
import { FormValues, PaymentPayload } from "@/types/payment";
import CardPreview from "@/components/payment/CardPreview";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "@/utils/validators";
import { detectCardType } from "@/utils/card";

export default function HomePage() {
  const { processPayment, attempts, setAttempts, error } = usePayment();

  const { status, transactions } = usePaymentStore();

  const [lastPayload, setLastPayload] = useState<PaymentPayload | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
    defaultValues: {
      currency: "INR",
    },
  });

  const cardNumber = form.watch("cardNumber");

  const cardHolder = form.watch("cardHolder");

  const expiry = form.watch("expiry");

  const cardType = detectCardType(cardNumber || "");

  const handleSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      transactionId: crypto.randomUUID(),
      cardType: cardType
    };

    setLastPayload(payload);

    await processPayment(payload);
  };

  const handleRetry = async () => {
    if (!lastPayload || attempts >= 3) {
      return;
    }

    const nextAttempt = attempts + 1;

    setAttempts(nextAttempt);

    await processPayment(lastPayload, nextAttempt);
  };

  useEffect(() => {
    if(status === "SUCCESS") {
      form.reset();
    }
  },[status, form])

  return (
    <main className="min-h-screen bg-[#0A2540] px-4 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <section className="space-y-8">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#00D4FF]">
              SoluLabs Payment Gateway
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Fast, secure payments
              <br />
              with a Stripe-inspired UX.
            </h1>

            <p className="mt-5 max-w-lg text-lg text-slate-300">
              Built a production-grade payment experience with clean validation,
              transaction history, retries, and realistic payment lifecycle
              handling.
            </p>
          </div>

          <CardPreview
            cardNumber={cardNumber}
            cardHolder={cardHolder}
            cardType={cardType}
            expiry={expiry}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <h3 className="font-semibold">Secure</h3>
              <p className="mt-2 text-sm text-slate-300">
                Simulated idempotent payment flow.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <h3 className="font-semibold">Reliable</h3>
              <p className="mt-2 text-sm text-slate-300">
                Retry handling with timeout support.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <h3 className="font-semibold">Modern</h3>
              <p className="mt-2 text-sm text-slate-300">
                Responsive UI inspired by Stripe.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 text-black shadow-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Complete Payment</h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter your payment details below.
              </p>
            </div>

            <div className="rounded-full bg-[#635BFF]/10 px-4 py-2 text-sm font-semibold text-[#635BFF]">
              Test Mode
            </div>
          </div>

          <PaymentForm
            form={form}
            onSubmit={handleSubmit}
            disabled={status === "PROCESSING"}
            cardType={cardType}
          />

          <StatusScreen
            status={status}
            error={error}
            attempts={attempts}
            onRetry={handleRetry}
          />

          <TransactionHistory transactions={transactions} />
        </section>
      </div>
    </main>
  );
}
