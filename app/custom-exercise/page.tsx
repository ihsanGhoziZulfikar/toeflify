import { getSkills } from "@/lib/data-manager";
import CustomExerciseForm from "./_components/CustomExerciseForm";

const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const extractSkillNames = (data: any[]): string[] => {
  const names: string[] = [];
  data.forEach((section) => {
    section.chapters?.forEach((chapter: any) => {
      chapter.topicGroups?.forEach((group: any) => {
        group.skills?.forEach((skill: any) => {
          if (skill.name) names.push(toTitleCase(skill.name.trim()));
        });
      });
    });
  });
  return Array.from(new Set(names)); // remove duplicates
};

export default async function CustomExercisePage() {
  const skills = await getSkills();
  const skillNames = extractSkillNames(skills);

  console.log("Extracted skillNames:", skillNames);

  return <CustomExerciseForm skillNames={skillNames} />;
}
