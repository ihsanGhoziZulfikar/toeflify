'use server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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
