"use client";
import MultiSelect from "@/components/MultiSelect";
import RadioSelect from "@/components/RadioSelect";
import TextAreaInput from "@/components/TextAreaInput";
import TextInput from "@/components/TextInput";
import ToggleOptions from "@/components/ToggleOption";
// import { getSkills } from "@/lib/data-manager";
import { useState } from "react";

export default function CustomExercisePage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [topics, setTopics] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [number, setNumber] = useState(10);
  const [toggles, setToggles] = useState({ answerKey: false, explanation: false });
  const [additional, setAdditional] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      skills,
      topics,
      difficulty,
      number,
      additional,
    };

    const res = await fetch("/api/getExercise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Response:", data);
  };

  // const skillOption = await getSkills().catch((err) => {
  //   console.error('Failed to load sections:', err);
  //   return null;
  // });

  // console.log("skillOption: ", skillOption);

  
  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 bg-gray-50">
      {/* Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-primary text-3xl font-bold font-rowdies">
          Custom Exercise Generator
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          You are in control. Use our AI to build a practice set perfectly tailored to your needs. 
          The AI will generate questions based on your configuration below.
        </p>
      </div>

      {/* Form Container */}
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        {/* Selected Skills */}
        <MultiSelect
          label="Skills to Focus On"
          placeholder="Select skills"
          options={["Grammar", "Listening", "Speaking", "Reading", "Writing"]}
          value={skills}
          onChange={setSkills}
        />
        <TextInput 
          type="text"
          label="Topics"
          placeholder="e.g., culinary, football"
          value={topics} 
          onChange={setTopics} />

        <div className="flex flex-wrap justify-between gap-6">
          <RadioSelect 
            label="Difficulity"
            options={["easy", "medium", "hard"]}
            value={difficulty} 
            onChange={setDifficulty} />

          <TextInput 
            type="number"
            label="Number of Questions"
            placeholder="e.g., 5, 10"
            value={number} 
            min={1}
            onChange={(val) => setNumber(Number(val))} />
        </div>

        <ToggleOptions
          options={[
            { label: "Include Answer Key", name: "answerKey" },
            { label: "Include Explanation", name: "explanation" },
          ]}
          values={toggles}
          onChange={(name, checked) => setToggles({ ...toggles, [name]: checked })}
        />

        <TextAreaInput 
          label="Additional Requirements"
          placeholder="Write any specific instructions or focus areas here..."
          value={additional} 
          onChange={setAdditional} />

        <div className="text-center">
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-saira px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Generate Exercise
          </button>
        </div>
      </form>
    </div>
  );
}
