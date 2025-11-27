import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import imageCompression from 'browser-image-compression';
import { getPathFromUrl } from '@/lib/utils';

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 500,
  useWebWorker: true,
  fileType: 'image/webp',
};

export const uploadProfilePicture = async (
  file: File,
  userId: string,
  oldImageUrl?: string
): Promise<string> => {
  const bucketName = 'profile_picture';
  const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);

  const supabase = createSupabaseBrowserClient();

  if (oldImageUrl && oldImageUrl.includes(`/${bucketName}/`)) {
    const oldPath = getPathFromUrl(oldImageUrl, bucketName);

    if (oldPath) {
      const { data: deleteData, error: deleteError } = await supabase.storage
        .from('profile_picture')
        .remove([oldPath]);

      if (deleteError) {
        console.error('Failed to delete the old file: ', deleteError.message);
      } else if (deleteData && deleteData.length > 0) {
        console.log('Old file deleted successfully: ', deleteData);
      }
    }
  }

  const fileName = `${userId}-${Date.now()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, compressedFile);

  if (uploadError) {
    throw new Error('Upload failed: ' + uploadError.message);
  }

  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};
