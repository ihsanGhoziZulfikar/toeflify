'use client';

import FilterSidebar from '@/components/FilterSidebar';
import PracticeCard from '@/components/PracticeCard';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PracticeClient({ filterData, practices }: { filterData: any; practices: any[] }) {
  const router = useRouter();
  const params = useSearchParams();

  // Handle when filter changes (update URL)
    const handleFilterChange = (key: string, value: string) => {
        console.log("handle filter change:", key, value);
        const newParams = new URLSearchParams(params.toString());

        if (value) newParams.set(key, value);
        else newParams.delete(key);

        // Reset dependent filters
        if (key === "section") {
            newParams.delete("chapter");
            newParams.delete("topic");
        } else if (key === "chapter") {
            newParams.delete("topic");
        }

        router.push(`/practice?${newParams.toString()}`);
    };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Filters */}
      <div className="m-5">
        <FilterSidebar filterData={filterData} onFilterChange={handleFilterChange} />
      </div>
      
      <div className="w-full w-max-5xl p-5 pr-10">
        {practices.length > 0 ? (
          practices.map((item) => (
            <PracticeCard
              key = {item.id}
              id = {item.id}
              title = {item.title}
              section = {item.section}
              number = {item.number}
              difficulity = {item.difficulity}
              estTime = {item.estTime}
              score = {item.score}
              maxScore = {item.maxScore}
              attempted = {item.attempted}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center mt-10">No practices found.</div>
        )}
      </div>
    </div>
  );
}
