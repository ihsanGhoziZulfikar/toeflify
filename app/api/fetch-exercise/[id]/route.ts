"use server";
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await context.params;
    const { id: quizId } = resolvedParams;

    type DBQuestion = {
      id: string;
      question_text: string;
      correct_answer_index: number;
      explanation?: string | null;
    };

    type DBOption = {
      option_text: string;
    };

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('question_order', { ascending: true });

    if (questionsError) throw questionsError;
    const questionsWithOptions = await Promise.all(
      (questions || []).map(async (question: DBQuestion) => {
        const { data: options, error: optionsError } = await supabase
          .from('question_options')
          .select('*')
          .eq('question_id', question.id)
          .order('option_order', { ascending: true });

        if (optionsError) throw optionsError;

        return {
          id: question.id,
          questionText: question.question_text,
          options: (options || []).map((opt: DBOption) => opt.option_text),
          correctAnswerIndex: question.correct_answer_index,
          explanation: question.explanation,
        };
      })
    );

    return NextResponse.json({
      ...quiz,
      questions: questionsWithOptions
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching quiz:', message);
    return NextResponse.json(
      { error: message || 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}