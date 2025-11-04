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
    .filter((block): block is PortableTextBlock & { children: { _type: string; text?: string }[] } => block._type === 'block' && Array.isArray(block.children))
    .map((block) => {
      return block.children.map((child) => child.text || '').join('');
    })
    .join('\n\n');
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
