import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { buildPaginationMetadata, parsePaginationParams } from '../../paginate';

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

    const { page, size, from, to } = parsePaginationParams(request);

    const {
      data: historyData,
      error: queryError,
      count,
    } = await supabase
      .from('quiz_attempts')
      .select('id, quiz_title, completed_at, score', { count: 'exact' })
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .range(from, to);

    const pagination = buildPaginationMetadata(count ?? 0, page, size);

    if (page > pagination.total_pages) {
      return NextResponse.json(
        { error: 'Page out of range.' },
        { status: 400 }
      );
    }

    if (queryError) throw queryError;

    return NextResponse.json({
      message: 'Fetch quiz history data successful',
      data: { histories: historyData },
      pagination,
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
