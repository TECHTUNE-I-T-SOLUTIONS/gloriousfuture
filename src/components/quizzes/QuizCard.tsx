"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CircleDot } from "lucide-react";

type QuizCardProps = {
  quiz: any;
};

function getDifficultyColor(level: string) {
  switch (level) {
    case "easy":
      return "border-emerald-300 bg-emerald-100 text-emerald-800";
    case "medium":
      return "border-amber-300 bg-amber-100 text-amber-800";
    case "hard":
      return "border-red-300 bg-red-100 text-red-800";
    default:
      return "border-brand-line bg-brand-mist text-brand-ink";
  }
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const title = typeof quiz?.title === "string" ? quiz.title : "Practice quiz";

  return (
    <Link
      href={`/quizzes/${quiz.id}`}
      aria-label={`Open quiz: ${title}`}
      className="group block h-full rounded-[1.25rem] focus-visible:outline-offset-4"
    >
      <article className="flex h-full min-w-0 flex-col">
        <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-300 to-indigo-600">
          <Image
            src={quiz.thumbnail_url || "/logo.png"}
            alt={quiz.title}
            width={400}
            height={200}
            className="object-cover w-full h-full transform transition duration-500 group-hover:scale-110 brightness-90"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-2">
            {quiz.difficulty_level && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold backdrop-blur-sm ${getDifficultyColor(
                  quiz.difficulty_level
                )}`}
              >
                <CircleDot className="h-3 w-3" aria-hidden="true" />
                {quiz.difficulty_level.charAt(0).toUpperCase() + quiz.difficulty_level.slice(1)}
              </span>
            )}
            {quiz.age_group && quiz.age_group !== "all" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-ink backdrop-blur-sm">
                <BookOpen className="h-3 w-3" aria-hidden="true" />
                {quiz.age_group}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-lg font-bold text-brand-ink transition-colors group-hover:text-brand-indigo">
              {title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-ink/70">
              {quiz.description || "Challenge yourself with this quiz"}
            </p>
            {quiz.subject_area && (
              <p className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-brand-mist px-2 py-1 text-xs font-semibold text-brand-indigo">
                <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{quiz.subject_area}</span>
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-brand-line pt-4 text-xs font-semibold text-brand-ink/70">
            <span className="inline-flex items-center gap-1.5">
              <CircleDot className="h-3.5 w-3.5 text-brand-gold" aria-hidden="true" />
              {quiz.total_questions || 0} questions
            </span>
            <ArrowRight
              className="h-5 w-5 shrink-0 text-brand-indigo transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
