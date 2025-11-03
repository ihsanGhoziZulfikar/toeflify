import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/types';

export const projectId = process.env.SANITY_PROJECT_ID!;
export const dataset = process.env.SANITY_DATASET!;
export const apiToken = process.env.SANITY_API_TOKEN!;
export const apiVersion = '2023-05-03';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: apiToken,
});

// Helper untuk menghasilkan URL gambar
const builder = imageUrlBuilder(client);
export const urlFor = (source: SanityImageSource) => builder.image(source);
