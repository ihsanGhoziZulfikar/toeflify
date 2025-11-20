'use client';

import PracticeCard from "@/components/PracticeCard";
import SkillHeader from "@/components/SkillHeader";
import { isEmpty } from "@/lib/helper";

interface Practice {
  id: string;
  title: string;
  section: string;
  number: number;
  difficulity: string;
  estTime: string;
  score: number;
  maxScore: number;
  attempted: boolean;
}

interface Skill{
    name: string;
    description: string;
    image: string;
    slug: string;
}

interface SkillPracticeClientProps {
  practices: Practice[];
  skill: Skill;
}

export default function SkillPracticeClient({ practices, skill }: SkillPracticeClientProps){
    return(
        <div className="min-h-screen flex flex-col items-center">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SkillHeader title={skill.name} description={skill.description} imageSrc={skill.image} />
                {!isEmpty(practices) ? (
                    practices.map((item) => (
                    <PracticeCard
                        key = {item.id}
                        id = {item.id}
                        title = {item.title}
                        section = {item.section}
                        number = {item.number}
                        difficulity = {item.difficulity}
                        estTime = {item.estTime}
                        score = {item.score}
                        maxScore = {item.maxScore}
                        attempted = {item.attempted}
                        onStart = {()=>{}}
                        onReview = {()=>{}}
                    />
                    ))
                ) : (
                    <div className="text-gray-500 text-center mt-10">No practices found.</div>
                )}
            </div>
        </div>
    );
}