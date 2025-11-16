"use client";

import ProfileDropdown from "@/components/ProfileDropdown";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  title: string;
  date: string;
  score: number;
};

export default function HistoryPage() {
  const router = useRouter();
  const [histories, setHistories] = useState<HistoryItem[]>([]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const getHistories = async () => {
    try {
      const response = await fetch('/api/quiz/history', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Server failed to fetch histories');
        return;
      }

      const data = await response.json();

      setHistories(data.data.histories);

    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

    useEffect(() => {
      getHistories();
    }, []);
  

  return (
    <div className="min-h-screen py-10 flex justify-center w-full">
      
    <div className="flex gap-5 w-full max-w-6xl mx-auto">
      <div>
        <ProfileDropdown />
      </div>
      

      <div className="w-full mx-5">
        {/* Header */}
        <div className="w-full max-w-4xl mb-8">
          <h1 className="text-3xl font-rowdies text-primary">History</h1>
          <div className="mt-2 h-[2px] bg-primary/60"></div>
        </div>

        {/* History List */}
        <div className="w-full max-w-4xl bg-white space-y-4">
          <div className="flex items-center justify-between text-xl px-2">
            <h2 className="font-saira font-semibold">Task</h2>
            <h2 className="font-saira font-semibold">Score</h2>
          </div>
          <div className="max-h-100 overflow-y-scroll">
            {histories && histories.length > 0 ? histories.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/quiz/review/${item.id}`)}
                className="flex items-center justify-between border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-100 p-3 pr-5"
              >
                <div>
                  <h2 className="font-saira text-gray-800">{item.title}</h2>
                  <p className="text-sm text-gray-500">{formatDate(item.date)}</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg ${item.score > 0? "text-green-700" : "text-red-700"}`}>{item.score}</span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic">No histories available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
