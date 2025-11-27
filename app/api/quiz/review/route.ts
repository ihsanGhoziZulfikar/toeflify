import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const attemptId = url.searchParams.get("attemptId");

    if (!attemptId) {
      return NextResponse.json(
        { error: "Missing attemptId in query params" },
        { status: 400 }
      );
    }
    const supabase = createSupabaseServerClient();

    const { data: attempt, error: attemptErr } = await supabase
      .from("quiz_attempts")
      .select("*")
      .eq("id", attemptId)
      .single();

    if (attemptErr || !attempt) {
      return NextResponse.json(
        { error: "Attempt not found" },
        { status: 404 }
      );
    }

    const { data: questions, error: questionsErr } = await supabase
      .from("questions")
      .select("id, question_text, explanation, question_order, correct_answer_index")
      .eq("quiz_id", attempt.quiz_id)
      .order("question_order", { ascending: true });

    if (questionsErr) {
      return NextResponse.json(
        { error: "Failed to load questions" },
        { status: 500 }
      );
    }

    const questionIds = questions.map((q) => q.id);
    const { data: options, error: optionsErr } = await supabase
      .from("question_options")
      .select("id, question_id, option_text, option_order")
      .in("question_id", questionIds);

    if (optionsErr) {
      console.error("Options error:", optionsErr);
      return NextResponse.json(
        { error: "Failed to load options" },
        { status: 500 }
      );
    }

    const { data: answers, error: answersErr } = await supabase
      .from("attempt_answers")
      .select("question_id, selected_option_index")
      .eq("attempt_id", attemptId);

    if (answersErr) {
      return NextResponse.json(
        { error: "Failed to load answers" },
        { status: 500 }
      );
    }

    const review = questions.map((q, index) => {
    const qOptions = options
      .filter((opt) => opt.question_id === q.id)
      .sort((a, b) => (a.option_order ?? 999) - (b.option_order ?? 999));

    const userAnswerObj = answers.find((a) => a.question_id === q.id);
    const selectedIndex = Number(userAnswerObj?.selected_option_index);

    return {
      number: index + 1,
      text: q.question_text,
      answers: qOptions.map((opt, idx) => ({
        label: String.fromCharCode(65 + idx),
        text: opt.option_text,
      })),
      correctAnswer: qOptions[q.correct_answer_index]?.option_text || "N/A",
      userAnswer: qOptions[selectedIndex]?.option_text || "Not answered",
      explanation: q.explanation || "No explanation provided.",
    };
  });


    return NextResponse.json({ questions: review, ...attempt });
  } catch (err) {
    console.error("Review error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}
