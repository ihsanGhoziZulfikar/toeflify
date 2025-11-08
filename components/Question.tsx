'use client';

import React from 'react';

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

interface QuestionProps {
  questionData: QuestionData;
  questionNumber: number;
  onAnswerChange: (questionId: string, optionId: string) => void;
  isSubmitted: boolean;
  selectedOption?: string;
  enableUnderline?: boolean;
}

const Question: React.FC<QuestionProps> = ({
  questionData,
  questionNumber,
  onAnswerChange,
  isSubmitted,
  selectedOption,
  enableUnderline = false,
}) => {
  const handleOptionSelect = (optionId: string) => {
    if (!isSubmitted) {
      onAnswerChange(questionData.id, optionId);
    }
  };

  const getUnderlinedText = (text: string, options: QuestionOption[]) => {
    // Match option segments like **a)** *is* (with or without space)
    const optionPattern = /\*\*[a-d]\)\*\*\s*\*[^\*]+\*/g;
    let lastIndex = 0;
    const result: JSX.Element[] = [];

    // Try matching markdown segments
    const matches = text.matchAll(optionPattern);
    let hasMatches = false;

    for (const match of matches) {
      hasMatches = true;
      const optionSegment = match[0]; // e.g., **a)** *is*
      const index = match.index!;

      // Add text before the option segment
      if (index > lastIndex) {
        result.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, index)}</span>);
      }

      // Extract the option word (e.g., 'is')
      const matchResult = optionSegment.match(/\*\*([a-d])\)\*\*\s*\*([^\*]+)\*/);
      if (matchResult) {
        const word = matchResult[2];

        // Render only the underlined word
        result.push(
          <span key={`option-${index}`} className="underline decoration-2 decoration-black">
            {word}
          </span>
        );
      }

      lastIndex = index + optionSegment.length;
    }

    // If no markdown segments, underline option words/phrases in plain text
    if (!hasMatches) {
      let currentIndex = 0;

      while (currentIndex < text.length) {
        let foundMatch = false;
        let longestMatch = { length: 0, optionText: '' };

        // Find the longest matching option at the current position
        for (const option of options) {
          const optionText = option.text.trim();
          if (
            text
              .slice(currentIndex)
              .toLowerCase()
              .startsWith(optionText.toLowerCase())
          ) {
            if (optionText.length > longestMatch.length) {
              longestMatch = { length: optionText.length, optionText };
            }
          }
        }

        if (longestMatch.length > 0) {
          // Render the matched option text with underline
          result.push(
            <span
              key={`option-${currentIndex}`}
              className="underline decoration-2 decoration-black"
            >
              {text.slice(currentIndex, currentIndex + longestMatch.length)}
            </span>
          );
          currentIndex += longestMatch.length;
          foundMatch = true;
        }

        // If no option matched, move to the next character
        if (!foundMatch) {
          // Find the next word, space, or punctuation
          const nextSpace = text.slice(currentIndex).indexOf(' ');
          const nextPunct = text.slice(currentIndex).search(/[.,?!]/);
          let nextIndex = nextSpace === -1 ? text.length : currentIndex + nextSpace + 1;
          if (nextPunct !== -1 && (nextPunct < nextSpace || nextSpace === -1)) {
            nextIndex = currentIndex + nextPunct + 1;
          }

          result.push(
            <span key={`text-${currentIndex}`}>
              {text.slice(currentIndex, nextIndex)}
            </span>
          );
          currentIndex = nextIndex;
        }
      }
    } else if (lastIndex < text.length) {
      // Add remaining text after the last markdown segment
      result.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    }

    return result;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-gray-900 font-semibold text-xl mb-6 font-sans">
        {questionNumber}.{' '}
        {enableUnderline
          ? getUnderlinedText(questionData.text, questionData.options)
          : questionData.text}
      </h2>
      <div
        className="space-y-4"
        role="radiogroup"
        aria-labelledby={`question-${questionData.id}`}
      >
        {questionData.options.map((option, index) => (
          <div
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            onKeyDown={(e) => e.key === 'Enter' && handleOptionSelect(option.id)}
            className={`flex items-center gap-3 border border-gray-200 rounded-lg p-3 cursor-pointer transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isSubmitted
                ? selectedOption === option.id
                  ? option.isCorrect
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                  : 'hover:bg-gray-50'
                : selectedOption === option.id
                ? 'bg-blue-50 border-blue-300'
                : 'hover:bg-gray-50'
            }`}
            tabIndex={0}
            role="radio"
            aria-checked={selectedOption === option.id}
          >
            <div
              className={`w-12 h-12 flex items-center justify-center border rounded-md text-lg font-medium transition-colors duration-200 ${
                isSubmitted
                  ? selectedOption === option.id
                    ? option.isCorrect
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-red-500 text-white border-red-500'
                    : 'border-gray-300 text-gray-600'
                  : selectedOption === option.id
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {String.fromCharCode(65 + index)}
            </div>
            <div className="text-gray-700 text-lg">{option.text}</div>
            {isSubmitted && selectedOption === option.id && option.isCorrect && (
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
