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
  tips: string[];
}

// Sample review data for simulation
const sampleReviewData: TransformedQuestion[] = [
  {
    number: 1,
    text: 'What is the capital of France?',
    answers: [
      { label: 'A', text: 'London' },
      { label: 'B', text: 'Paris' },
      { label: 'C', text: 'Berlin' },
      { label: 'D', text: 'Madrid' },
    ],
    correctAnswer: 'Paris',
    userAnswer: 'Paris',
    explanation: 'Paris is the capital and most populous city of France. It has been a major European city for centuries.',
    tips: [],
  },
  {
    number: 2,
    text: 'Which of the following is a programming language?',
    answers: [
      { label: 'A', text: 'HTML' },
      { label: 'B', text: 'CSS' },
      { label: 'C', text: 'JavaScript' },
      { label: 'D', text: 'JSON' },
    ],
    correctAnswer: 'JavaScript',
    userAnswer: 'HTML',
    explanation: 'JavaScript is a programming language that enables interactive web pages. HTML and CSS are markup/styling languages, while JSON is a data format.',
    tips: [],
  },
  {
    number: 3,
    text: 'What does TOEFL stand for?',
    answers: [
      { label: 'A', text: 'Test of English as a Foreign Language' },
      { label: 'B', text: 'Test of English for Learning' },
      { label: 'C', text: 'Teaching of English as a Foreign Language' },
      { label: 'D', text: 'Test of English Foreign Literacy' },
    ],
    correctAnswer: 'Test of English as a Foreign Language',
    userAnswer: 'Test of English as a Foreign Language',
    explanation: 'TOEFL stands for Test of English as a Foreign Language. It is a standardized test to measure English language ability of non-native speakers.',
    tips: [],
  },
  {
    number: 4,
    text: 'The quick brown fox jumps over the lazy dog.',
    answers: [
      { label: 'A', text: 'quick' },
      { label: 'B', text: 'fox' },
      { label: 'C', text: 'jumps' },
      { label: 'D', text: 'lazy' },
    ],
    correctAnswer: 'jumps',
    userAnswer: 'jumps',
    explanation: 'In this sentence, "jumps" is the main verb showing the action performed by the fox.',
    tips: [],
  },
  {
    number: 5,
    text: 'Which is the largest ocean on Earth?',
    answers: [
      { label: 'A', text: 'Atlantic Ocean' },
      { label: 'B', text: 'Indian Ocean' },
      { label: 'C', text: 'Arctic Ocean' },
      { label: 'D', text: 'Pacific Ocean' },
    ],
    correctAnswer: 'Pacific Ocean',
    userAnswer: 'Atlantic Ocean',
    explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 30% of the Earth\'s surface.',
    tips: [],
  },
];

export default function ReviewQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<TransformedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setQuestions(sampleReviewData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          Loading questions...
        </p>
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
              tips={question.tips}
            />
          ))
        )}
      </div>
    </div>
  );
}
