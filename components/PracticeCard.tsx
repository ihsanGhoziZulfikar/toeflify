'use client';

import OutlineButton from "@/components/OutlineButton";
import PrimaryButton from "@/components/PrimaryButton";
import { BookOpen } from "lucide-react";

interface PracticeCardProps{
    id: string,
    title: string,
    section: string,
    number: number,
    difficulity: string,
    estTime: string,
    score: number,
    maxScore: number,
    attempted: boolean
}

export default function PracticeCard({ id, title, section, number, difficulity, estTime, score, maxScore, attempted }: PracticeCardProps){
    return (
        <div
            key={id}
            className="flex flex-row justify-start rounded-sm shadow-md border border-gray-100 items-center cursor-pointer hover:bg-gray-100 px-5 py-2 m-2 gap-3"
        >
            <div className="rounded-lg bg-purple-200 p-3">
            <BookOpen color="#9747FF" />
            </div>

            <div className="w-full flex flex-row items-center justify-between border-b border-gray-100 last:border-0 text-rowdies">
            <div>
                <h2 className="font-saira text-primary font-semibold">{title}</h2>
                <p className="text-sm text-primary">
                {section} • {number} Questions • Est. {estTime} • {difficulity}
                </p>
            </div>

            <div className="flex flex-col min-w-50 gap-1 mt-2">
                <div className="flex justify-between">
                <div className="text-xs">{attempted ? 'Completed' : 'Not Attempted'}</div>
                <div className="text-xs font-semibold">
                    {attempted ? `Score ${score}/${maxScore}` : ''}
                </div>
                </div>

                {attempted ? (
                <div className="w-full bg-gray-200 rounded-lg h-2 overflow-hidden">
                    <div
                    className={`h-full transition-all duration-500 ${
                        score === maxScore ? 'bg-primary' : 'bg-red-500'
                    }`}
                    style={{
                        width: `${(score / maxScore) * 100}%`,
                    }}
                    ></div>
                </div>
                ) : (
                <div className="w-full bg-gray-400 rounded-lg h-2 overflow-hidden"></div>
                )}

                <div className="flex justify-end mt-1">
                {attempted ? (
                    <div className="flex gap-2">
                    <PrimaryButton name="Review" onClick={() => {}} />
                    <OutlineButton name="Retry" onClick={() => {}} />
                    </div>
                ) : (
                    <PrimaryButton name="Start" onClick={() => {}} />
                )}
                </div>
            </div>
            </div>
        </div>
    )
}