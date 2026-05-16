import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { status: 'success', message: "API Testing Midtrans Ready" },
    { status: 200 }
  );
};

export async function POST(req: NextRequest) {
  const reqData = await req.json();

  return NextResponse.json(
    { status: 'success', message: "OK" },
    { status: 200 }
  );
}