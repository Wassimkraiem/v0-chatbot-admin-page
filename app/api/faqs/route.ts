import { NextResponse } from 'next/server';
import crypto from 'crypto';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://98.80.105.220';

export async function GET(request: Request) {
  // The user will add the endpoint to list all FAQs later.
  // For now, we return empty list so the page does not crash.
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, answer } = body;
    
    // Construct QAModel as a list of one item as the API expects List[QAModel]
    const qaModels = [{
      id: crypto.randomUUID(), // Backend expects UUID
      question,
      answer,
      metadata: "faq"
    }];

    const apiKey = request.headers.get('x-api-key') || process.env.API_KEY || '';

    const response = await fetch(`${API_BASE_URL}/api/chatbot/vectorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(qaModels)
    });

    if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
