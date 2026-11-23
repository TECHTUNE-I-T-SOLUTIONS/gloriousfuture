"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
 ArrowLeft,
 ArrowRight,
 Check,
 CheckCircle2,
 Clock3,
 RotateCcw,
 Sparkles,
 Target,
 Trophy,
 Volume2,
 VolumeX,
 X,
 XCircle,
} from "lucide-react";
import CustomFooter from "@/components/CustomFooter";
import CustomHeader from "@/components/CustomHeader";

type Option = { id: string; option_text: string; is_correct?: boolean; order_index?: number };
type Question = { id: string; question_text: string; order_index: number; time_limit_seconds?: number; options: Option[] };

type QuizPlayerProps = { quizId: string };

export default function QuizPlayer({ quizId }: QuizPlayerProps) {
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [quiz, setQuiz] = useState<any | null>(null);
 const [questions, setQuestions] = useState<Question[]>([]);
 const [index, setIndex] = useState(0);
 const [timeLeft, setTimeLeft] = useState(0);
 const [selectedOption, setSelectedOption] = useState<string | null>(null);
 const [showAnswer, setShowAnswer] = useState(false);
 const [score, setScore] = useState(0);
 const [finished, setFinished] = useState(false);
 const [started, setStarted] = useState(false);
 const [soundEnabled, setSoundEnabled] = useState(true);

 const correctAudio = useRef<HTMLAudioElement | null>(null);
 const wrongAudio = useRef<HTMLAudioElement | null>(null);
 const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

 useEffect(() => {
  correctAudio.current = new Audio("/correct.mp3");
  wrongAudio.current = new Audio("/wrong.mp3");
  correctAudio.current.load();
  wrongAudio.current.load();
  return () => {
   if (advanceTimer.current) clearTimeout(advanceTimer.current);
  };
 }, []);

 useEffect(() => {
  const fetchQuiz = async () => {
   setLoading(true);
   setError(null);
   try {
    if (!quizId) throw new Error("Quiz ID not provided");
    const res = await fetch(`/api/public/quizzes/${quizId}`);
    if (!res.ok) throw new Error("Quiz not found or not available");
    const data = await res.json();
    if (!data.quiz || !data.questions) throw new Error("Invalid quiz data");
    setQuiz(data.quiz);
    setQuestions(data.questions || []);
    setIndex(0);
   } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load quiz");
   } finally {
    setLoading(false);
   }
  };
  if (quizId) void fetchQuiz();
 }, [quizId]);

 useEffect(() => {
  if (questions.length === 0) return;
  const q = questions[index];
  setTimeLeft(q?.time_limit_seconds ?? quiz?.time_per_question ?? 20);
  setSelectedOption(null);
  setShowAnswer(false);
 }, [index, questions, quiz]);

 const playSound = (which: "correct" | "wrong") => {
  if (!soundEnabled) return;
  const audio = which === "correct" ? correctAudio.current : wrongAudio.current;
  void audio?.play().catch(() => {});
 };

 const nextQuestion = () => {
  if (index + 1 >= questions.length) {
   setFinished(true);
   return;
  }
  setIndex((current) => current + 1);
 };

 const handleTimeout = () => {
  if (showAnswer) return;
  setShowAnswer(true);
  playSound("wrong");
  advanceTimer.current = setTimeout(nextQuestion, 1600);
 };

 useEffect(() => {
  if (finished || questions.length === 0 || showAnswer || !started) return;
  const timer = setInterval(() => {
   setTimeLeft((current) => {
    if (current <= 1) {
     clearInterval(timer);
     handleTimeout();
     return 0;
    }
    return current - 1;
   });
  }, 1000);
  return () => clearInterval(timer);
 }, [questions, index, showAnswer, finished, started]);

 const choose = (optionId: string) => {
  if (showAnswer) return;
  setSelectedOption(optionId);
  setShowAnswer(true);
  const question = questions[index];
  const option = question?.options.find((item) => item.id === optionId);
  if (option?.is_correct) {
   setScore((current) => current + 1);
   playSound("correct");
  } else {
   playSound("wrong");
  }
  advanceTimer.current = setTimeout(nextQuestion, 1400);
 };

 const restart = () => {
  if (advanceTimer.current) clearTimeout(advanceTimer.current);
  setStarted(false);
  setIndex(0);
  setScore(0);
  setFinished(false);
  setSelectedOption(null);
  setShowAnswer(false);
 };

 const question = questions[index];
 const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;
 const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
 const letter = (position: number) => String.fromCharCode(65 + position);
 const resultTitle = percentage === 100 ? "A perfect score" : percentage >= 80 ? "Excellent work" : percentage >= 60 ? "Well done" : "Keep practising";

 const shell = (children: React.ReactNode) => (
  <div className="min-h-screen bg-brand-surface text-brand-ink">
   <CustomHeader />
   <main className="pt-32 pb-16 sm:pt-40">
    <div className="gfa-container">{children}</div>
   </main>
   <CustomFooter />
  </div>
 );

 if (loading) {
  return shell(
   <div className="gfa-card mx-auto max-w-xl p-10 text-center">
    <div className="mx-auto mb-5 flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-brand-ink text-brand-gold">
     <Target aria-hidden="true" className="h-6 w-6" />
    </div>
    <h1 className="font-display text-2xl font-semibold">Preparing your quiz…</h1>
    <p className="mt-2 text-sm text-brand-ink/60">Loading questions and settings.</p>
   </div>
  );
 }

 if (error || !quiz) {
  return shell(
   <div className="gfa-card mx-auto max-w-xl p-8 text-center sm:p-10">
    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
     <XCircle aria-hidden="true" className="h-6 w-6" />
    </div>
    <h1 className="font-display text-2xl font-semibold">Quiz unavailable</h1>
    <p className="mt-3 text-sm text-brand-ink/65">{error || "This quiz may have been removed or is not available."}</p>
    <Link href="/quizzes" className="gfa-btn gfa-btn-primary mt-7">
     <ArrowLeft aria-hidden="true" className="h-4 w-4" />
     Back to quizzes
    </Link>
   </div>
  );
 }

 if (!started) {
  return shell(
   <div className="mx-auto max-w-3xl">
    <Link href="/quizzes" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-ink/65 hover:text-brand-indigo">
     <ArrowLeft aria-hidden="true" className="h-4 w-4" />
     Back to quizzes
    </Link>
    <div className="gfa-card overflow-hidden">
     {quiz.thumbnail_url && (
      <div className="relative aspect-[16/7] w-full bg-brand-mist">
       <Image src={quiz.thumbnail_url} alt="" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
      </div>
     )}
     <div className="p-6 text-center sm:p-10">
      <p className="gfa-eyebrow mb-4 justify-center">
       <Sparkles aria-hidden="true" className="h-4 w-4" />
       Ready when you are
      </p>
      <h1 className="gfa-display text-3xl sm:text-4xl">{quiz.title}</h1>
      {quiz.description && <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-ink/65">{quiz.description}</p>}
      <dl className="mx-auto mt-8 flex max-w-md justify-center gap-8 border-y border-brand-line py-5">
       <div>
        <dt className="text-xs uppercase tracking-wide text-brand-ink/50">Questions</dt>
        <dd className="mt-1 font-display text-2xl font-semibold text-brand-indigo">{questions.length}</dd>
       </div>
       <div>
        <dt className="text-xs uppercase tracking-wide text-brand-ink/50">Per question</dt>
        <dd className="mt-1 font-display text-2xl font-semibold text-brand-indigo">{quiz.time_per_question ?? 20}s</dd>
       </div>
      </dl>
      <button
       type="button"
       onClick={() => setStarted(true)}
       disabled={questions.length === 0}
       className="gfa-btn gfa-btn-primary mt-8 px-8 py-3"
      >
       Let&apos;s begin
       <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
      {questions.length === 0 && <p className="mt-4 text-sm text-brand-ink/60">No questions are available for this quiz yet.</p>}
     </div>
    </div>
   </div>
  );
 }

 if (finished) {
  return shell(
   <div className="gfa-card mx-auto max-w-2xl p-8 text-center sm:p-12">
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-ink text-brand-gold">
     <Trophy aria-hidden="true" className="h-7 w-7" />
    </div>
    <p className="gfa-eyebrow mb-3 justify-center">Quiz complete</p>
    <h1 className="font-display text-3xl font-semibold sm:text-4xl">{resultTitle}</h1>
    <p className="mt-8 text-sm text-brand-ink/55">Your score</p>
    <p className="mt-1 font-display text-5xl font-semibold text-brand-indigo">
     {score} <span className="text-2xl text-brand-ink/45">/ {questions.length}</span>
    </p>
    <div className="mx-auto mt-6 h-2 w-full max-w-sm overflow-hidden rounded-full bg-brand-mist">
     <div className="h-full rounded-full bg-brand-indigo transition-all" style={{ width: `${percentage}%` }} />
    </div>
    <p className="mt-3 text-sm font-semibold text-brand-ink/65">{percentage}% accuracy</p>
    <div className="mt-9 flex flex-wrap justify-center gap-3">
     <button type="button" onClick={restart} className="gfa-btn gfa-btn-primary">
      <RotateCcw aria-hidden="true" className="h-4 w-4" />
      Try again
     </button>
     <Link href="/quizzes" className="gfa-btn gfa-btn-secondary">
      More quizzes
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
     </Link>
    </div>
   </div>
  );
 }

 return shell(
  <div>
   <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
     <p className="gfa-eyebrow mb-1">{quiz.title}</p>
     <h1 className="font-display text-2xl font-semibold sm:text-3xl">Question {index + 1} of {questions.length}</h1>
    </div>
    <div className="flex items-center gap-2">
     <button
      type="button"
      onClick={() => setSoundEnabled(!soundEnabled)}
      aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
      aria-pressed={soundEnabled}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-line bg-white text-brand-ink hover:border-brand-indigo"
     >
      {soundEnabled ? <Volume2 aria-hidden="true" className="h-5 w-5" /> : <VolumeX aria-hidden="true" className="h-5 w-5" />}
     </button>
     <span className="inline-flex items-center gap-2 rounded-xl border border-brand-line bg-white px-4 py-2.5 text-sm font-semibold">
      <Trophy aria-hidden="true" className="h-4 w-4 text-brand-gold" />
      {score}
     </span>
    </div>
   </div>

   <div className="mb-6 flex items-center gap-4">
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-mist">
     <div className="h-full rounded-full bg-brand-indigo transition-all" style={{ width: `${progress}%` }} />
    </div>
    <div
      className={`inline-flex min-w-16 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${
       timeLeft <= 5 ? "bg-rose-100 text-rose-700" : "bg-brand-mist text-brand-indigo"
      }`}
      aria-live="off"
    >
     <Clock3 aria-hidden="true" className="h-4 w-4" />
     {timeLeft}s
    </div>
   </div>

   <div className="gfa-card p-5 sm:p-8">
    <h2 className="font-display text-xl font-semibold leading-snug sm:text-2xl">{question?.question_text}</h2>
    <div className="mt-6 grid gap-3">
     {question?.options.map((option, position) => {
      const isCorrect = showAnswer && option.is_correct;
      const isWrongPick = showAnswer && selectedOption === option.id && !option.is_correct;
      return (
       <button
        key={option.id}
        type="button"
        onClick={() => choose(option.id)}
        disabled={showAnswer}
        aria-pressed={selectedOption === option.id}
        className={`flex items-center gap-4 rounded-xl border px-4 py-4 text-left text-sm font-medium transition ${
         isCorrect
          ? "border-emerald-500 bg-emerald-50 text-emerald-900"
          : isWrongPick
            ? "border-rose-400 bg-rose-50 text-rose-900"
            : "border-brand-line bg-white text-brand-ink hover:border-brand-indigo"
        }`}
       >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isCorrect ? "bg-emerald-600 text-white" : isWrongPick ? "bg-rose-500 text-white" : "bg-brand-mist text-brand-indigo"}`}>
         {isCorrect ? <Check aria-hidden="true" className="h-4 w-4" /> : isWrongPick ? <X aria-hidden="true" className="h-4 w-4" /> : letter(position)}
        </span>
        {option.option_text}
       </button>
      );
     })}
    </div>
    <p className="mt-5 min-h-6 text-sm text-brand-ink/65" role="status" aria-live="polite">
     {showAnswer
      ? selectedOption && question?.options.find((item) => item.id === selectedOption)?.is_correct
       ? "Correct. Moving to the next question shortly."
       : "Answer revealed. Moving to the next question shortly."
      : "Select an answer before the timer runs out."}
    </p>
   </div>
  </div>
 );
}
