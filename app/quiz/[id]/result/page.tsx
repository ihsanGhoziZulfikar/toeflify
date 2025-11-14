import { Suspense } from "react";
import QuizResultClient from "./_components/QuizResultClient";

export default function QuizResultPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading result...</p>}>
      <QuizResultClient />
    </Suspense>
  );
}
