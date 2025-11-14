'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createSupabaseServerClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout Error:', error.message);

      return NextResponse.json(
        { error: 'Failed to log out. ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (e) {
    const error = e as Error;
    console.error('Logout Unexpected Error:', error.message);

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
