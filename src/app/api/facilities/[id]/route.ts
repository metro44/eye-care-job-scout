import { NextRequest, NextResponse } from 'next/server';
import { osmAPI } from '@/lib/free-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const placeId = resolvedParams.id;

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      );
    }

    const facility = await osmAPI.getFacilityDetails(placeId);

    if (!facility) {
      return NextResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ facility });
  } catch (error) {
    console.error('Error in facility details API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch facility details' },
      { status: 500 }
    );
  }
}
