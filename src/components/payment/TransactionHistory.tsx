"use client";

import { useMemo, useState } from "react";

import { Transaction } from "@/types/payment";

interface Props {
  transactions: Transaction[];
}

const statusStyles = {
  SUCCESS: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  FAILED: "bg-red-50 text-red-700 border border-red-200",
  TIMEOUT: "bg-amber-50 text-amber-700 border border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border border-blue-200",
  IDLE: "bg-slate-50 text-slate-700 border border-slate-200",
};

export default function TransactionHistory({ transactions }: Props) {
  const [showAll, setShowAll] = useState(false);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [transactions]);

  const displayedTransactions = showAll
    ? sortedTransactions
    : sortedTransactions.slice(0, 3);

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Recent Transactions
          </h3>

          <p className="text-sm text-slate-500">
            Track your latest payment attempts
          </p>
        </div>

        {transactions.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="text-sm font-medium text-[#635BFF] transition hover:opacity-80"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      <div
        className={`space-y-3 ${
          showAll && transactions.length > 3
            ? "max-h-[420px] overflow-y-auto pr-2"
            : ""
        }`}
      >
        {transactions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center">
            <p className="text-sm text-slate-500">No transactions yet.</p>
          </div>
        )}

        {displayedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-[#635BFF]/40 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                TXN-{transaction.id}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>{new Date(transaction.timestamp).toLocaleString()}</span>

                {transaction.cardType && (
                  <>
                    <span>•</span>

                    <span>{transaction.cardType}</span>
                  </>
                )}
              </div>

              {transaction.failureReason && (
                <p className="mt-2 text-sm text-red-500">
                  {transaction.failureReason}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
              <div>
                <p className="font-semibold text-slate-900">
                  {transaction.currency} {transaction.amount}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Attempt {transaction.attempts} of 3
                </p>
              </div>

              <div
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[
                    transaction.status as keyof typeof statusStyles
                  ] || statusStyles.IDLE
                }`}
              >
                {transaction.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
