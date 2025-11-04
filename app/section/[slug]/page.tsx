import Image from "next/image";
import ColoredStick from "@/components/ColoredStick";
import InfoBox from "@/components/InfoBox";
import "@/themes/index.css";
import { Book, ListChecks, Star } from "lucide-react";
import { getSectionBySlug } from "@/lib/data-manager";
import { urlFor } from "@/lib/imageFallback";
import PortableTextBlock from "@/components/PortableTextBlock";

interface PageProps {
  params: { slug: string };
}

export default async function SectionPage({ params }: PageProps) {
  const { slug } = await params;
  const section = await getSectionBySlug(slug).catch((err) => {
    console.error('Failed to load sections:', err);
    return null;
  });

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>Section not found.</p>
      </div>
    );
  }
  // Page data variables
  const title = section.name;
  const description = section.description;
  const imageSrc = urlFor(section.coverImage);
  const chaptersCount = section.totalChapters;
  const topicsCount = section.totalTopics;
  const skillsCount = section.totalSkills;

  const chapters = section.chapters;

  const colorOrder = [
    "var(--color-purple)",
    "var(--color-danger)",
    "var(--color-warning)",
    "var(--color-primary)",
  ];
  // Info boxes
  const infoBoxes = [
    {
      title: "Custom Exercise",
      subtitle: "Build a practice set perfectly tailored to your needs",
      color: "var(--color-primary)",
      href: "/build",
      buttonText: "Start Build",
    },
    {
      title: "Full Simulation Test",
      subtitle: "Ready to test all your skills? Try our full-length ITP simulation.",
      color: "var(--color-purple)",
      href: "/test",
      buttonText: "Start Test",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      {/* Top Section */}
      <div className="flex justify-center items-center w-full bg-blue-50 p-6">
        {/* Left Image */}
        <div className="w-1/6">
          <Image
            src={imageSrc}
            alt={title}
            width={300}
            height={200}
            className="rounded-xl object-cover"
          />
        </div>

        {/* Right Title */}
        <div className="w-3/6 pl-6">
          <h1 className="text-3xl font-bold text-primary font-rowdies">{title}</h1>

          <div className="flex items-center gap-4 mt-2 font-saira">
            {/* Chapters */}
            <div className="flex items-center gap-1 text-purple">
              <Book size={20} />
              <span className="text-md font-medium">{chaptersCount} Chapters</span>
            </div>

            {/* Topics */}
            <div className="flex items-center gap-1 text-danger">
              <ListChecks size={20} />
              <span className="text-md font-medium">{topicsCount} Topics</span>
            </div>

            {/* Skills */}
            <div className="flex items-center gap-1 text-warning">
              <Star size={20} />
              <span className="text-md font-medium">{skillsCount} Skills</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-5xl bg-white rounded-2xl mt-6 p-6 flex gap-8 font-saira">
        {/* Left Side */}
        <div className="w-3/4">
          {/* <p className="text-gray-700 leading-relaxed pb-5">{description}</p> */}
              <div className="prose prose-gray max-w-none pb-5">
                <PortableTextBlock value={description}  />
              </div>

          <div className="text-2xl font-bold text-primary mb-2">Chapters</div>
          {chapters && chapters.length > 0 ? (
            chapters.map((chapter, index) => {
              const color = colorOrder[index % colorOrder.length]; // Rotate colors
              return (
                <ColoredStick
                  key={chapter._key}
                  text={chapter.name || "Untitled Chapter"}
                  color={color}
                  href={`/chapter/${chapter.slug || ""}`}
                />
              );
            })
          ) : (
            <p className="text-gray-500 italic">No chapters available.</p>
          )}
        </div>

        {/* Right Side */}
        <div className="w-1/4 flex flex-col gap-6">
          {infoBoxes.map((box) => (
            <InfoBox
              key={box.title}
              title={box.title}
              subtitle={box.subtitle}
              color={box.color}
              href={box.href}
              buttonText={box.buttonText}
            />
          ))}
        </div>
      </div>
    </div>
  );
}