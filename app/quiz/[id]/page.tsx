'use client';

import { useRouter, useParams } from 'next/navigation';
import Quiz from '@/components/Quiz';
import { Suspense, useEffect, useState } from 'react';

function QuizPageContent() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [questions, setQuestions] = useState<any[]>([]);
  const [quizTitle, setQuizTitle] = useState('Loading Quiz...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/fetch-exercise/${quizId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch quiz: ${response.statusText}`);
        }

        const quizData = await response.json();
        
        if (!quizData) {
          throw new Error('Quiz not found');
        }

        const transformedQuestions = quizData.questions.map((q: any, index: number) => ({
          id: `q-${index}`,
          text: q.questionText,
          options: q.options.map((opt: string, optIndex: number) => ({
            id: `q-${index}-opt-${optIndex}`,
            text: opt,
            isCorrect: optIndex === q.correctAnswerIndex,
          })),
          explanation: q.explanation,
          questionId: q.id,
        }));

        setQuestions(transformedQuestions);
        setQuizTitle(`${quizData.topics} - ${quizData.difficulty.charAt(0).toUpperCase() + quizData.difficulty.slice(1)} Level`);
      } catch (err) {
        console.error('❌ Failed to load quiz:', err);
        setError('Failed to load quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const handleSubmit = async (selectedOptions: Record<string, string>) => {
    console.log('Quiz submitted with answers:', selectedOptions);
    
    try {

      let correctCount = 0;
      const answersData = questions.map((q) => {
        const selectedOptionId = selectedOptions[q.id];
        const selectedOptionIndex = q.options.findIndex((opt: { id: string; }) => opt.id === selectedOptionId);
        const isCorrect = q.options[selectedOptionIndex]?.isCorrect || false;
        
        if (isCorrect) correctCount++;

        return {
          question_id: q.questionId,
          selected_option_index: selectedOptionIndex >= 0 ? selectedOptionIndex : null,
          is_correct: isCorrect,
        };
      });

      const percentage = (correctCount / questions.length) * 100;

      const reviewData = {
        questions: questions,
        userAnswers: selectedOptions,
      };
      sessionStorage.setItem('quizReviewData', JSON.stringify(reviewData));

      const response = await fetch('/api/quiz/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz_id: quizId,
          score: correctCount,
          total_questions: questions.length,
          percentage,
          answers: answersData,
          quiz_title: quizTitle,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("❌ API Error:", err);
        throw new Error("Failed to save attempt");
      }

      const data = await response.json();
      const attempt_id = data.attemptId;

      router.push(`/quiz/${quizId}/result?attemptId=${attempt_id}`);

    } catch (error) {
      console.error('❌ Error submitting quiz:', error);
      alert('An error occurred while submitting the quiz. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-lg">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No questions found in this quiz.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <Quiz title={quizTitle} questions={questions} onSubmit={handleSubmit} enableUnderline={true} />;
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    }>
      <QuizPageContent />
    </Suspense>
  );
}