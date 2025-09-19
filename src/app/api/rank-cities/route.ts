import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { cities } = await req.json();
  if (!cities || !Array.isArray(cities) || cities.length === 0) {
    return NextResponse.json({ error: 'No cities provided' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Gemini API key' }, { status: 500 });
  }

  // Compose the prompt for Gemini
  const prompt = `Rank the following cities by popularity for both travelers and locals (not just by population). Return the top 8 as a JSON array, most popular first.\nCities: ${cities.join(', ')}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (!geminiRes.ok) {
      return NextResponse.json({ error: 'Gemini API error' }, { status: 500 });
    }
    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Try to parse JSON array from Gemini's response
    let rankedCities: string[] = [];
    try {
  const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        rankedCities = JSON.parse(match[0]);
      }
    } catch (e) {
      // fallback: return raw text
      rankedCities = [];
    }
    return NextResponse.json({ rankedCities, raw: text });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to rank cities with Gemini' }, { status: 500 });
  }
}
