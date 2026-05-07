"use client";

import { formatCardNumber, formatExpiry } from "@/utils/card";

import CardTypeBadge from "./CardTypeBadge";

import { CardType, FormValues } from "@/types/payment";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void | Promise<void>;
  disabled?: boolean;
  cardType: CardType;
}
export default function PaymentForm({
  form,
  onSubmit,
  disabled,
  cardType,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = form;

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          htmlFor="cardHolder"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Cardholder Name
        </label>

        <input
          {...register("cardHolder")}
          id="cardHolder"
          placeholder="John Doe"
          aria-describedby={errors.cardHolder ? "cardHolder-error" : undefined}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#635BFF] focus:bg-white"
        />

        {errors.cardHolder && (
          <p id="cardHolder-error" className="text-sm text-red-500">
            {errors.cardHolder.message}
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="cardNumber"
            className="text-sm font-medium text-slate-700"
          >
            Card Number
          </label>

          <CardTypeBadge type={cardType} />
        </div>

        <input
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#635BFF] focus:bg-white"
          {...register("cardNumber", {
            onChange: (e) => {
              setValue("cardNumber", formatCardNumber(e.target.value), {
                shouldValidate: true,
              });
            },
          })}
          maxLength={19}
          id="cardNumber"
          placeholder="•••• •••• •••• ••••"
          aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
        />

        {errors.cardNumber && (
          <p id="cardNumber-error" className="text-sm text-red-500">
            {errors.cardNumber.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="expiry"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Expiry Date
          </label>

          <input
            placeholder="MM/YY"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#635BFF] focus:bg-white"
            {...register("expiry", {
              onChange: (e) => {
                setValue("expiry", formatExpiry(e.target.value), {
                  shouldValidate: true,
                });
              },
            })}
            id="expiry"
            aria-describedby={errors.expiry ? "expiry-error" : undefined}
          />

          {errors.expiry && (
            <p id="expiry-error" className="text-sm text-red-500">
              {errors.expiry.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cvv"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            CVV
          </label>

          <input
            {...register("cvv")}
            id="cvv"
            placeholder="CVV"
            maxLength={cardType === "AMEX" ? 4 : 3}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#635BFF] focus:bg-white"
            aria-describedby={errors.cvv ? "cvv-error" : undefined}
          />

          {errors.cvv && (
            <p id="cvv-error" className="text-sm text-red-500">
              {errors.cvv.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Amount
          </label>

          <input
            id="amount"
            type="number"
            placeholder="0"
            {...register("amount", {
              valueAsNumber: true,
            })}
            aria-describedby={errors.amount ? "amount-error" : undefined}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#635BFF] focus:bg-white"
          />
          {errors.amount && (
            <p id="amount-error" className="text-sm text-red-500">
              {errors.amount.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="currency"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Currency
          </label>

          <select
            id="currency"
            {...register("currency")}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#635BFF] focus:bg-white"
          >
            <option>USD</option>
            <option>INR</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || disabled}
        className="w-full rounded-xl bg-[#635BFF] py-4 text-lg font-semibold text-white transition hover:scale-[1.01] hover:bg-[#554BFF]"
      >
        Pay
      </button>
    </form>
  );
}
