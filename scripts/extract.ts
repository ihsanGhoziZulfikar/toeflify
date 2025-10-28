// scripts/extract.ts

import { createClient } from '@sanity/client';
import fs from 'fs/promises';
import path from 'path';

// Impor variabel lingkungan dari .env.local (explicit) dan fallback ke .env
import dotenv from 'dotenv';

// Definisikan kueri GROQ kita
// Kueri ini akan mengambil *semua* section dan datanya yang ter-nesting
const GROQ_QUERY = `
  *[_type == "section"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description, // Deskripsi Section
    chapters[] | order(order asc) {
      _key,
      name,
      "slug": slug.current,
      description, // Deskripsi Chapter
      topicGroups[] {
        _key,
        name,
        "slug": slug.current,
        description, // Deskripsi TopicGroup
        skills[] | order(order asc) {
          _key,
          name,
          "slug": slug.current,
          description, // Deskripsi Skill (plain text)
          content,     // Konten Skill (rich text)
          exercise     // Latihan Skill (rich text)
        }
      }
    }
  }
`;

// Muat file .env.local terlebih dahulu (Next.js uses .env.local) lalu fallback ke .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

// Helper: map common misspellings or alternative env names
function resolveSanityEnv() {
  const env = process.env as Record<string, string | undefined>;

  // Common misspellings to check for
  const fallbacks: Record<string, string[]> = {
    SANITY_PROJECT_ID: ['SANITY_PROJECT_ID', 'SANITY_PROJECTID', 'SANITY_PROJECT'],
    SANITY_DATASET: ['SANITY_DATASET', 'SANITY_DATASET_NAME'],
    SANITY_API_TOKEN: ['SANITY_API_TOKEN', 'SANITY_API_KEY', 'SANITY_TOKEN'],
  };

  const resolved: Record<string, string | undefined> = {};

  for (const key of Object.keys(fallbacks)) {
    const primary = key;
    resolved[primary] = env[primary] ?? undefined;
    if (!resolved[primary]) {
      for (const alt of fallbacks[primary]) {
        if (env[alt]) {
          resolved[primary] = env[alt];
          console.warn(`Found ${alt} in environment — using it as ${primary}. Please rename in your .env.local to ${primary}`);
          break;
        }
      }
    }
  }

  return resolved;
}

const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN } = resolveSanityEnv();

// Validate required env vars and provide actionable errors
if (!SANITY_PROJECT_ID) {
  console.error('Missing SANITY_PROJECT_ID in environment. Please add it to .env.local (or fix typo SANITY_PROJECCT_ID -> SANITY_PROJECT_ID).');
  process.exit(1);
}
if (!SANITY_DATASET) {
  console.error('Missing SANITY_DATASET in environment. Please add it to .env.local.');
  process.exit(1);
}

// Konfigurasi Sanity Client
const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2023-05-03', // Gunakan versi API terbaru
  token: SANITY_API_TOKEN, // Token optional; undefined means public read-only (if dataset/public)
  useCdn: false, // Kita ingin data terbaru, bukan dari cache
});

async function main() {
  console.log('Fetching data from Sanity...');
  try {
    const data = await client.fetch(GROQ_QUERY);

    // Tentukan path untuk menyimpan file output
    const outputPath = path.join(process.cwd(), 'sanity-export.json');

    // Tulis data ke file JSON
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2));

    console.log(`✅ Data extraction complete!`);
    console.log(`Data saved to: ${outputPath}`);
    console.log(`Total sections fetched: ${data.length}`);
  } catch (error) {
    console.error('Error fetching data from Sanity:');
    console.error(error);
    process.exit(1);
  }
}

// Jalankan fungsi main
main();
