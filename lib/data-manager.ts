import { client } from './sanity.client';
import * as queries from './sanity.queries';
import type { Section, SectionListing, Skill } from './types';

/**
 * Generic helper to fetch data from Sanity using a GROQ query.
 *
 * @template T expected return type
 * @param query GROQ query string
 * @param params optional params object for GROQ query
 * @returns parsed data from Sanity
 * @throws re-throws any error from the client after logging
 */
export async function fetchSanity<T = unknown, P = Record<string, unknown>>(
  query: string,
  params?: P
): Promise<T> {
  try {
    // client.fetch has overloads that are sometimes strict about the params type
    // cast to any in the call site only to satisfy the overloads. Keep the function
    // signature typed so callers get proper types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await client.fetch<T>(query, params as any);
    return res;
  } catch (error) {
    // Keep logging minimal but helpful
    console.error(
      'fetchSanity error — query:',
      typeof query === 'string' ? query.split('\n')[0] : query,
      'params:',
      params
    );
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

    const chapter = sectionData.chapters?.find(
      (ch) => (ch.slug as any) === chapterSlug
    );

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
      const topicGroup = chapter.topicGroups?.find(
        (tg) => (tg.slug as any) === topicSlug
      );

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
        const skill = topicGroup.skills?.find(
          (sk) => (sk.slug as any) === skillSlug
        );

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

// Export queries in case callers want to use them directly with fetchSanity
export { queries };
