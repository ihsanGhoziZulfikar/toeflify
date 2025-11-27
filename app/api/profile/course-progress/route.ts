import { NextResponse } from 'next/server';

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const responseData = {
    data: {
      practice_progress_count: 45,
      practice_progress_max: 140,
      practice_progress: {
        section: [
          {
            name: 'Listening Comprehension',
            progress_count: 20,
            progress_max: 50,
          },
          {
            name: 'Structure and Written Expression',
            progress_count: 10,
            progress_max: 40,
          },
          {
            name: 'Reading Comprehension',
            progress_count: 15,
            progress_max: 50,
          },
        ],
      },
    },
  };

  return NextResponse.json(responseData);
}
