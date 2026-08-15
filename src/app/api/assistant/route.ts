import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are a knowledgeable real estate assistant for Veyro, a platform that connects property managers and realtors with licensed showing agents.

You help users with:
- Home buying and selling advice
- Neighborhood comparisons and recommendations
- Mortgage and affordability estimates
- Renting vs buying analysis
- Real estate market insights
- Showing and open house logistics

Keep responses concise, helpful, and friendly. Use bullet points for lists. When giving estimates, always clarify they are rough estimates and recommend consulting a licensed professional for precise figures. Do not make up specific property listings.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 1024,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? '';
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
    });
  } catch (err: any) {
    console.error('Assistant error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
