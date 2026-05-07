import { PaymentStatus } from "@/types/payment";

interface Props {
  status: PaymentStatus;
  error?: string;
  attempts: number;
  onRetry?: () => void;
}

export default function StatusScreen({
  status,
  error,
  attempts,
  onRetry,
}: Props) {
  if (status === "IDLE") {
    return null;
  }

  return (
    <div tabIndex={-1} className="rounded-xl border p-6 shadow-sm">
      {status === "PROCESSING" && (
        <div>
          <h2 className="text-xl font-bold">Processing Payment...</h2>

          <p className="mt-2 text-gray-500">
            Please wait while we process your transaction.
          </p>
        </div>
      )}

      {status === "SUCCESS" && (
        <div>
          <h2 className="text-xl font-bold text-green-600">
            Payment Successful
          </h2>

          <p className="mt-2 text-gray-500">Your payment has been completed.</p>
        </div>
      )}

      {(status === "FAILED" || status === "TIMEOUT") && (
        <div>
          <h2 className="text-xl font-bold text-red-600">Payment Failed</h2>

          <p className="mt-2 text-gray-500">{error}</p>

          <p className="mt-2 text-sm">Attempt {attempts} of 3</p>

          {attempts < 3 && onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
            >
              Retry Payment
            </button>
          )}

          {attempts >= 3 && (
            <p className="mt-4 text-sm text-red-500">
              Maximum retry attempts reached.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
