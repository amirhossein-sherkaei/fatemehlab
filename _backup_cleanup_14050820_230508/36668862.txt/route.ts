import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('36668862', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}