import { NextResponse } from "next/server";

interface QuestionBatchRequestBody {
  questionBatchId: string;
}

interface AnswerChoice {
    choice: string;
    choiceText: string;
}

interface Question {
    id: string;
    question: string;
    answers: AnswerChoice[];
    correctAnswer: string;
    explanation: string;
}

interface QuestionBatchResponse {
    data: {
        questionBatch: Question[];
    };
}

const allBatches: Record<string, Question[]> = {
  "batch123": [
    {
      id: "q1",
      question: "Apa teknologi yang digunakan untuk membangun Next.js?",
      answers: [
        { choice: "A", choiceText: "React" },
        { choice: "B", choiceText: "Vue" },
        { choice: "C", choiceText: "Angular" }
      ],
      correctAnswer: "A",
      explanation: "Next.js adalah framework React untuk production."
    },
    {
      id: "q2",
      question: "Di mana API routes didefinisikan di Next.js App Router?",
      answers: [
        { choice: "A", choiceText: "Di dalam folder `pages/api`" },
        { choice: "B", choiceText: "Di dalam file `next.config.js`" },
        { choice: "C", choiceText: "Di dalam file `route.ts` atau `route.js`" }
      ],
      correctAnswer: "C",
      explanation: "Di App Router, endpoint API didefinisikan dengan file `route.ts` (atau .js)."
    }
  ],
  "batch456": [
    {
      id: "q3",
      question: "Bahasa apa yang paling sering digunakan dengan Node.js?",
      answers: [
        { choice: "A", choiceText: "Python" },
        { choice: "B", choiceText: "JavaScript" },
        { choice: "C", choiceText: "Go" }
      ],
      correctAnswer: "B",
      explanation: "Node.js adalah runtime environment untuk JavaScript."
    }
  ]
};

// handler POST
export async function POST(request: Request) {
    try {
        const body: QuestionBatchRequestBody = await request.json();
        const { questionBatchId } = body;

        if(!questionBatchId) {
            return NextResponse.json(
                { error: "questionBatchId is required" },
                { status: 400 }
            );
        }

        const batchData = allBatches[questionBatchId];

        if (!batchData) {
            return NextResponse.json({error: `No data found for questionBatchId: ${questionBatchId}`}, {status: 404});
        }

        const response: QuestionBatchResponse = {
            data: {
                questionBatch: batchData
            }
        }

        return NextResponse.json(response, {status: 200});
    } catch (err) {
        return NextResponse.json({error: `Error fetching question batch: ${err}`,},{ status: 500 });
    }
}