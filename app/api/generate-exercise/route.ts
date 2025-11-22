// app/api/generate-exercise/route.ts

import { generateObject } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

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
});

interface ExercisePayload {
  skills: string[];
  interests: string;
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
    const supabase = createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skills, interests, difficulty, number, toggles, additional }: ExercisePayload = await req.json();

    if (!interests) {
      return NextResponse.json({ error: 'Interests are required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert quiz generator, specialized in English language learning (like TOEFL or general grammar).
Generate a quiz based *exactly* on the user's specifications.
You MUST strictly follow the requested JSON schema output format.
The user wants exactly ${number} questions.
The difficulty level must be ${difficulty || 'medium'}.
${toggles.explanation ? 'You MUST provide a brief explanation for each answer.' : 'You MUST NOT provide an explanation.'}`;

    const userPrompt = `
    Please generate the quiz now with these parameters:
    - Skills to Focus On: ${skills.length > 0 ? skills.join(', ') : 'General English'}
    - Specific Interests: ${interests || 'General interests'}
    - Difficulty: ${difficulty || 'Medium'}
    - Number of Questions: ${number}
    - Additional Instructions: ${additional || 'None'}
    `;

    const { object: generatedQuiz } = await generateObject({
      model: groq('openai/gpt-oss-20b'),
      schema: quizSchema,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.5,
    });

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert([
        {
          user_id: user.id,
          title: `Custom Exercise: ${interests || 'Untitled'}`,
          interests: interests,
          difficulty: difficulty || 'medium',
          skills: skills,
          total_questions: generatedQuiz.questions.length,
        },
      ])
      .select()
      .single();

    if (quizError) throw quizError;

    const questionsToInsert = generatedQuiz.questions.map((q: { questionText: string; correctAnswerIndex: number; explanation?: string }, index: number) => ({
      quiz_id: quiz.id,
      question_text: q.questionText,
      question_order: index + 1,
      correct_answer_index: q.correctAnswerIndex,
      explanation: toggles.explanation ? q.explanation : null,
    }));

    const { data: insertedQuestions, error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();

    if (questionsError) throw questionsError;

    const optionsToInsert = insertedQuestions.flatMap((question: { id: number }, qIndex: number) => {
      return generatedQuiz.questions[qIndex].options.map((optionText: string, optIndex: number) => ({
        question_id: question.id,
        option_text: optionText,
        option_order: optIndex,
      }));
    });

    const { error: optionsError } = await supabase.from('question_options').insert(optionsToInsert);

    if (optionsError) throw optionsError;

    return NextResponse.json({
      success: true,
      quizId: quiz.id,
    });
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
