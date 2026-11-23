"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

const QUESTIONS = [
 { question: "What is 5 + 3?", options: ["6", "8", "9", "7"], answer: "8" },
 { question: "Which planet is closest to the sun?", options: ["Earth", "Mars", "Mercury", "Venus"], answer: "Mercury" },
 { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
 { question: "Which is the largest mammal?", options: ["Elephant", "Blue Whale", "Shark", "Giraffe"], answer: "Blue Whale" },
 { question: "Which gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
];

export default function CartoonQuiz() {
 const [currentQuestion, setCurrentQuestion] = useState(0);
 const [selected, setSelected] = useState<string | null>(null);
 const [revealed, setRevealed] = useState(false);
 const question = QUESTIONS[currentQuestion];
 const correct = selected === question.answer;

 const next = () => {
  setCurrentQuestion((index) => (index + 1) % QUESTIONS.length);
  setSelected(null);
  setRevealed(false);
 };

 return (
  <div className="gfa-card p-5 sm:p-8">
   <p className="gfa-eyebrow mb-3">Question {currentQuestion + 1} of {QUESTIONS.length}</p>
   <div className="grid gap-5 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-start">
    <Image
     src={selected === null ? "/cartoon_idle.gif" : correct ? "/cartoon_happy.gif" : "/cartoon_sad.gif"}
     alt=""
     width={120}
     height={120}
     unoptimized
     className="mx-auto w-28 rounded-2xl"
    />
    <div>
     <h2 className="text-lg font-semibold text-brand-ink">{question.question}</h2>
     <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {question.options.map((option) => (
       <button
        key={option}
        type="button"
        onClick={() => { if (!selected) setSelected(option); }}
        disabled={selected !== null}
        aria-pressed={selected === option}
        className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${
         revealed && option === question.answer
          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
          : selected === option
            ? "border-rose-400 bg-rose-50 text-rose-800"
            : "border-brand-line bg-white text-brand-ink hover:border-brand-indigo"
        }`}
       >
        {option}
       </button>
      ))}
     </div>
     <p className="mt-4 min-h-5 text-sm text-brand-ink/65" role="status" aria-live="polite">
      {selected === null ? "Choose an answer." : correct ? "Correct — nicely done!" : revealed ? `The answer is ${question.answer}.` : "Not quite."}
     </p>
     <div className="mt-3 flex flex-wrap gap-2">
      {selected !== null && !correct && (
       <button type="button" onClick={() => setRevealed(true)} disabled={revealed} className="gfa-btn gfa-btn-secondary">
        <RotateCcw aria-hidden="true" className="h-4 w-4" />
        Show answer
       </button>
      )}
      <button type="button" onClick={next} disabled={selected === null} className="gfa-btn gfa-btn-primary">
       Next question
       <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}
