import { NextResponse } from 'next/server';
import { getLessonSkills } from '@/lib/data-manager';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;

  const section = params.get('section') ?? undefined;
  const chapter = params.get('chapter') ?? undefined;
  const topic = params.get('topic') ?? undefined;
  const search = params.get('q') ?? params.get('search') ?? undefined;

  const pageParam = Number.parseInt(params.get('page') ?? '1', 10);
  const sizeParam = Number.parseInt(params.get('pageSize') ?? params.get('size') ?? '12', 10);

  const page = Number.isNaN(pageParam) ? 1 : pageParam;
  const pageSize = Number.isNaN(sizeParam) ? 12 : sizeParam;

  try {
    const data = await getLessonSkills({
      section,
      chapter,
      topic,
      search,
      page,
      pageSize,
    });

    return NextResponse.json({
      data: data.items,
      pagination: data.pagination,
    });
  } catch (error) {
    console.error('Failed to fetch lessons skills:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons data' }, { status: 500 });
  }
}
