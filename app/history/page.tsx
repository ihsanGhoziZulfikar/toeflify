"use client";

import ProfileDropdown from "@/components/ProfileDropdown";

export default function HistoryPage() {
  // Example data
  const histories = [
    { id: 1, title: "Grammar Practice Set 1", date: "07 November 2024", score: +88 },
    { id: 2, title: "Listening Quiz - Unit 3", date: "01 January 2024", score: -92 },
    { id: 3, title: "Reading Comprehension A", date: "14 October 2023", score: +76 },
    { id: 4, title: "Grammar Practice Set 1", date: "07 November 2024", score: +88 },
    { id: 5, title: "Listening Quiz - Unit 3", date: "01 January 2024", score: -92 },
    { id: 6, title: "Reading Comprehension A", date: "14 October 2023", score: +76 },
    { id: 7, title: "Grammar Practice Set 1", date: "07 November 2024", score: +88 },
    { id: 8, title: "Listening Quiz - Unit 3", date: "01 January 2024", score: -92 },
    { id: 9, title: "Reading Comprehension A", date: "14 October 2023", score: +76 },
    { id: 10, title: "Grammar Practice Set 1", date: "07 November 2024", score: +88 },
    { id: 11, title: "Listening Quiz - Unit 3", date: "01 January 2024", score: -92 },
    { id: 12, title: "Reading Comprehension A", date: "14 October 2023", score: +76 },
  ];

  return (
    <div className="min-h-screen px-20 py-10 flex gap-5">
      <ProfileDropdown />

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
            {histories.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-100 p-3 pr-5"
              >
                <div>
                  <h2 className="font-saira text-gray-800">{item.title}</h2>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg ${item.score > 0? "text-green-700" : "text-red-700"}`}>{item.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
