// scripts/transform.ts

import fs from 'fs/promises';
import path from 'path';
// TIDAK ADA LAGI IMPORT UNTUK PAKET EKSTERNAL

// --- Mendefinisikan Tipe Data (TypeScript) ---

// Tipe untuk blok rich text Sanity
type PortableTextBlock = {
  _type: string;
  _key?: string;
  children?: PortableTextBlock[];
  text?: string;
  // Use unknown instead of any to avoid lint/no-explicit-any
  [key: string]: unknown;
};

// Tipe data berdasarkan skema Anda
type Skill = {
  _key: string;
  name: string;
  slug: { current: string };
  description: string; // Ini plain text
  content: PortableTextBlock[]; // Ini rich text
  exercise: PortableTextBlock[]; // Ini rich text
};

type TopicGroup = {
  _key: string;
  name: string;
  slug: { current: string };
  skills: Skill[];
};

type Chapter = {
  _key: string;
  name: string;
  slug: { current: string };
  topicGroups: TopicGroup[];
};

type Section = {
  _id: string;
  name: string;
  slug: { current: string };
  chapters: Chapter[];
};

// Tipe data untuk OUTPUT kita (Chunk)
type ChunkMetadata = {
  sectionName: string;
  chapterName: string;
  topicGroupName: string;
  skillName: string;
  source: string; // URL/path ke konten
};

type Chunk = {
  content: string; // Teks yang akan di-embed
  metadata: ChunkMetadata;
};

// --- FUNGSI KONVERSI MANUAL ---
/**
 * Mengubah array Portable Text (JSON) menjadi string plain text.
 * Fungsi ini tidak memerlukan dependensi eksternal.
 */
function portableTextToPlainText(blocks: PortableTextBlock[] = []): string {
  if (!Array.isArray(blocks)) {
    return '';
  }

  return blocks
    .filter((block) => block._type === 'block' && block.children)
    .map((block) => {
      // block.children was checked in the filter above but narrowings
      // sometimes don't carry through; guard defensively here.
      const children = Array.isArray(block.children) ? block.children : [];
      return children
        .filter((child) => child._type === 'span' && typeof child.text === 'string')
        .map((span) => String(span.text))
        .join('');
    })
    .join('\n\n'); // Pisahkan setiap blok (paragraf) dengan baris baru
}

// --- Fungsi Utama Transformasi ---

async function main() {
  console.log('Starting transformation (manual method)...');

  // 1. Baca file JSON yang sudah diekspor
  const inputPath = path.join(process.cwd(), 'sanity-export.json');
  let sections: Section[];

  try {
    const fileContent = await fs.readFile(inputPath, 'utf-8');
    sections = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading file ${inputPath}:`, error);
    process.exit(1);
  }

  const chunks: Chunk[] = [];
  let chunkCount = 0;

  console.log(`Processing ${sections.length} sections...`);

  // 2. Lakukan iterasi (loop) pada hierarki data
  for (const section of sections) {
    for (const chapter of section.chapters || []) {
      for (const topicGroup of chapter.topicGroups || []) {
        for (const skill of topicGroup.skills || []) {
          // 3. Konversi rich text (content & exercise) menjadi plain text
          // MENGGUNAKAN FUNGSI MANUAL KITA
          const skillContent = portableTextToPlainText(skill.content);
          const skillExercise = portableTextToPlainText(skill.exercise);

          // 4. Buat header konteks -> SANGAT PENTING UNTUK RAG
          const contextHeader = `
            Section: ${section.name}
            Chapter: ${chapter.name}
            Topic Group: ${topicGroup.name}
            Skill: ${skill.name}
          `
            .trim()
            .replace(/^\s+/gm, ''); // Membersihkan spasi

          // 5. Gabungkan semua teks menjadi satu chunk
          const combinedText = [
            contextHeader,
            skill.description, // deskripsi skill (plain text)
            '--- CONTENT ---',
            skillContent,
            '--- EXERCISE ---',
            skillExercise,
          ]
            .filter(Boolean)
            .join('\n\n'); // Gabungkan dengan baris baru

          // 6. Buat metadata
          const metadata: ChunkMetadata = {
            sectionName: section.name,
            chapterName: chapter.name,
            topicGroupName: topicGroup.name,
            skillName: skill.name,
            source: `/${section.slug}/${chapter.slug}/${topicGroup.slug}/${skill.slug}`,
          };

          // 7. Tambahkan ke daftar chunks
          chunks.push({
            content: combinedText,
            metadata: metadata,
          });
          chunkCount++;
        }
      }
    }
  }

  // 8. Tulis hasil ke file baru
  const outputPath = path.join(process.cwd(), 'chunks.json');
  try {
    await fs.writeFile(outputPath, JSON.stringify(chunks, null, 2));
    console.log(`✅ Transformation complete!`);
    console.log(`Total chunks created: ${chunkCount}`);
    console.log(`Output saved to: ${outputPath}`);
  } catch (error) {
    console.error(`Error writing file ${outputPath}:`, error);
    process.exit(1);
  }
}

// Jalankan fungsi main
main();
