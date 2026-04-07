import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://98.80.105.220';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    
    const apiKey = request.headers.get('x-api-key') || process.env.API_KEY || '';
    
    const response = await fetch(`${API_BASE_URL}/api/chatbot/vectorize/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
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

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    
    const apiKey = request.headers.get('x-api-key') || process.env.API_KEY || '';
    
    // DELETE /vectorize expects an array of UUID strings
    const response = await fetch(`${API_BASE_URL}/api/chatbot/vectorize`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify([id])
    });

    if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
    }
    
    const text = await response.text();
    return NextResponse.json({ success: true, message: text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { question, answer, metadata } = body;
    
    const apiKey = request.headers.get('x-api-key') || process.env.API_KEY || '';
    
    // PUT /vectorize expects a single object (not a list)
    const payload = {
      id,
      question,
      answer,
      metadata: metadata || { source: 'faq' }
    };

    const response = await fetch(`${API_BASE_URL}/api/chatbot/vectorize`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
    }
    
    const text = await response.text();
    return NextResponse.json({ success: true, message: text });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
