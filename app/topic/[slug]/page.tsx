import { getTopicBySlug } from '@/lib/data-manager';
import SkillCard from '@/components/SkillCard';
import { urlFor } from '@/lib/imageFallback';
import BreadcrumbLayout from '@/components/BreadcrumbLayout';
import ChapterHeader from '@/components/ChapterHeader';
import ChapterContent from '@/components/ChapterContent';

interface TopicPageProps {
  params: { slug: string };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug: topicSlug } = await params;

  const hit = await getTopicBySlug(topicSlug).catch((err) => {
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
    <BreadcrumbLayout type="topic" slug={topicSlug}>
      <div className="min-h-screen flex flex-col items-center">
        <div className="max-w-5xl bg-white sm:px-6 lg:px-8 py-8">
          <ChapterHeader title={title || 'Untitled Chapter'}/>
          <ChapterContent content={description}/>

          <div className=" bg-white rounded-2xl mt-8 px-6 flex flex-col gap-8">
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
                  `/skill/${skill.slug || ''}/practice`
                }
              />
            ))}
          </div>
        </div>
      </div>
    </BreadcrumbLayout>
  );
}
