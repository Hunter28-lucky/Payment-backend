import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = [
  'https://bomboclatmines.vercel.app',
  'https://gateway-nine-eta.vercel.app',
  'https://minesbomboclat.netlify.app', // Netlify frontend
  'http://localhost:5173', // for local dev
];

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

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
    const { utr_number, mobile_number, screenshot_url, site_id } = data;
    // Insert payment record into Supabase
    const { error, data: insertData } = await supabase.from('payments').insert([
      {
        utr_number,
        mobile_number,
        screenshot_url,
        site_id,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      },
    ]);
    // Log the result and error for debugging
    console.log('Supabase insert result:', insertData);
    if (error) {
      console.error('Supabase insert error:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'application/json',
        },
      });
    }
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('API route error:', err);
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