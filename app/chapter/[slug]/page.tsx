import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { urlFor } from '@/lib/imageFallback';
import { getChapterBySlug } from '@/lib/data-manager';
import BreadcrumbLayout from '@/components/BreadcrumbLayout';
import {toTitleCase} from '@/lib/helper';
import ChapterHeader from '@/components/ChapterHeader';
import ChapterContent from '@/components/ChapterContent';

interface TopicCardProps {
  title: string;
  description: string;
  href: string;
  imageUrl?: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  href: string;
  imageUrl?: string;
}

interface TopicsGridProps {
  topics: Topic[];
}

interface PageProps {
  params: { slug: string };
}

function TopicCard({ title, description, href, imageUrl }: TopicCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="relative h-35 bg-linear-to-br from-blue-50 to-teal-50">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-4 w-32 h-30 flex flex-col items-center justify-center">
                <div className="text-gray-800 text-xs line-clamp-3 font-bold text-center mb-2">{toTitleCase(title)}</div>
                <div className="w-full space-y-1">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-1 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-md line-clamp-2 font-bold font-rowdies text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {toTitleCase(title)}
          </h3>
          <p className="text-gray-600 font-saira text-xs line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function TopicsGrid({ topics }: TopicsGridProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold font-rowdies text-primary mb-8">Topics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            title={topic.title}
            description={topic.description}
            href={topic.href}
            imageUrl={topic.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}


export default async function ChapterPage({ params }: PageProps) {
  const { slug: chapterSlug } = await params;
  const hit = await getChapterBySlug(chapterSlug);

  if (!hit) {
    return notFound();
  }

  const { chapter } = hit;

  const chapterData = {
    name: chapter.name,
    description: chapter.description,
    content: chapter.description,
    procedures: chapter.description,
  };
  const topics = chapter.topicGroups;

  return (
    <BreadcrumbLayout type="chapter" slug={chapterSlug}>
      <div className="min-h-screen bg-white">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ChapterHeader title={chapterData.name || 'Untitled Chapter'} />

          {chapterData.content && (
            <ChapterContent content={chapterData.content} />
          )}

          <TopicsGrid
            topics={topics.map((tg: any) => ({
              id: tg._key,
              title: tg.name || 'Untitled Topic Group',
              description: tg.description
                ? tg.description
                    .map((block: any) =>
                      block.children.map((child: any) => child.text).join('')
                    )
                    .join(' ')
                : '',
              href: `/topic/${tg.slug || ''}`,
              imageUrl: tg.coverImage ? urlFor(tg.coverImage) : undefined,
            }))}
          />
        </main>
      </div>
    </BreadcrumbLayout>
  );
}
