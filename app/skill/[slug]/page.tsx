import { notFound } from "next/navigation";


interface SkillHeaderProps {
  title: string;
  description: string;
  imageUrl?: string;
}

interface ContentSectionProps {
  title: string;
  content: string;
}

interface ExerciseItem {
  number: number;
  text: string;
}

interface ExerciseSectionProps {
  title: string;
  instruction: string;
  items: ExerciseItem[];
}

type SkillSlug = "be-sure-sentences" | "subject-verb-agreement";

interface SkillData {
  title: string;
  description: string;
  content: { title: string; text: string }[];
  exercise: {
    title: string;
    instruction: string;
    items: { number: number; text: string }[];
  };
}

const skills: Record<SkillSlug, SkillData> = {
  "be-sure-sentences": {
    title: "Skill 1: Be Sure The Sentences",
    description:
      "Learn how to ensure your sentences have correct structure and complete clauses.",
    content: [
      {
        title: "Be Sure The Sentences",
        text: "A sentence in English must have at least a subject and a verb. Incomplete sentences without one of these elements are considered fragments.",
      },
      {
        title: "Sentence with One Clause",
        text: "Every sentence must contain at least one clause that expresses a complete thought.",
      },
    ],
    exercise: {
      title: "Exercise 1",
      instruction:
        "Underline the subjects once and the verbs twice in each of the following sentences.",
      items: [
        {
          number: 1,
          text: "_____ Last week went fishing for trout at the nearby mountain lake.",
        },
        {
          number: 2,
          text: "_____ A schedule of the day's events can be obtained at the front desk.",
        },
        {
          number: 3,
          text: "_____ The box can be opened only with a special screwdriver.",
        },
      ],
    },
  },
  "subject-verb-agreement": {
    title: "Skill 2: Subject-Verb Agreement",
    description:
      "Understand how subjects and verbs must agree in number and person.",
    content: [
      {
        title: "Introduction",
        text: "In English, the verb must agree with its subject in number. Singular subjects take singular verbs, while plural subjects take plural verbs.",
      },
      {
        title: "Examples",
        text: "He runs fast. (singular) | They run fast. (plural)",
      },
    ],
    exercise: {
      title: "Exercise 2",
      instruction:
        "Choose the correct verb to complete each sentence.",
      items: [
        { number: 1, text: "He ___ to the store every day. (go / goes)" },
        { number: 2, text: "The dogs ___ barking loudly. (is / are)" },
      ],
    },
  },
};

function SkillHeader({ title, description, imageUrl }: SkillHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 bg-gray-800 rounded-lg shrink-0 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
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
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-700 leading-relaxed">{content}</p>
    </div>
  );
}

function ExerciseSection({ title, instruction, items }: ExerciseSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-700 mb-6 leading-relaxed">{instruction}</p>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.number} className="flex items-start">
            <span className="text-gray-500 mr-3 font-medium min-w-8">
              {item.number}.
            </span>
            <p className="text-gray-700 flex-1">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const skill = skills[slug as SkillSlug];

  if (!skill) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkillHeader title={skill.title} description={skill.description} />

        {skill.content.map((section, index) => (
          <ContentSection
            key={index}
            title={section.title}
            content={section.text}
          />
        ))}

        <ExerciseSection
          title={skill.exercise.title}
          instruction={skill.exercise.instruction}
          items={skill.exercise.items}
        />
      </main>
    </div>
  );
}