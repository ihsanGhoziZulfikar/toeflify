'use client';
import MultiSelect from '@/components/MultiSelect';
import RadioSelect from '@/components/RadioSelect';
import TextAreaInput from '@/components/TextAreaInput';
import TextInput from '@/components/TextInput';
import ToggleOptions from '@/components/ToggleOption';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CustomExerciseProps {
  skillNames: string[];
}

export default function CustomExercisePage({ skillNames }: CustomExerciseProps) {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [number, setNumber] = useState(10);
  const [toggles, setToggles] = useState({ answerKey: false, explanation: false });
  const [additional, setAdditional] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      skills,
      interests,
      difficulty,
      number,
      toggles,
      additional,
    };

    try {
      const response = await fetch('/api/generate-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success || !result.quizId) {
        throw new Error('Failed to generate and save exercise');
      }

      router.push(`/quiz/${result.quizId}`);

    } catch (error) {
      console.error('❌ Error generating/saving exercise:', error);
      alert('Failed to generate or save quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-primary text-3xl font-bold font-rowdies">Custom Exercise Generator</h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          You are in control. Use our AI to build a practice set perfectly tailored to your needs. The AI will generate questions based on your configuration below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <MultiSelect label="Skills to Focus On" placeholder="Select skills" options={skillNames} value={skills} onChange={setSkills} />
        <TextInput type="text" label="Topics" placeholder="e.g., culinary, football" value={interests} onChange={setInterests} />

        <div className="flex flex-wrap justify-between gap-6">
          <RadioSelect label="Difficulity" options={['easy', 'medium', 'hard']} value={difficulty} onChange={setDifficulty} />

          <TextInput type="number" label="Number of Questions" placeholder="e.g., 5, 10" value={number} min={1} onChange={(val) => setNumber(Number(val))} />
        </div>

        <ToggleOptions
          options={[
            { label: 'Include Answer Key', name: 'answerKey' },
            { label: 'Include Explanation', name: 'explanation' },
          ]}
          values={toggles}
          onChange={(name, checked) => setToggles({ ...toggles, [name]: checked })}
        />

        <TextAreaInput label="Additional Requirements" placeholder="Write any specific instructions or focus areas here..." value={additional} onChange={setAdditional} />

        <div className="text-center">
          <button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white font-saira px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isLoading ? 'Generating...' : 'Generate Exercise'}
          </button>
        </div>
      </form>
    </div>
  );
}