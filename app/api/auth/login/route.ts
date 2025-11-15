'use server';

import { loginSchema } from '@/lib/schemas/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const supabase = createSupabaseServerClient();

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, image_url, level, score')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error(
        'Failed to fetch profile after login:',
        profileError.message
      );
      return NextResponse.json(
        { error: 'Login successful, but failed to fetch profile data.' },
        { status: 500 }
      );
    }

    const userProfile = {
      id: authData.user.id,
      full_name: profileData.full_name,
      email: authData.user.email,
      image_url: profileData.image_url,
      level: profileData.level,
      score: profileData.score,
    };

    return NextResponse.json({
      message: 'Login successful',
      user: userProfile,
    });
  } catch (e) {
    const error = e as Error;
    console.error('Login Error:', error.message);

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
