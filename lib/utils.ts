import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { PortableTextBlock } from '@sanity/types';

/**
 * Extracts plain text from a Sanity Portable Text block array.
 * This is a simple implementation and might not handle all block types.
 * @param blocks - The array of Portable Text blocks.
 * @returns A single string with the concatenated text.
 */
export function portableTextToString(blocks: PortableTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) {
    return '';
  }
  return blocks
    .filter(
      (
        block
      ): block is PortableTextBlock & {
        children: { _type: string; text?: string }[];
      } => block._type === 'block' && Array.isArray(block.children)
    )
    .map((block) => {
      return block.children.map((child) => child.text || '').join('');
    })
    .join('\n\n');
}

/**
 * helper to download JSON data as a file in the browser
 * @param data - The JSON data to download
 * @param filename - The name of the file to save as
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function downloadJSON(data: any, filename: string) {
  // Buat string JSON dengan format yang rapi (pretty-print)
  const jsonStr = JSON.stringify(data, null, 2);
  // Buat Blob (file in-memory)
  const blob = new Blob([jsonStr], { type: 'application/json' });
  // Buat URL sementara untuk Blob
  const url = URL.createObjectURL(blob);

  // Buat elemen <a> virtual untuk memicu download
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a); // Diperlukan untuk Firefox
  a.click(); // Klik link-nya

  // Bersihkan setelah di-download
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPathFromUrl = (
  url: string,
  bucketName: string
): string | null => {
  try {
    const parts = url.split(`/${bucketName}/`);

    if (parts.length < 2) return null;

    let path = parts[1];

    if (path.includes('?')) {
      path = path.split('?')[0];
    }

    return decodeURIComponent(path);
  } catch (e) {
    console.error('Error parsing URL', e);

    return null;
  }
};
