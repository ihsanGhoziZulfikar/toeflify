import { getQuizzesBySkillName, getSkillBySlug } from '@/lib/data-manager';
import { notFound } from 'next/navigation';
import { urlFor } from '@/lib/imageFallback';
import { PortableText } from 'next-sanity';
import { PortableTextBlock } from '@sanity/types';
import { CustomTable, Quiz } from '@/lib/types';
import BreadcrumbLayout from '@/components/BreadcrumbLayout';
import Link from 'next/link';
import SkillHeader from '@/components/SkillHeader';



interface ContentSectionProps {
  title: string;
  content: (PortableTextBlock | CustomTable)[];
}

interface ExerciseSectionProps {
  title: string;
  instruction: string;
  items: (PortableTextBlock | CustomTable)[];
}

interface QuizListSectionProps {
  quizzes: Quiz[];
}

interface SkillPageProps {
  params: {
    slug: string;
  };
}



function ContentSection({ content }: ContentSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      {/* <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2> */}
      <PortableText value={content} />
    </div>
  );
}

function ExerciseSection({ title, instruction, items }: ExerciseSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-700 mb-6 leading-relaxed">{instruction}</p>
      <div className="space-y-3">
        <PortableText value={items} />
      </div>
    </div>
  );
}

function QuizListSection({ quizzes }: QuizListSectionProps) {
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Related Quizzes</h2>
        <p className="text-gray-500">No quizzes found for this skill yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Related Quizzes</h2>
      <ul className="space-y-3">
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="border-b border-gray-200 pb-3 last:border-b-0">
            <Link href={`/quiz/${quiz.id}`} className="group">
              <h3 className="text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{quiz.title}</h3>
              <p className="text-sm text-gray-500">{quiz.total_questions} questions</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { slug: skillSlug } = await params;

  const hit = await getSkillBySlug(skillSlug).catch((err) => {
    console.error('Failed to search skill:', err);
    return null;
  });

  if (!hit) {
    return notFound();
  }

  const { skill } = hit;

  const skillData = {
    name: skill.name ?? '',
    image: skill.coverImage,
    description: skill.description ?? '',
    content: skill.content,
    exercise: skill.exercise,
  };

  const quizzes = await getQuizzesBySkillName(skillData.name);

  return (
    <BreadcrumbLayout type="skill" slug={skillSlug}>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkillHeader title={skillData.name} description={skillData.description} imageSrc={urlFor(skillData.image)} />

          <ContentSection title={skillData.name} content={skillData.content} />

          <ExerciseSection title="Exercise" instruction="Complete the following exercises:" items={skillData.exercise} />

          {/* <QuizListSection quizzes={quizzes} /> */}
        </main>
      </div>
    </BreadcrumbLayout>
  );
}
