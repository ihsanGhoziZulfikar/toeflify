import { getLessonSkills, getSectionFilters } from '@/lib/data-manager';
import { urlFor } from '@/lib/imageFallback';
import LessonClient from './LessonClient';

const ITEMS_PER_PAGE = 12;

export default async function LessonsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const filterData = await getSectionFilters();

  const sectionFilter = typeof params.section === 'string' ? params.section : undefined;
  const chapterFilter = typeof params.chapter === 'string' ? params.chapter : undefined;
  const topicFilter = typeof params.topic === 'string' ? params.topic : undefined;
  const query = typeof params.q === 'string' ? params.q : undefined;
  const pageParam = typeof params.page === 'string' ? Number.parseInt(params.page, 10) : 1;
  const page = Number.isNaN(pageParam) || pageParam <= 0 ? 1 : pageParam;

  const { items, pagination } = await getLessonSkills({
    section: sectionFilter,
    chapter: chapterFilter,
    topic: topicFilter,
    search: query,
    page,
    pageSize: ITEMS_PER_PAGE,
  });

  const lessons = items.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    section: lesson.section.name,
    sectionSlug: lesson.section.slug,
    chapter: lesson.chapter?.name,
    chapterSlug: lesson.chapter?.slug,
    topic: lesson.topic?.name,
    topicSlug: lesson.topic?.slug,
    href: `/skill/${lesson.slug}`,
    imageSrc: lesson.coverImage ? urlFor(lesson.coverImage) : undefined,
  }));

  return (
    <LessonClient
      key={query ?? ''}
      filterData={filterData}
      lessons={lessons}
      pagination={{
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        pageSize: pagination.pageSize,
      }}
      activeFilters={{
        section: sectionFilter,
        chapter: chapterFilter,
        topic: topicFilter,
        query,
      }}
    />
  );
}
