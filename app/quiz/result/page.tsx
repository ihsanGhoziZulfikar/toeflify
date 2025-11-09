"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import CompleteQuizImage from "public/assets/images/completed-quiz.png"; // pastikan file ada di /public

export default function QuizResultPage() {
  const router = useRouter();
  const params = useSearchParams();

  // Ambil data dari query (misal: /quiz-result?score=10&percentage=85)
  const score = Number(params.get("score")) || 0;
  const percentage = Number(params.get("percentage")) || 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Image Section */}
        <div className="mb-6">
          <Image
            src={CompleteQuizImage}
            alt="Exercise Completed"
            width={256}
            height={256}
            className="mx-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-blue-600 mb-8">
          Exercise Completed
        </h1>

        {/* Score Section */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="bg-green-100 border-2 border-green-500 text-green-600 rounded-lg px-6 py-4 text-center shadow-md">
            <p className="text-sm font-medium">Your Score</p>
            <p className="text-2xl font-bold">{`+${score}`}</p>
          </div>
          <div className="bg-purple-100 border-2 border-purple-500 text-purple-600 rounded-lg px-6 py-4 text-center shadow-md">
            <p className="text-sm font-medium">You Are Great</p>
            <p className="text-2xl font-bold">{`${percentage}%`}</p>
          </div>
        </div>

        <hr className="border-t-2 border-gray-200 w-full mx-auto my-6" />

        {/* Buttons */}
        <div className="flex justify-center gap-8">
          <button
            className="bg-yellow-400 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500"
            onClick={() => router.push("/quiz/review")}
          >
            REVIEW EXERCISE
          </button>
          <button
            className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
            onClick={() => router.push("/")}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
