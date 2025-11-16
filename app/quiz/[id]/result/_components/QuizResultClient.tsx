'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CompleteQuizImage from 'public/assets/images/completed-quiz.png';

export default function QuizResultClient() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const attemptId = sessionStorage.getItem('attemptId');

  useEffect(() => {
    const reviewDataStr = sessionStorage.getItem('quizReviewData');
    if (reviewDataStr) {
      const { questions, userAnswers } = JSON.parse(reviewDataStr);

      let correctCount = 0;
      questions.forEach((question: any) => {
        const correctOption = question.options.find((opt: any) => opt.isCorrect);
        if (correctOption && userAnswers[question.id] === correctOption.id) {
          correctCount++;
        }
      });

      const total = questions.length;
      const calculatedScore = correctCount;
      const calculatedPercentage = total > 0 ? (correctCount / total) * 100 : 0;

      setTotalQuestions(total);
      setCorrectAnswers(correctCount);
      setScore(calculatedScore);
      setPercentage(Math.round(calculatedPercentage));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Image Section */}
        <div className="mb-6">
          <Image src={CompleteQuizImage} alt="Exercise Completed" width={256} height={256} className="mx-auto" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Exercise Completed</h1>

        {/* Score Section */}
        <div className="flex justify-around gap-4 mb-8">
          <div className="bg-blue-100 border-2 border-blue-500 text-blue-600 rounded-lg px-4 py-3 text-center shadow-md flex-1">
            <p className="text-sm font-medium">Total Questions</p>
            <p className="text-2xl font-bold">{totalQuestions}</p>
          </div>
          <div className="bg-green-100 border-2 border-green-500 text-green-600 rounded-lg px-4 py-3 text-center shadow-md flex-1">
            <p className="text-sm font-medium">Correct</p>
            <p className="text-2xl font-bold">{correctAnswers}</p>
          </div>
          <div className="bg-purple-100 border-2 border-purple-500 text-purple-600 rounded-lg px-4 py-3 text-center shadow-md flex-1">
            <p className="text-sm font-medium">Your Score</p>
            <p className="text-2xl font-bold">{`${percentage}%`}</p>
          </div>
        </div>

        <hr className="border-t-2 border-gray-200 w-full mx-auto my-6" />

        {/* Buttons */}
        <div className="flex justify-center gap-8">
          <button className="bg-yellow-400 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition-all transform hover:-translate-y-0.5" onClick={() => router.push('/quiz/review')}>
            REVIEW EXERCISE
          </button>
          <button className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all transform hover:-translate-y-0.5" onClick={() => router.push('/')}>
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
