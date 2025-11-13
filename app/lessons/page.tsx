import { getSectionFilters } from '@/lib/data-manager';
import LessonClient from './LessonClient';

// Dummy lesson data - replace with real data from your backend
const generateDummyLessons = () => {
  const lessons = [];
  const sections = ['Writing Expression', 'Reading Comprehension', 'Listening Skills'];

  for (let i = 1; i <= 68; i++) {
    lessons.push({
      id: `lesson-${i}`,
      title: 'listing skills',
      section: sections[i % sections.length],
      imageSrc: '/assets/images/lessons.png',
      href: `/lesson/${i}`, // Replace with actual lesson route
    });
  }

  return lessons;
};

export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Get filter data
  const filterData = await getSectionFilters();

  // Get all lessons
  const allLessons = generateDummyLessons();

  // Await searchParams
  const params = await searchParams;

  // Get filter values
  const sectionFilter = params.section as string | undefined;
  const chapterFilter = params.chapter as string | undefined;
  const topicFilter = params.topic as string | undefined;
  const pageParam = params.page as string | undefined;

  // Filter lessons based on section (you'll need to implement proper filtering based on your data structure)
  let filteredLessons = allLessons;

  if (sectionFilter) {
    // Filter by section - this is a dummy implementation
    // Replace with actual filtering logic based on your data
    filteredLessons = allLessons.filter(lesson =>
      lesson.section.toLowerCase().includes(sectionFilter.toLowerCase())
    );
  }

  // Pagination
  const ITEMS_PER_PAGE = 9;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const totalPages = Math.ceil(filteredLessons.length / ITEMS_PER_PAGE);

  // Get lessons for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLessons = filteredLessons.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div>
      <LessonClient
        filterData={filterData}
        lessons={paginatedLessons}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
