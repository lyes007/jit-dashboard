import { NextResponse } from 'next/server';
import { getAvailableDays } from '@/lib/queries';

export async function GET() {
  try {
    const days = await getAvailableDays();
    return NextResponse.json(days);
  } catch (error) {
    console.error('Error fetching days:', error);
    return NextResponse.json({ error: 'Failed to fetch days' }, { status: 500 });
  }
}

