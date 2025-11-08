'use client';

import React from 'react';

interface Answer {
  label: string;
  text: string;
}

interface Question {
  number: number;
  text: string;
}

interface ReviewQuestionProps {
  question: Question;
  answers: Answer[];
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  tips?: string[];
}

const ReviewQuestion: React.FC<ReviewQuestionProps> = ({
  question,
  answers,
  correctAnswer,
  userAnswer,
  explanation,
  tips = [],
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-gray-900 font-semibold text-xl mb-6 font-sans">
        {question.number}. {question.text}
      </h2>

      <div className="space-y-4" role="radiogroup" aria-labelledby={`question-${question.number}`}>
        {answers.map((answer, index) => {
          const isCorrect = correctAnswer === answer.text;
          const isUserAnswer = userAnswer === answer.text;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 border border-gray-200 rounded-lg p-3 transition-all duration-200 ${
                isCorrect
                  ? 'bg-green-50 border-green-300'
                  : isUserAnswer
                  ? 'bg-red-50 border-red-300'
                  : 'bg-gray-50'
              }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center border rounded-md text-lg font-medium transition-colors duration-200 ${
                  isCorrect
                    ? 'bg-green-500 text-white border-green-500'
                    : isUserAnswer
                    ? 'bg-red-500 text-white border-red-500'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <div className="text-gray-700 text-lg">{answer.text}</div>
              {isCorrect && (
                <div className="ml-auto">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {isUserAnswer && !isCorrect && (
                <div className="ml-auto">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Penjelasan:</h3>
        <p className="text-gray-700 leading-relaxed">{explanation}</p>

        {tips && tips.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewQuestion;
