import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://98.80.105.220';

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    
    const apiKey = request.headers.get('x-api-key') || process.env.API_KEY || '';
    
    const payload = {
        messages: [],
        input_message: question,
        is_followup: false,
        is_final: false,
        is_signed: false,
        submission: {
            id: 0,
            video_url: "",
            submission_url: "",
            ig_handle: ""
        }
    };

    const response = await fetch(`${API_BASE_URL}/api/chatbot/chat/testing-with-resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
    }
    
    const data = await response.json();

    const mappedAnswer = data?.response?.answer || data?.answer || data?.reply || JSON.stringify(data);
    const mappedChunks = data?.resources?.map((r: any, idx: number) => ({
        id: r?.metadata?._id || String(idx),
        text: r?.content || JSON.stringify(r),
        similarity: r?.score || r?.metadata?.score || 1.0
    })) || data?.sourceChunks || [];
    
    return NextResponse.json({ 
        answer: mappedAnswer,
        sourceChunks: mappedChunks
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
