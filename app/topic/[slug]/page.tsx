import { getSectionBySlug, getSectionPaths } from '@/lib/data-manager';
import SkillCard from '@/components/SkillCard';
import { urlFor } from '@/lib/imageFallback';
import PortableTextBlock from '@/components/PortableTextBlock';

interface TopicPageProps {
  params: { slug: string };
}

async function findTopicBySlug(topicSlug: string) {
  const sectionPaths = await getSectionPaths();
  for (const { slug: sectionSlug } of sectionPaths) {
    const section = await getSectionBySlug(sectionSlug);
    if (!section) continue;

    for (const chapter of section.chapters ?? []) {
      const topicGroup = chapter.topicGroups?.find(
        (tg) => (tg.slug as any) === topicSlug
      );
      if (topicGroup) {
        return { section, chapter, topicGroup };
      }
    }
  }
  return null;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug: topicSlug } = await params;

  const hit = await findTopicBySlug(topicSlug).catch((err) => {
    console.error('Failed to search topic:', err);
    return null;
  });

  if (!hit) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>Topic not found.</p>
      </div>
    );
  }

  const { topicGroup } = hit;

  const title = topicGroup.name;
  const description = topicGroup.description;
  const skills = topicGroup.skills ?? [];

  return (
    <div className="min-h-screen flex flex-col items-center bg-white pt-20 pb-20">
      <h1 className="text-4xl font-rowdies font-bold text-primary">{title}</h1>

      <div className="max-w-7xl bg-white rounded-2xl mt-8 px-6 flex flex-col gap-8">
        <div className="prose prose-neutral max-w-none">
          <PortableTextBlock value={description} />
        </div>
        <div className="text-2xl font-rowdies font-bold text-primary mb-2">
          Skills
        </div>
        {skills.map((skill) => (
          <SkillCard
            key={skill._key ?? skill.slug ?? skill.name}
            title={skill.name ?? 'Untitled skill'}
            description={skill.description ?? ''}
            imageSrc={urlFor(skill.coverImage)}
            materialHref={`/skill/${skill.slug || ''}`}
            exerciseHref={
              typeof skill.exercise === 'string' ? skill.exercise : ''
            }
          />
        ))}
        ;
      </div>
    </div>
  );
}
