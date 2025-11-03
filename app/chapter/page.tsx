'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ChapterHeaderProps {
  title: string;
  description: string;
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
  content: string[];
}

interface Procedure {
  number: number;
  text: string;
}

interface ProceduresListProps {
  title: string;
  subtitle?: string;
  procedures: Procedure[];
}

const chapterData = {
  breadcrumbs: [
    { label: 'Structure & Written Expression', href: '/structure' },
    { label: 'The Structure Questions', href: '/chapter' },
  ],
  title: 'The Structure Questions',
  description: 'Multiple-choice questions that test your knowledge of the correct structure of English sentences appear on both the paper TOEFL test and the computer TOEFL test. Look at an example of a structure question from the paper TOEFL test.',
  content: [
    'Example from the Paper TOEFL® Test',
    'A camel ___ 30 gallons of water in ten minutes. (A) can drink (B) it can drink (C) a large drink of (D) with a drink of',
    'In this example, you should notice that the sentence has a subject camel but needs a verb. Answer (A) is the correct answer because it contains the verb can drink. Answer (B) is incorrect because it has the extra subject it, and answers (C) and (D) are incorrect because they do not have verbs. You should therefore choose answer (A).',
    'Now, look at an example of a structure question from the computer TOEFL test.',
    'Example from the Computer TOEFL® Test',
    '___ a firefighting specialist from Texas, has dealt with numerous major fires worldwide. a Red Adair is a For Road Adair o Red Adair o in Red Adair\'s life',
    'In this first example, you should notice that the sentence has a verb has dealt but needs a subject. The comma in front of the verb has indicated that specialist is an appositive and is not the subject. The third answer is the best answer because it contains the subject Red Adair. The first answer has an extra verb, and the second and fourth answers contain prepositional phrases, so these answers are incorrect. You should click on the third answer to this question.',
  ],
  procedures: {
    title: 'PROCEDURES FOR THE STRUCTURE QUESTIONS',
    subtitle: 'Paper TOEFL® Test and Computer TOEFL® Test',
    items: [
      {
        number: 1,
        text: 'First, study the sentence. Your purpose is to determine what is needed to complete the sentence correctly.',
      },
      {
        number: 2,
        text: 'Then study each answer based on how well it completes the sentence. Eliminate answers that do not complete the sentence correctly.',
      },
      {
        number: 3,
        text: 'Do not try to eliminate incorrect answers by looking only at the answers. The incorrect answers are generally correct by themselves. The incorrect answers are generally incorrect only when used to complete the sentence.',
      },
    ],
  },
  topics: [
    {
      id: 'sentence-with-one-clause',
      title: 'Sentence with One Clause',
      description: 'Ensure verbs match their subjects in number.',
      href: '/skill/be-sure-sentences',
    },
    {
      id: 'subject-verb-agreement',
      title: 'Subject Verb Agreement',
      description: 'Master past, present, and future tenses.',
      href: '/skill/subject-verb-agreement',
    },
    {
      id: 'verb-tenses-2',
      title: 'Verb Tenses',
      description: 'Master past, present, and future tenses.',
      href: '/skill/verb-tenses',
    },
    {
      id: 'verb-tenses-3',
      title: 'Verb Tenses',
      description: 'Master past, present, and future tenses.',
      href: '/skill/verb-tenses',
    },
    {
      id: 'verb-tenses-4',
      title: 'Verb Tenses',
      description: 'Master past, present, and future tenses.',
      href: '/skill/verb-tenses',
    },
    {
      id: 'verb-tenses-5',
      title: 'Verb Tenses',
      description: 'Master past, present, and future tenses.',
      href: '/skill/verb-tenses',
    },
    {
      id: 'verb-tenses-6',
      title: 'Verb Tenses',
      description: 'Master past, present, and future tenses.',
      href: '/skill/verb-tenses',
    },
    {
      id: 'verb-tenses-7',
      title: 'Verb Tenses',
      description: 'Master past, present, and future tenses.',
      href: '/skill/verb-tenses',
    },
    {
      id: 'verb-tenses-8',
      title: 'Verb Tenses',
      description: 'Master past, present, and future tenses.',
      href: '/skill/verb-tenses',
    },
    {
      id: 'verb-tenses-9',
      title: 'Verb Tenses',
      description: 'Master past, present, and future tenses.',
      href: '/skill/verb-tenses',
    },
  ],
};


function ChapterHeader({ title, description }: ChapterHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">{title}</h1>
      <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed">{description}</p>
    </div>
  );
}

function TopicCard({ title, description, href, imageUrl }: TopicCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="relative h-48 bg-linear-to-br from-blue-50 to-teal-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
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
          <p className="text-gray-600 text-sm">{description}</p>
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
      <div className="prose max-w-none">
        {content.map((paragraph, index) => (
          <p key={index} className="text-gray-700 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

function ProceduresList({ title, subtitle, procedures }: ProceduresListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 text-sm mb-6">({subtitle})</p>
      )}
      <ol className="space-y-4">
        {procedures.map((procedure) => (
          <li key={procedure.number} className="flex items-start">
            <span className="font-bold text-gray-900 mr-3">{procedure.number}.</span>
            <p className="text-gray-700 flex-1">{procedure.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ChapterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <ChapterHeader
          title={chapterData.title}
          description={chapterData.description}
        />

        <ChapterContent content={chapterData.content} />

        {chapterData.procedures && (
          <ProceduresList
            title={chapterData.procedures.title}
            subtitle={chapterData.procedures.subtitle}
            procedures={chapterData.procedures.items}
          />
        )}

        <TopicsGrid topics={chapterData.topics} />
      </main>
    </div>
  );
}