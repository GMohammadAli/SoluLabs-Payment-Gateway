import { Transaction } from "@/types/payment";

interface Props {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: Props) {
  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">Transaction History</h2>

      {transactions.length === 0 && (
        <p className="text-gray-500">No transactions yet.</p>
      )}

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="rounded-lg border p-3">
            <p className="text-sm font-semibold">{transaction.id}</p>

            <p className="text-sm">
              {transaction.currency} {transaction.amount}
            </p>

            <p className="text-sm">Status: {transaction.status}</p>

            <p className="text-xs text-gray-500">
              {new Date(transaction.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
