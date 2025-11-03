import type { Image, Slug, PortableTextBlock } from '@sanity/types';

// ini semacam model/types definition dari Sanity CMS, aslinya liat di project cms, file detailnya ada di comment di tiap interface

// Berdasarkan schemaTypes/objects/table.js
export interface CustomTable {
  _type: 'customTable';
  caption?: string;
  table: {
    rows: {
      _key: string;
      cells: string[];
    }[];
  };
}

// Berdasarkan schemaTypes/objects/skill.js
export interface Skill {
  _key: string;
  name?: string;
  slug?: Slug;
  coverImage?: Image;
  order: number;
  description?: string;
  content: (PortableTextBlock | CustomTable)[]; // Bisa berisi block atau tabel kustom
  exercise: (PortableTextBlock | CustomTable)[]; // Bisa berisi block atau tabel kustom
}

// Berdasarkan schemaTypes/objects/topicGroup.js
export interface TopicGroup {
  _key: string;
  name?: string;
  slug?: Slug;
  coverImage?: Image;
  description: PortableTextBlock[];
  skills: Skill[];
}

// Berdasarkan schemaTypes/objects/chapter.js
export interface Chapter {
  _key: string;
  name?: string;
  slug?: Slug;
  coverImage?: Image;
  order: number;
  description: PortableTextBlock[];
  topicGroups: TopicGroup[];
}

// Berdasarkan schemaTypes/documents/section.js
export interface Section {
  _id: string;
  _type: 'section';
  name: string;
  slug: Slug;
  coverImage?: Image;
  order: number;
  description: PortableTextBlock[];
  chapters: Chapter[];
}

// Tipe data simple buat halaman listing
export interface SectionListing {
  _id: string;
  name: string;
  slug: string;
  coverImage?: Image;
  description: PortableTextBlock[];
}
