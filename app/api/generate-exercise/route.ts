// app/api/generate-exercise/route.ts

import { streamObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const quizSchema = z.object({
  questions: z.array(
    z.object({
      questionText: z.string().describe('The main text of the question.'),
      options: z.array(z.string()).min(4).max(10).describe('An array of 4 to 10 possible answers.'),
      correctAnswerIndex: z.number().min(0).max(9).describe('The 0-based index of the correct answer in the options array.'),
      explanation: z.string().optional().describe('A brief explanation for why the answer is correct.'),
    })
  ),
  // metadata: z.object({ ... })
});

interface ExercisePayload {
  skills: string[];
  topics: string;
  difficulty: string;
  number: number;
  toggles: {
    answerKey: boolean;
    explanation: boolean;
  };
  additional: string;
}

export async function POST(req: Request) {
  try {
    const { skills, topics, difficulty, number, toggles, additional }: ExercisePayload = await req.json();

    const systemPrompt = `You are an expert quiz generator, specialized in English language learning (like TOEFL or general grammar).
Generate a quiz based *exactly* on the user's specifications.
You MUST strictly follow the requested JSON schema output format.
The user wants exactly ${number} questions.
The difficulty level must be ${difficulty || 'medium'}.
${toggles.explanation ? 'You MUST provide a brief explanation for each answer.' : 'You MUST NOT provide an explanation.'}`;

    const userPrompt = `
    Please generate the quiz now with these parameters:
    - Skills to Focus On: ${skills.length > 0 ? skills.join(', ') : 'General English'}
    - Specific Topics: ${topics || 'General topics'}
    - Difficulty: ${difficulty || 'Medium'}
    - Number of Questions: ${number}
    - Additional Instructions: ${additional || 'None'}
    `;

    const result = streamObject({
      model: groq('openai/gpt-oss-20b'),
      schema: quizSchema,
      system: systemPrompt,
      prompt: userPrompt,
      //   maxOutputTokens: 1500,
      temperature: 0.5,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[API Generate Error]', error);

    return new NextResponse(
      JSON.stringify({
        error: 'Failed to generate exercise. Please check the API logs.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
