'use client';

import { useState, useEffect } from 'react';
import Question from './Question';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface QuestionData {
  id: string;
  text: string;
  options: QuestionOption[];
}

interface QuizProps {
  title: string;
  questions: QuestionData[];
  onSubmit: (selectedOptions: Record<string, string>) => void;
  loading?: boolean;
  error?: string | null;
  enableUnderline?: boolean;
}

const Quiz: React.FC<QuizProps> = ({
  title,
  questions,
  onSubmit,
  loading = false,
  error = null,
  enableUnderline = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const totalQuestions = questions.length;
  const progressPercentage = Math.min((answeredQuestions / totalQuestions) * 100, 100);

  useEffect(() => {
    const answeredCount = Object.keys(selectedOptions).length;
    setAnsweredQuestions(answeredCount);
  }, [selectedOptions]);

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    if (answeredQuestions < totalQuestions) {
      alert('Please answer all questions before submitting.');
      return;
    }
    setIsSubmitted(true);
    onSubmit(selectedOptions);
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 font-sans">
        {title}
      </h1>
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <span className="text-gray-600 text-sm font-medium text-end mt-2 block">
            {answeredQuestions}/{totalQuestions} Questions
          </span>
        </div>

        {questions.map((question, index) => (
          <Question
            key={question.id}
            questionData={question}
            questionNumber={index + 1}
            onAnswerChange={handleAnswerChange}
            isSubmitted={isSubmitted}
            selectedOption={selectedOptions[question.id]}
            enableUnderline={enableUnderline}
          />
        ))}

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 transform hover:scale-105"
            aria-label="Submit quiz"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
