import imageUrlBuilder from "@sanity/image-url";
import { client } from './sanity.client';
import type { Image } from '@sanity/types';

const builder = imageUrlBuilder(client);

export function urlFor(source: Image | null | undefined): string {
  if (source?.asset?._ref) {
    return builder.image(source).url();
  }
  return "/assets/default.jpeg";
}