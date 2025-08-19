import { NextRequest, NextResponse } from 'next/server';
import { geminiAPI } from '@/lib/free-api';
import { EnquiryData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: EnquiryData = await request.json();

    // Validate required fields
    if (!body.facilityName || !body.facilityAddress || !body.userExperience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const enquiry = await geminiAPI.generateEnquiry(body);

    return NextResponse.json({ enquiry });
  } catch (error) {
    console.error('Error in enquiry API:', error);
    return NextResponse.json(
      { error: 'Failed to generate enquiry' },
      { status: 500 }
    );
  }
}
