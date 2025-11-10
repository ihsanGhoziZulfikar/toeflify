'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReviewQuestion from '@/components/ReviewQuestion';

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

export default function ReviewQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<TransformedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reviewDataStr = sessionStorage.getItem('quizReviewData');
    if (reviewDataStr) {
      const { questions: rawQuestions, userAnswers } = JSON.parse(reviewDataStr);

      const transformedData = rawQuestions.map((q: any, index: number) => {
        const correctOption = q.options.find((opt: any) => opt.isCorrect);
        const userOption = q.options.find((opt: any) => opt.id === userAnswers[q.id]);

        return {
          number: index + 1,
          text: q.text,
          answers: q.options.map((opt: any, optIndex: number) => ({
            label: String.fromCharCode(65 + optIndex), // A, B, C, D
            text: opt.text,
          })),
          correctAnswer: correctOption?.text || 'N/A',
          userAnswer: userOption?.text || 'Not Answered',
          explanation: q.explanation || 'No explanation provided.',
        };
      });

      setQuestions(transformedData);
    }
    setLoading(false);
  }, []);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg font-medium animate-pulse">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 bg-gray-50">
      <div className="mb-6">
        <button className="flex items-center gap-2 text-blue-500 font-medium hover:text-blue-600 transition-colors" onClick={handleBack}>
          <span className="text-lg">&#8592;</span>
          <span>Back</span>
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 font-sans">Review Exercise</h1>

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
              tips={[]} // Tips can be added later if the AI provides them
            />
          ))
        )}
      </div>
    </div>
  );
}
