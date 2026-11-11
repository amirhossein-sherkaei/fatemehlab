import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('36688862', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}