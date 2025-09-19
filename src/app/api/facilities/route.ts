import { NextRequest, NextResponse } from 'next/server';
import { osmAPI } from '@/lib/free-api';
import { SearchFilters } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const radius = searchParams.get('radius');
    const type = searchParams.get('type');
    const minRating = searchParams.get('minRating');
  const limit = searchParams.get('limit');

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    const filters: SearchFilters = {
      location,
      radius: radius ? parseInt(radius) : undefined,
      type: type || undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
    limit: limit ? Math.max(1, Math.min(100, parseInt(limit))) : undefined,
    };

    // Use OSM API (completely free, no API key needed)
    const facilities = await osmAPI.searchEyeCareFacilities(filters);

    return NextResponse.json({ facilities });
  } catch (error) {
    console.error('Error in facilities API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch facilities' },
      { status: 500 }
    );
  }
}
