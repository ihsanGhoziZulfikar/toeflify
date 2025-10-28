// scripts/index.ts

import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv'; // <-- PERBAIKAN
dotenv.config({ path: '.env.local' }); // <-- PERBAIKAN (memaksa baca file .env.local)

import { Pool } from 'pg';
import { CohereClient } from 'cohere-ai';

// --- Konfigurasi ---

const EMBEDDING_DIMENSION = 1024;
const EMBEDDING_MODEL = 'embed-english-v3.0';
const CHUNKS_FILE = 'chunks.json';
const TABLE_NAME = 'content_chunks';

// --- Tipe Data ---
type ChunkMetadata = {
  sectionName: string;
  chapterName: string;
  topicGroupName: string;
  skillName: string;
  source: string;
};

type Chunk = {
  content: string;
  metadata: ChunkMetadata;
};

// Tipe helper untuk menghindari masalah @types/pg
type SimplePoolClient = {
  query: (text: string, params?: unknown[] | undefined) => Promise<unknown>;
  release?: () => void;
};

// --- Inisialisasi Klien ---

// Inisialisasi Klien Neon DB
const db = new Pool({
  // Sekarang process.env.POSTGRES_URL_NON_POOLING akan terbaca
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
});

// Inisialisasi Klien Cohere (Modern)
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// --- Fungsi Helper ---

/**
 * Membuat tabel jika belum ada
 */
async function createTable(client: SimplePoolClient) {
  console.log(`Checking/Creating table '${TABLE_NAME}'...`);
  await client.query(
    `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      content TEXT,
      metadata JSONB,
      embedding VECTOR(${EMBEDDING_DIMENSION})
    );`
  );
  console.log('Table is ready.');
}

/**
 * Membuat embedding untuk satu teks menggunakan Cohere
 */
async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await cohere.embed({
      model: EMBEDDING_MODEL,
      texts: [text],
      inputType: 'search_document',
    });

    const embeddings = response.embeddings;

    if (!Array.isArray(embeddings) || embeddings.length === 0) {
      throw new Error('No embeddings returned from Cohere');
    }

    return embeddings[0];
  } catch (error) {
    console.error('Error getting embedding from Cohere:', error);
    throw error;
  }
}

// --- Fungsi Utama ---

async function main() {
  console.log('Starting indexing process with Cohere...');

  let client: SimplePoolClient | undefined;
  try {
    // 1. Hubungkan ke Database
    client = (await db.connect()) as SimplePoolClient;
    console.log('Database connected.');

    // 2. Buat tabel jika belum ada
    await createTable(client);

    // 3. Baca file chunks.json
    const inputPath = path.join(process.cwd(), CHUNKS_FILE);
    const fileContent = await fs.readFile(inputPath, 'utf-8');
    const chunks: Chunk[] = JSON.parse(fileContent);

    console.log(`Found ${chunks.length} chunks to index.`);

    // 4. Lakukan iterasi dan index setiap chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1} of ${chunks.length} (Skill: ${chunk.metadata.skillName})...`);

      // 5. Buat embedding
      const embedding = await getEmbedding(chunk.content);

      // 6. Simpan ke database
      await client.query(
        `INSERT INTO ${TABLE_NAME} (content, metadata, embedding)
         VALUES ($1, $2, $3::vector)`,
        [chunk.content, chunk.metadata, `[${embedding.join(',')}]`]
      );
    }

    console.log('✅ Indexing complete with Cohere!');
    console.log(`Successfully indexed ${chunks.length} chunks into Neon DB.`);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // 7. Tutup koneksi database
    if (client?.release) {
      client.release();
    }
    await db.end();
    console.log('Database connection closed.');
  }
}

// Jalankan fungsi main
main();
