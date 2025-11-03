import { createClient } from 'next-sanity';
// import imageUrlBuilder from '@sanity/image-url';

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
