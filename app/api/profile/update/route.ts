import { updateProfileSchema } from '@/lib/schemas/profile';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, imageUrl } = validation.data;
    const supabase = createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = {};

    if (fullName) updates.full_name = fullName;
    if (imageUrl) updates.image_url = imageUrl;

    let updatedProfileData = null;

    if (Object.keys(updates).length > 0) {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }
      updatedProfileData = data;
    }

    let emailChangeMessage = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authUpdates: any = {};

    if (email && email !== user.email) {
      authUpdates.email = email;
      emailChangeMessage =
        'Confirmation links have been sent to both your old and new email addresses.';
    }

    if (fullName) {
      authUpdates.data = { full_name: fullName };
    }

    if (Object.keys(authUpdates).length > 0) {
      const { error: authUpdateError } =
        await supabase.auth.updateUser(authUpdates);

      if (authUpdateError) {
        return NextResponse.json(
          { error: authUpdateError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      emailMessage: emailChangeMessage,
      data: updatedProfileData,
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
