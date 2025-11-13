import CustomBreadcrumb, {
  BreadcrumbItemType,
} from '@/components/CustomBreadcrumb';

import {
  getSectionBySlug,
  getChapterBySlug,
  getTopicBySlug,
  getSkillBySlug,
} from '@/lib/data-manager';

async function getBreadcrumbData(
  type: 'section' | 'chapter' | 'topic' | 'skill',
  slug: string
) {
  const baseItems: BreadcrumbItemType[] = [{ label: 'Home', href: '/' }];

  try {
    if (type === 'section') {
      const section = await getSectionBySlug(slug);

      if (!section) return baseItems;
      return [
        ...baseItems,
        {
          label: section.name ?? 'Section',
          href: `/section/${section.slug || slug}`,
        },
      ];
    }

    if (type === 'chapter') {
      const hit = await getChapterBySlug(slug);

      if (!hit) return baseItems;
      const { section, chapter } = hit;

      return [
        ...baseItems,
        {
          label: section.name ?? 'Section',
          href: `/section/${section.slug}`,
        },
        {
          label: chapter.name ?? 'Chapter',
          href: `/chapter/${chapter.slug || slug}`,
        },
      ];
    }

    if (type === 'topic') {
      const hit = await getTopicBySlug(slug);

      if (!hit) return baseItems;
      const { section, chapter, topicGroup } = hit;

      return [
        ...baseItems,
        {
          label: section.name ?? 'Section',
          href: `/section/${section.slug}`,
        },
        {
          label: chapter.name ?? 'Chapter',
          href: `/chapter/${chapter.slug}`,
        },
        {
          label: topicGroup.name ?? 'Topic',
          href: `/topic/${topicGroup.slug || slug}`,
        },
      ];
    }

    if (type === 'skill') {
      const hit = await getSkillBySlug(slug);

      if (!hit) return baseItems;
      const { section, chapter, topicGroup, skill } = hit;

      return [
        ...baseItems,
        {
          label: section.name ?? 'Section',
          href: `/section/${section.slug}`,
        },
        {
          label: chapter.name ?? 'Chapter',
          href: `/chapter/${chapter.slug}`,
        },
        {
          label: topicGroup.name ?? 'Topic',
          href: `/topic/${topicGroup.slug || slug}`,
        },
        {
          label: skill.name ?? 'Topic',
          href: `/skill/${skill.slug || slug}`,
        },
      ];
    }
  } catch (error) {
    console.error('Failed to fetch breadcrumb data:', error);
    return baseItems;
  }

  return baseItems;
}

export default async function BreadcrumbLayout({
  type,
  slug,
  children,
}: {
  type: 'section' | 'chapter' | 'topic' | 'skill';
  slug: string;
  children: React.ReactNode;
}) {
  const breadcrumbItems = await getBreadcrumbData(type, slug);

  return (
    <>
      <div className="sticky top-18 z-40">
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>
      {children}
    </>
  );
}
