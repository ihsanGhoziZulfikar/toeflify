'use server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quizData = await request.json();

    if (!quizData.topics || !quizData.questions?.length) {
      return NextResponse.json({ error: 'Topics and questions are required' }, { status: 400 });
    }
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert([
        {
          user_id: user.id,
          title: quizData.title || quizData.topics,
          topics: quizData.topics,
          difficulty: quizData.difficulty || 'medium',
          skills: quizData.skills || [],
          total_questions: quizData.questions.length,
        },
      ])
      .select()
      .single();

    if (quizError) throw quizError;

    const questionsToInsert = quizData.questions.map((q: any, index: number) => ({
      quiz_id: quiz.id,
      question_text: q.questionText,
      question_order: index + 1,
      correct_answer_index: q.correctAnswerIndex,
      explanation: q.explanation || null,
    }));

    const { data: insertedQuestions, error: questionsError } = await supabase.from('questions').insert(questionsToInsert).select();

    if (questionsError) throw questionsError;

    const optionsToInsert = insertedQuestions.flatMap((question: any, qIndex: number) => {
      return quizData.questions[qIndex].options.map((optionText: string, optIndex: number) => ({
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
  } catch (error: any) {
    console.error('Error saving quiz:', error);
    return NextResponse.json({ error: error.message || 'Failed to save quiz' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');

    if (!skill) {
      return NextResponse.json({ error: 'Skill query parameter is required' }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();

    const { data: quizzes, error } = await supabase.from('quizzes').select('*').contains('skills', [skill]);

    if (error) {
      throw error;
    }

    return NextResponse.json(quizzes);
  } catch (error: any) {
    console.error('Error fetching quizzes by skill:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch quizzes' }, { status: 500 });
  }
}
