import Image from "next/image";
import ColoredStick from "@/components/ColoredStick";
import InfoBox from "@/components/InfoBox";
import "../../themes/index.css";
import { Book, ListChecks, Star } from "lucide-react";

export default function Page() {
  // Page data variables
  const title = "Structure and Written Expression";
  const description = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed venenatis,
    diam non condimentum hendrerit, mi dui dignissim neque, vel porttitor odio
    nibh quis felis. Nunc dignissim eros lorem, ac aliquam mi auctor vitae.
    Integer felis orci, congue eu libero at, venenatis faucibus massa.
  `;
  const imageSrc = "/assets/default.jpeg";

  const chaptersCount = 2;
  const topicsCount = 5;
  const skillsCount = 50;

  // Chapter items
  const chapters = [
    { text: "Structure", color: "var(--color-purple)", href: "/structure" },
    { text: "Written Expression", color: "var(--color-danger)", href: "/written" },
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
        <div className="w-2/6 pl-6">
          <h1 className="text-3xl font-bold text-primary">{title}</h1>

          <div className="flex items-center gap-4 mt-2">
            {/* Chapters */}
            <div className="flex items-center gap-1 text-purple">
              <Book size={16} />
              <span className="text-sm font-medium">{chaptersCount} Chapters</span>
            </div>

            {/* Topics */}
            <div className="flex items-center gap-1 text-danger">
              <ListChecks size={16} />
              <span className="text-sm font-medium">{topicsCount} Topics</span>
            </div>

            {/* Skills */}
            <div className="flex items-center gap-1 text-warning">
              <Star size={16} />
              <span className="text-sm font-medium">{skillsCount} Skills</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-5xl bg-white rounded-2xl mt-6 p-6 flex gap-8">
        {/* Left Side */}
        <div className="w-3/4">
          <p className="text-gray-700 leading-relaxed pb-5">{description}</p>

          <div className="text-2xl font-bold text-primary mb-2">Chapters</div>

          {chapters.map((chapter) => (
            <ColoredStick
              key={chapter.text}
              text={chapter.text}
              color={chapter.color}
              href={chapter.href}
            />
          ))}
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
