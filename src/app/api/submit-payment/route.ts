import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://bomboclatmines.vercel.app',
  'https://gateway-nine-eta.vercel.app',
  'http://localhost:5173', // for local dev
];

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }
  return new NextResponse(null, { status: 403 });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(JSON.stringify({ error: 'CORS not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const data = await req.json();
    // Here you would process/store the payment data
    return new NextResponse(JSON.stringify({ success: true, received: data }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      },
    });
  }
} 