'use client';

import { useRouter } from 'next/navigation';
import Quiz from '@/components/Quiz';
import { Suspense, useEffect, useState } from 'react';

interface GeneratedQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

interface GeneratedQuiz {
  questions: GeneratedQuestion[];
}

const sampleQuestions = [
  {
    id: '1',
    text: 'What is the capital of France?',
    options: [
      { id: '1a', text: 'London', isCorrect: false },
      { id: '1b', text: 'Paris', isCorrect: true },
      { id: '1c', text: 'Berlin', isCorrect: false },
      { id: '1d', text: 'Madrid', isCorrect: false },
    ],
  },
  {
    id: '2',
    text: 'Which of the following is a programming language?',
    options: [
      { id: '2a', text: 'HTML', isCorrect: false },
      { id: '2b', text: 'CSS', isCorrect: false },
      { id: '2c', text: 'JavaScript', isCorrect: true },
      { id: '2d', text: 'JSON', isCorrect: false },
    ],
  },
  {
    id: '3',
    text: 'What does TOEFL stand for?',
    options: [
      { id: '3a', text: 'Test of English as a Foreign Language', isCorrect: true },
      { id: '3b', text: 'Test of English for Learning', isCorrect: false },
      { id: '3c', text: 'Teaching of English as a Foreign Language', isCorrect: false },
      { id: '3d', text: 'Test of English Foreign Literacy', isCorrect: false },
    ],
  },
  {
    id: '4',
    text: 'The **a)** *quick* brown **b)** *fox* **c)** *jumps* over the **d)** *lazy* dog.',
    options: [
      { id: '4a', text: 'quick', isCorrect: false },
      { id: '4b', text: 'fox', isCorrect: false },
      { id: '4c', text: 'jumps', isCorrect: true },
      { id: '4d', text: 'lazy', isCorrect: false },
    ],
  },
  {
    id: '5',
    text: 'Which is the largest ocean on Earth?',
    options: [
      { id: '5a', text: 'Atlantic Ocean', isCorrect: false },
      { id: '5b', text: 'Indian Ocean', isCorrect: false },
      { id: '5c', text: 'Arctic Ocean', isCorrect: false },
      { id: '5d', text: 'Pacific Ocean', isCorrect: true },
    ],
  },
];

function QuizPageContent() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>(sampleQuestions);
  const [quizTitle, setQuizTitle] = useState('TOEFL Practice Quiz');

  useEffect(() => {
    const storedQuiz = sessionStorage.getItem('customQuiz');
    if (storedQuiz) {
      try {
        const quizData: GeneratedQuiz = JSON.parse(storedQuiz);
        const transformedQuestions = quizData.questions.map((q, index) => ({
          id: `q-${index}`,
          text: q.questionText,
          options: q.options.map((opt, optIndex) => ({
            id: `q-${index}-opt-${optIndex}`,
            text: opt,
            isCorrect: optIndex === q.correctAnswerIndex,
          })),
          explanation: q.explanation,
        }));
        setQuestions(transformedQuestions);
        setQuizTitle('Your Custom Generated Quiz');
      } catch (error) {
        console.error('Failed to parse custom quiz data:', error);
        setQuestions(sampleQuestions);
      }
    }
  }, []);

  const handleSubmit = (selectedOptions: Record<string, string>) => {
    console.log('Quiz submitted with answers:', selectedOptions);
    const reviewData = {
      questions: questions,
      userAnswers: selectedOptions,
    };
    sessionStorage.setItem('quizReviewData', JSON.stringify(reviewData));
    router.push(`/quiz/result`);
  };

  return <Quiz title={quizTitle} questions={questions} onSubmit={handleSubmit} enableUnderline={true} />;
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <QuizPageContent />
    </Suspense>
  );
}
