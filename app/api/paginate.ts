import { NextRequest } from 'next/server';

export function parsePaginationParams(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = parseInt(searchParams.get('page') || '1');
  const size = parseInt(searchParams.get('size') || '10');

  if (isNaN(page) || page < 1) throw new Error('INVALID_PAGE');
  if (isNaN(size) || size < 1) throw new Error('INVALID_SIZE');

  const from = (page - 1) * size;
  const to = from + size - 1;

  return { page, size, from, to };
}

export function buildPaginationMetadata(
  total: number,
  page: number,
  size: number
) {
  const totalPages = total > 0 ? Math.ceil(total / size) : 1;

  return {
    total,
    page,
    size,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_prev: page > 1,
  };
}
