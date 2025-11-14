'use client';

import FilterSidebar from '@/components/FilterSidebar';
import OutlineButton from '@/components/OutlineButton';
import PrimaryButton from '@/components/PrimaryButton';
import { BookOpen } from 'lucide-react';
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
            <div
              key={item.id}
              className="flex flex-row justify-start rounded-sm shadow-md border border-gray-100 items-center cursor-pointer hover:bg-gray-100 px-5 py-2 m-2 gap-3"
            >
              <div className="rounded-lg bg-purple-200 p-3">
                <BookOpen color="#9747FF" />
              </div>

              <div className="w-full flex flex-row items-center justify-between border-b border-gray-100 last:border-0 text-rowdies">
                <div>
                  <h2 className="font-saira text-primary font-semibold">{item.title}</h2>
                  <p className="text-sm text-primary">
                    {item.section} • {item.number} Questions • Est. {item.estTime} • {item.difficulity}
                  </p>
                </div>

                <div className="flex flex-col min-w-50 gap-1 mt-2">
                  <div className="flex justify-between">
                    <div className="text-xs">{item.attempted ? 'Completed' : 'Not Attempted'}</div>
                    <div className="text-xs font-semibold">
                      {item.attempted ? `Score ${item.score}/${item.maxScore}` : ''}
                    </div>
                  </div>

                  {item.attempted ? (
                    <div className="w-full bg-gray-200 rounded-lg h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          item.score === item.maxScore ? 'bg-primary' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${(item.score / item.maxScore) * 100}%`,
                        }}
                      ></div>
                    </div>
                  ) : (
                    <div className="w-full bg-gray-400 rounded-lg h-2 overflow-hidden"></div>
                  )}

                  <div className="flex justify-end mt-1">
                    {item.attempted ? (
                      <div className="flex gap-2">
                        <PrimaryButton name="Review" onClick={() => {}} />
                        <OutlineButton name="Retry" onClick={() => {}} />
                      </div>
                    ) : (
                      <PrimaryButton name="Start" onClick={() => {}} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center mt-10">No practices found.</div>
        )}
      </div>
    </div>
  );
}
