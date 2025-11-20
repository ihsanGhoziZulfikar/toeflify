'use server';

import { getQuizzesBySkillName, getSkillBySlug } from "@/lib/data-manager";
import SkillPracticeClient from "./SkillPracticeClient"
import { notFound } from "next/navigation";
import { urlFor } from "@/lib/imageFallback";
import BreadcrumbLayout from "@/components/BreadcrumbLayout";

interface SkillPracticePageProps {
  params: {
    slug: string;
  };
}

export default async function SkillPracticePage({ params }: SkillPracticePageProps){

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
        image: urlFor(skill.coverImage),
        description: skill.description ?? '',
        slug: skillSlug
      };

    // const practices = await getQuizzesBySkillName(skillData.name);
    const practices = [
      { id: '1', title: "Grammar question Set 1", section: "Structure and written expression", skill: "Be Sure The Sentences", number: 10, estTime: "15 min", difficulity: "Easy", attempted: true, score: 2, maxScore: 10 },
      { id: '2', title: "Grammar question Set 2", section: "Structure and written expression", skill: "Be Sure The Sentences", number: 10, estTime: "15 min", difficulity: "Medium", attempted: false, score: 10, maxScore: 10 },
      { id: '3', title: "Grammar question Set 3", section: "Reading comprehension", skill: "Be Sure The Sentences", number: 10, estTime: "15 min", difficulity: "Hard", attempted: true, score: 10, maxScore: 10 },
    ];
    
    return(
      <BreadcrumbLayout type="skill" slug={skillSlug}>
        <SkillPracticeClient
            practices={practices}
            skill={skillData}
        />
      </BreadcrumbLayout>
    )
}