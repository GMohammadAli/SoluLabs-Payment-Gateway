import { NextResponse } from "next/server";

const failureReasons = [
  "Insufficient funds",
  "Bank declined transaction",
  "Card expired",
];

export async function POST() {
  const random = Math.random();

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // SUCCESS
  if (random < 0.6) {
    return NextResponse.json({
      success: true,
      message: "Payment successful",
    });
  }

  // FAILURE
  if (random < 0.85) {
    const randomReason =
      failureReasons[Math.floor(Math.random() * failureReasons.length)];

    return NextResponse.json(
      {
        success: false,
        message: randomReason,
      },
      {
        status: 400,
      },
    );
  }

  // TIMEOUT
  await new Promise((resolve) => setTimeout(resolve, 8000));

  return NextResponse.json({
    success: false,
    message: "Request timeout",
  });
}
