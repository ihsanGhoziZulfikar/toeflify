import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to view history.' },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const pageParam = searchParams.get('page');
    const sizeParam = searchParams.get('size');

    let query = supabase
      .from('quiz_attempts')
      .select('id, quiz_title, completed_at, score')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (pageParam && sizeParam) {
      const page = parseInt(pageParam);
      const size = parseInt(sizeParam);

      if (isNaN(page) || page < 1 || isNaN(size) || size < 1) {
        return NextResponse.json(
          { error: 'Invalid page or size parameters.' },
          { status: 400 }
        );
      }

      const from = (page - 1) * size;
      const to = from + size - 1;

      query = query.range(from, to);
    }

    const { data: historyData, error: queryError } = await query;

    if (queryError) {
      console.error('Quiz History Fetch Error:', queryError.message);

      return NextResponse.json(
        { error: 'Failed to fetch quiz history.' },
        { status: 500 }
      );
    }

    const histories = historyData.map((attempt) => ({
      id: attempt.id,
      title: attempt.quiz_title,
      date: attempt.completed_at,
      score: attempt.score,
    }));

    return NextResponse.json({
      message: 'Fetch quiz history data successful',
      data: {
        histories: histories,
      },
    });
  } catch (e) {
    const error = e as Error;
    console.error('Unexpected Error:', error.message);

    return NextResponse.json(
      { error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
