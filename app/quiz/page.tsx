'use client';

import { useRouter } from 'next/navigation';
import Quiz from '@/components/Quiz';

// Sample quiz data
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

export default function QuizPage() {
  const router = useRouter();

  const handleSubmit = (selectedOptions: Record<string, string>) => {
    console.log('Quiz submitted with answers:', selectedOptions);

    // Calculate score
    let correctCount = 0;
    sampleQuestions.forEach((question) => {
      const selectedOptionId = selectedOptions[question.id];
      const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
      if (selectedOption?.isCorrect) {
        correctCount++;
      }
    });

    const score = (correctCount / sampleQuestions.length) * 100;

    // Store a sample attempt_id for demo purposes
    // In real scenario, this would come from your API response
    localStorage.setItem('attempt_id', 'demo_attempt_123');

    // Show score and ask if user wants to review
    const reviewChoice = confirm(
      `Quiz completed! Your score: ${score.toFixed(0)}% (${correctCount}/${sampleQuestions.length} correct)\n\nWould you like to review your answers?`
    );

    if (reviewChoice) {
      router.push('/quiz/review');
    }
  };

  return (
    <Quiz
      title="TOEFL Practice Quiz"
      questions={sampleQuestions}
      onSubmit={handleSubmit}
      enableUnderline={true}
    />
  );
}
