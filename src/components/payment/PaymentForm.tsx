"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { paymentSchema } from "@/utils/validators";

import { detectCardType, formatCardNumber, formatExpiry } from "@/utils/card";

import CardPreview from "./CardPreview";

import CardTypeBadge from "./CardTypeBadge";
import { FormValues } from "@/types/payment";

interface Props {
  onSubmit: (data: FormValues) => void | Promise<void>;
  disabled?: boolean;
}

export default function PaymentForm({ onSubmit, disabled }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
    defaultValues: {
      currency: "INR",
    },
  });

  const cardNumber = watch("cardNumber");

  const cardHolder = watch("cardHolder");

  const expiry = watch("expiry");

  const cardType = detectCardType(cardNumber || "");

  return (
    <div className="space-y-6">
      <CardPreview
        cardNumber={cardNumber}
        cardHolder={cardHolder}
        expiry={expiry}
      />

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="mb-1 block">Cardholder Name</label>

          <input
            {...register("cardHolder")}
            className="w-full rounded-lg border p-3"
          />

          {errors.cardHolder && (
            <p className="text-sm text-red-500">{errors.cardHolder.message}</p>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label>Card Number</label>

            <CardTypeBadge type={cardType} />
          </div>

          <input
            {...register("cardNumber")}
            maxLength={19}
            onChange={(e) => {
              setValue("cardNumber", formatCardNumber(e.target.value), {
                shouldValidate: true,
              });
            }}
            className="w-full rounded-lg border p-3"
          />

          {errors.cardNumber && (
            <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block">Expiry</label>

            <input
              {...register("expiry")}
              placeholder="MM/YY"
              className="w-full rounded-lg border p-3"
              onChange={(e) => {
                setValue("expiry", formatExpiry(e.target.value));
              }}
            />

            {errors.expiry && (
              <p className="text-sm text-red-500">{errors.expiry.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block">CVV</label>

            <input
              {...register("cvv")}
              maxLength={cardType === "AMEX" ? 4 : 3}
              className="w-full rounded-lg border p-3"
            />

            {errors.cvv && (
              <p className="text-sm text-red-500">{errors.cvv.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block">Amount</label>

            <input
              type="number"
              {...register("amount", {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border p-3"
            />

            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block">Currency</label>

            <select
              {...register("currency")}
              className="w-full rounded-lg border p-3"
            >
              <option value="INR">INR</option>

              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid || disabled}
          className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}
