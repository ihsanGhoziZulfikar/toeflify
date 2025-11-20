import type { Image, Slug } from '@sanity/types';
import { client } from './sanity.client';
import * as queries from './sanity.queries';
import type { LessonSkillListItem, Quiz, Section, SectionListing, Skill } from './types';
import { createSupabaseServerClient } from './supabase/server';

const slugToString = (slug?: Slug | string | null) => {
  if (!slug) return undefined;
  return typeof slug === 'string' ? slug : (slug.current ?? undefined);
};

/**
 * Generic helper to fetch data from Sanity using a GROQ query.
 *
 * @template T expected return type
 * @param query GROQ query string
 * @param params optional params object for GROQ query
 * @returns parsed data from Sanity
 * @throws re-throws any error from the client after logging
 */
export async function fetchSanity<T = unknown, P = Record<string, unknown>>(query: string, params?: P): Promise<T> {
  try {
    // client.fetch has overloads that are sometimes strict about the params type
    // cast to any in the call site only to satisfy the overloads. Keep the function
    // signature typed so callers get proper types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await client.fetch<T>(query, params as any);
    return res;
  } catch (error) {
    // Keep logging minimal but helpful
    console.error('fetchSanity error — query:', typeof query === 'string' ? query.split('\n')[0] : query, 'params:', params);
    console.error(error);
    throw error;
  }
}

/** Convenience helpers for commonly used queries in the project */

export async function getSections(): Promise<SectionListing[]> {
  return fetchSanity<SectionListing[]>(queries.sectionsListingQuery);
}

export async function getSectionBySlug(slug: string): Promise<Section | null> {
  return fetchSanity<Section | null>(queries.sectionBySlugQuery, { slug });
}

export async function getSectionPaths(): Promise<Array<{ slug: string }>> {
  return fetchSanity<Array<{ slug: string }>>(queries.sectionPathsQuery);
}
export async function getSkills(): Promise<Skill[]> {
  return fetchSanity<Skill[]>(queries.getSkillListQuery);
}

export async function getChapterBySlug(chapterSlug: string) {
  const section = await getSectionPaths();
  if (!section) return null;

  for (const { slug: sectionSlug } of section) {
    const sectionData = await getSectionBySlug(sectionSlug);
    if (!sectionData) continue;

    const chapter = sectionData.chapters?.find((ch) => slugToString(ch.slug) === chapterSlug);

    if (chapter) {
      return { section: sectionData, chapter };
    }
  }
  return null;
}

export async function getTopicBySlug(topicSlug: string) {
  const section = await getSectionPaths();
  if (!section) return null;

  for (const { slug: sectionSlug } of section) {
    const sectionData = await getSectionBySlug(sectionSlug);
    if (!sectionData) continue;

    for (const chapter of sectionData.chapters ?? []) {
      const topicGroup = chapter.topicGroups?.find((tg) => slugToString(tg.slug) === topicSlug);

      if (topicGroup) {
        return { section: sectionData, chapter, topicGroup };
      }
    }
  }

  return null;
}

export async function getSkillBySlug(skillSlug: string) {
  const section = await getSectionPaths();
  if (!section) return null;

  for (const { slug: sectionSlug } of section) {
    const sectionData = await getSectionBySlug(sectionSlug);
    if (!sectionData) continue;

    for (const chapter of sectionData.chapters ?? []) {
      for (const topicGroup of chapter.topicGroups ?? []) {
        const skill = topicGroup.skills?.find((sk) => slugToString(sk.slug) === skillSlug);

        if (skill) {
          return { section: sectionData, chapter, topicGroup, skill };
        }
      }
    }
  }

  return null;
}

export async function getSectionFilters(): Promise<Section[]> {
  return fetchSanity<Section[]>(queries.getSectionFiltersQuery);
}

type LessonSectionNode = {
  _id: string;
  name: string;
  slug_str?: string;
  chapters?: Array<{
    _key: string;
    name?: string;
    slug_str?: string;
    topicGroups?: Array<{
      _key: string;
      name?: string;
      slug_str?: string;
      skills?: Array<{
        _key: string;
        name?: string;
        slug_str?: string;
        coverImage?: Image;
        description?: string;
      }>;
    }>;
  }>;
};

const flattenLessonSkills = (sections: LessonSectionNode[]): LessonSkillListItem[] => {
  const items: LessonSkillListItem[] = [];

  sections.forEach((section) => {
    section.chapters?.forEach((chapter) => {
      chapter.topicGroups?.forEach((topic) => {
        topic.skills?.forEach((skill) => {
          if (!skill?.slug_str || !skill.name) return;
          items.push({
            id: skill._key ?? skill.slug_str,
            title: skill.name,
            slug: skill.slug_str,
            coverImage: skill.coverImage,
            description: skill.description,
            section: {
              name: section.name,
              slug: section.slug_str ?? '',
            },
            chapter: chapter.slug_str
              ? {
                  name: chapter.name,
                  slug: chapter.slug_str,
                }
              : undefined,
            topic: topic.slug_str
              ? {
                  name: topic.name,
                  slug: topic.slug_str,
                }
              : undefined,
          });
        });
      });
    });
  });

  return items;
};

export type LessonSkillFilters = {
  section?: string;
  chapter?: string;
  topic?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function getLessonSkills({ section, chapter, topic, search, page = 1, pageSize = 12 }: LessonSkillFilters = {}) {
  const sanitizedPageSize = Number.isNaN(pageSize) || pageSize <= 0 ? 12 : pageSize;

  const sections = await fetchSanity<LessonSectionNode[]>(queries.lessonsSkillsQuery, {
    sectionSlug: section ?? null,
    chapterSlug: chapter ?? null,
    topicSlug: topic ?? null,
  });

  const flattened = flattenLessonSkills(sections);

  const keyword = search?.trim().toLowerCase();
  const filtered = keyword ? flattened.filter((item) => item.title.toLowerCase().includes(keyword)) : flattened;

  const totalItems = filtered.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / sanitizedPageSize);
  const safePage = totalPages === 0 ? 1 : Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * sanitizedPageSize;
  const paginatedItems = totalItems === 0 ? [] : filtered.slice(startIndex, startIndex + sanitizedPageSize);

  return {
    items: paginatedItems,
    pagination: {
      totalItems,
      totalPages,
      currentPage: safePage,
      pageSize: sanitizedPageSize,
      hasNext: totalPages !== 0 && safePage < totalPages,
      hasPrev: totalPages !== 0 && safePage > 1,
    },
  };
}

export async function getQuizzesBySkillName(skillName: string): Promise<Quiz[]> {
  const formattedSkillName = skillName
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('quizzes').select('*').contains('skills', [formattedSkillName]);
  console.log('Fetched quizzes for skill:', formattedSkillName, 'Count:', data?.length);
  if (error) {
    console.error('Error fetching quizzes by skill name:', error);
    return [];
  }

  return data || [];
}

// Export queries in case callers want to use them directly with fetchSanity
export { queries };
