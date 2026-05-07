"use client";

import { useEffect, useRef } from "react";

import { PaymentStatus } from "@/types/payment";

interface Props {
  status: PaymentStatus;
  error?: string;
  attempts: number;
  onRetry?: () => void;
}

const statusConfig = {
  PROCESSING: {
    container: "border-blue-200 bg-blue-50",
    dot: "bg-blue-500",
    title: "text-blue-700",
    heading: "Processing Payment...",
    message: "Please wait while we securely process your transaction.",
  },

  SUCCESS: {
    container: "border-emerald-200 bg-emerald-50",
    dot: "bg-emerald-500",
    title: "text-emerald-700",
    heading: "Payment Successful",
    message: "Your payment has been completed successfully.",
  },

  FAILED: {
    container: "border-red-200 bg-red-50",
    dot: "bg-red-500",
    title: "text-red-700",
    heading: "Payment Failed",
    message: "Your payment could not be completed.",
  },

  TIMEOUT: {
    container: "border-amber-200 bg-amber-50",
    dot: "bg-amber-500",
    title: "text-amber-700",
    heading: "Request Timed Out",
    message: "The payment request took too long to respond.",
  },
};

export default function StatusScreen({
  status,
  error,
  attempts,
  onRetry,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status !== "IDLE") {
      headingRef.current?.focus();
    }
  }, [status]);

  if (status === "IDLE") {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />

          <div>
            <h3 className="font-semibold text-emerald-700">Payment Ready</h3>

            <p className="mt-1 text-sm text-emerald-600">
              Your payment session is active and ready for processing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentStatus = statusConfig[status as keyof typeof statusConfig];

  return (
    <div
      aria-live="polite"
      className={`mt-8 rounded-2xl border p-5 transition-all duration-300 ${currentStatus.container}`}
    >
      <div className="flex items-start gap-4">
        <div className={`mt-1 h-3 w-3 rounded-full ${currentStatus.dot}`} />

        <div className="flex-1">
          <p className={`text-sm font-medium ${currentStatus.title}`}>
            Payment Status
          </p>

          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-1 text-2xl font-bold text-slate-900 outline-none"
          >
            {currentStatus.heading}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {status === "FAILED" || status === "TIMEOUT"
              ? error || currentStatus.message
              : currentStatus.message}
          </p>

          {(status === "FAILED" || status === "TIMEOUT") && (
            <>
              <p className="mt-3 text-sm font-medium text-slate-700">
                Attempt {attempts} of 3
              </p>

              {attempts < 3 && onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-4 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Retry Payment
                </button>
              )}

              {attempts >= 3 && (
                <p className="mt-4 text-sm font-medium text-red-600">
                  Maximum retry attempts reached.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
