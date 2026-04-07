import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://98.80.105.220';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    // Map to LLMRequestModel
    const payload = {
        messages: [{
            id: Date.now(),
            type: "INCOMING",
            message_text: message,
            bot_action: null
        }],
        input_message: message,
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

    const apiKey = request.headers.get('x-api-key') || process.env.API_KEY || '';

    const response = await fetch(`${API_BASE_URL}/api/chatbot/chat`, {
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
    
    return NextResponse.json({ 
        content: data.reply || data.answer || JSON.stringify(data)
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
