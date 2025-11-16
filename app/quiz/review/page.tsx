'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReviewQuestion from '@/components/ReviewQuestion';
import { Suspense } from 'react';

interface Answer {
  label: string;
  text: string;
}

interface TransformedQuestion {
  number: number;
  text: string;
  answers: Answer[];
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
}

function ReviewQuizPageComponent() {
  const router = useRouter();
  const [questions, setQuestions] = useState<TransformedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  useEffect(() => {
    if (!attemptId) {
      setError("Missing attemptId");
      setLoading(false);
      return;
    }

    async function loadReview() {
      try {
        setLoading(true);

        const res = await fetch(`/api/quiz/review?attemptId=${attemptId}`);

        if (!res.ok) {
          const err = await res.json();
          setError(err.error || 'Failed to load review data.');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

    loadReview();
  }, [attemptId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          Loading review...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 bg-gray-50">
      <div className="mb-6">
        <button
          className="flex items-center gap-2 text-blue-500 font-medium hover:text-blue-600 transition-colors"
          onClick={handleBack}
        >
          <span className="text-lg">&#8592;</span>
          <span>Back</span>
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 font-sans">
        Review Exercise
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        {questions.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-600">No questions to review.</p>
          </div>
        ) : (
          questions.map((question, index) => (
            <ReviewQuestion
              key={index}
              question={question}
              answers={question.answers}
              correctAnswer={question.correctAnswer}
              userAnswer={question.userAnswer}
              explanation={question.explanation}
              tips={[]}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function ReviewQuizPage() {
  return (
    <Suspense>
      <ReviewQuizPageComponent /> 
    </Suspense>
  )
}