interface Props {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
}

export default function CardPreview({ cardNumber, cardHolder, expiry }: Props) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-black to-gray-800 p-6 text-white shadow-lg">
      <div className="mb-8 text-sm opacity-70">Payment Card</div>

      <div className="mb-6 text-2xl tracking-widest">
        {cardNumber || "**** **** **** ****"}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs opacity-70">Card Holder</p>

          <p className="uppercase">{cardHolder || "YOUR NAME"}</p>
        </div>

        <div>
          <p className="text-xs opacity-70">Expiry</p>

          <p>{expiry || "MM/YY"}</p>
        </div>
      </div>
    </div>
  );
}
