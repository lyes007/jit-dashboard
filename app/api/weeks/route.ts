import { NextResponse } from 'next/server';
import { getAvailableWeeks } from '@/lib/queries';

export async function GET() {
  try {
    const weeks = await getAvailableWeeks();
    return NextResponse.json(weeks);
  } catch (error) {
    console.error('Error fetching weeks:', error);
    return NextResponse.json({ error: 'Failed to fetch weeks' }, { status: 500 });
  }
}

