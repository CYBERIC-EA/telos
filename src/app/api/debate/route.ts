// src/app/api/debate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { user_input, recent_history } = await request.json();

  const response = await fetch('https://philbate.onrender.com/debate/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_input: user_input,
      recent_history: recent_history
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}