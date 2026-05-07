import { PaymentStatus, Transaction } from "@/types/payment";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PaymentStore {
  status: PaymentStatus;

  transactions: Transaction[];

  setStatus: (status: PaymentStatus) => void;

  addOrUpdateTransaction: (transaction: Transaction) => void;

  resetPayment: () => void;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      status: "IDLE",

      transactions: [],

      setStatus: (status) => set({ status }),

      addOrUpdateTransaction: (transaction) =>
        set((state) => {
          const exists = state.transactions.find(
            (t) => t.id === transaction.id,
          );

          if (exists) {
            return {
              transactions: state.transactions.map((t) =>
                t.id === transaction.id ? transaction : t,
              ),
            };
          }

          return {
            transactions: [transaction, ...state.transactions],
          };
        }),

      resetPayment: () =>
        set({
          status: "IDLE",
        }),
    }),
    {
      name: "payment-history",
      partialize: (state) => ({
        transactions: state.transactions,
      }),
    },
  ),
);
