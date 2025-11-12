import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { urlFor } from '@/lib/imageFallback';
import PortableTextBlock from '@/components/PortableTextBlock';
import { getChapterBySlug } from '@/lib/data-manager';
import BreadcrumbLayout from '@/components/BreadcrumbLayout';

interface ChapterHeaderProps {
  title: string;
}

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

interface ChapterContentProps {
  content: any;
}

interface PageProps {
  params: { slug: string };
}

function ChapterHeader({ title }: ChapterHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">{title}</h1>
    </div>
  );
}

function TopicCard({ title, description, href, imageUrl }: TopicCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="relative h-48 bg-linear-to-br from-blue-50 to-teal-50">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-32 h-40 flex flex-col items-center justify-center">
                <div className="text-gray-800 font-bold mb-2">Grammar</div>
                <div className="w-full space-y-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-1 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-4 right-4 w-12 h-16 bg-white rounded-lg shadow-md"></div>
              <div className="absolute bottom-6 left-6">
                <div className="w-3 h-12 bg-green-400 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-5 leading-relaxed">
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
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Topics</h2>
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

function ChapterContent({ content }: ChapterContentProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
      <div className="prose prose-gray max-w-none">
        <PortableTextBlock value={content} />
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
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
