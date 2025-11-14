import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const {
      quiz_id,
      score,
      total_questions,
      percentage,
      time_spent = 0,
      answers = []
    } = await request.json();

    // Validasi input
    if (!quiz_id || score === undefined || !total_questions || percentage === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Insert quiz attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert([
        {
          user_id: user.id,
          quiz_id,
          score,
          total_questions,
          percentage,
          time_spent,
        },
      ])
      .select()
      .single();

    if (attemptError) throw attemptError;

    // 2. Insert answers
    if (answers.length > 0) {
      const answersToInsert = answers.map((answer: any) => ({
        attempt_id: attempt.id,
        question_id: answer.question_id,
        selected_option_index: answer.selected_option_index,
        is_correct: answer.is_correct,
        time_spent: answer.time_spent || 0,
      }));

      const { error: answersError } = await supabase
        .from('attempt_answers')
        .insert(answersToInsert);

      if (answersError) throw answersError;
    }

    return NextResponse.json({ success: true, attemptId: attempt.id });

  } catch (error: any) {
    console.error('Error saving quiz attempt:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save quiz attempt' },
      { status: 500 }
    );
  }
}
