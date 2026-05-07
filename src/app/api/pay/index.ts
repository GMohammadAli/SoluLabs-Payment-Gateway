import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'GET request successful',
    data: [],
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  return NextResponse.json(
    {
      success: true,
      message: 'POST request successful',
      data: body,
    },
    { status: 201 }
  );
}
