import { CardType } from "@/types/payment";

interface Props {
  type: CardType;
}

export default function CardTypeBadge({ type }: Props) {
  if (type === "UNKNOWN") {
    return null;
  }

  return (
    <span className="rounded-full bg-[#635BFF]/10 px-3 py-1 text-xs font-semibold text-[#635BFF]">
      {type}
    </span>
  );
}
