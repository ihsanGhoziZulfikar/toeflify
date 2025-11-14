import { getSectionFilters } from '@/lib/data-manager';
import PracticeClient from './PracticeClient';

// Mock API-style filtering (on the server)
async function getPracticeData(filters?: { section?: string; chapter?: string; topic?: string; skill?: string }) {
  const allPractices = [
    { id: 1, title: "Grammar question Set 1", section: "structure-and-written-expression", chapter: "the-structure-questions", topic :"sentences-with-multiple-clauses", skill: "Be Sure The Sentences", number: 10, estTime: "15 min", difficulity: "Easy", attempted: true, score: 2, maxScore: 10 },
    { id: 2, title: "Grammar question Set 2", section: "structure-and-written-expression", chapter: "the-structure-questions", topic :"sentence-with-one-clause", skill: "Be Sure The Sentences", number: 10, estTime: "15 min", difficulity: "Medium", attempted: false, score: 10, maxScore: 10 },
    { id: 3, title: "Grammar question Set 3", section: "reading-comprehension", chapter: "The Structure Questions", topic :"Sentence With One Clause", skill: "Be Sure The Sentences", number: 10, estTime: "15 min", difficulity: "Hard", attempted: true, score: 10, maxScore: 10 },
  ];

  if (!filters) return allPractices;

  return allPractices.filter((p) => {
    return (
      (!filters.section || p.section === filters.section) &&
      (!filters.chapter || p.chapter === filters.chapter) &&
      (!filters.topic || p.topic === filters.topic) &&
      (!filters.skill || p.skill === filters.skill)
    );
  });
}

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const { section, chapter, topic, skill } = params;

  const filterData = await getSectionFilters();
  const practices = await getPracticeData({ section, chapter, topic, skill });

  return <PracticeClient filterData={filterData} practices={practices} />;
}
