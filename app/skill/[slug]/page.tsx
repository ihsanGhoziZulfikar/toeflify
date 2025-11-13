import { getSkillBySlug } from '@/lib/data-manager';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { urlFor } from '@/lib/imageFallback';
import { PortableText } from 'next-sanity';
import { PortableTextBlock } from '@sanity/types';
import { CustomTable } from '@/lib/types';
import BreadcrumbLayout from '@/components/BreadcrumbLayout';

interface SkillHeaderProps {
  title: string;
  description: string;
  imageSrc: string;
}

interface ContentSectionProps {
  title: string;
  content: (PortableTextBlock | CustomTable)[];
}

interface ExerciseSectionProps {
  title: string;
  instruction: string;
  items: (PortableTextBlock | CustomTable)[];
}

interface SkillPageProps {
  params: {
    slug: string;
  };
}

function SkillHeader({ title, description, imageSrc }: SkillHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 bg-gray-800 rounded-lg shrink-0 overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              width={355}
              height={171}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-2xl">
              📖
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ContentSection({ title, content }: ContentSectionProps) {
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

  return (
    <BreadcrumbLayout type="skill" slug={skillSlug}>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkillHeader
            title={skillData.name}
            description={skillData.description}
            imageSrc={urlFor(skillData.image)}
          />

          <ContentSection title={skillData.name} content={skillData.content} />

          <ExerciseSection
            title="Exercise"
            instruction="Complete the following exercises:"
            items={skillData.exercise}
          />
        </main>
      </div>
    </BreadcrumbLayout>
  );
}
