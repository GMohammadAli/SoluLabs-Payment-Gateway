interface Props {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cardType: string;
}

export default function CardPreview({
  cardNumber,
  cardHolder,
  expiry,
  cardType,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1A1F36] to-[#0A2540] p-8 shadow-2xl backdrop-blur-xl">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#635BFF]/20 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <div className="mb-10 text-2xl tracking-[0.3em]">
              {cardNumber || "**** **** **** ****"}
            </div>
          </div>

          <div className="rounded-full bg-[#635BFF] px-4 py-2 text-sm font-semibold">
            {cardType || "CARD_COMPANY"}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Card Holder
            </p>

            <p className="mt-1 font-medium uppercase tracking-wide">
              {cardHolder || "YOUR NAME"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Expires
            </p>

            <p className="mt-1 font-medium">{expiry || "MM/YY"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
