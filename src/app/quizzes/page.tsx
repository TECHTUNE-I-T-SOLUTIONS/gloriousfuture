"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, CircleAlert, LoaderCircle, SearchX, SlidersHorizontal, Sparkles, Trophy } from "lucide-react";

import CustomHeader from "@/components/CustomHeader";
import CustomFooter from "@/components/CustomFooter";
import PageHero from "@/components/public/PageHero";
import SectionHeading from "@/components/public/SectionHeading";
import QuizCard from "@/components/quizzes/QuizCard";

const difficultyOptions = ["all", "easy", "medium", "hard"] as const;
const ageOptions = ["all", "6-8", "8-10", "10-12", "12-14"] as const;

function filterChipClass(active: boolean) {
  return `gfa-chip min-h-[2.5rem] px-4 py-2 text-sm transition-colors ${
    active
      ? "!border-brand-indigo !bg-brand-indigo !text-white"
      : "hover:!border-brand-indigo hover:!bg-brand-mist"
  }`;
}

export default function PublicQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("all");

  useEffect(() => {
    let mounted = true;
    const fetchList = async () => {
      try {
        const res = await fetch("/api/public/quizzes");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (mounted) {
          setQuizzes(data || []);
          setError("");
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("We could not load the quizzes. Please refresh the page and try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchList();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const difficultyMatch = selectedDifficulty === "all" || q.difficulty_level === selectedDifficulty;
      const ageMatch = selectedAgeGroup === "all" || q.age_group === selectedAgeGroup;
      return difficultyMatch && ageMatch;
    });
  }, [quizzes, selectedDifficulty, selectedAgeGroup]);

  const clearFilters = () => {
    setSelectedDifficulty("all");
    setSelectedAgeGroup("all");
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface">
      <CustomHeader />

      <main className="flex-1">
        <PageHero
          kicker="Practice room"
          title="Practice quizzes"
          description="Short, focused quizzes with immediate feedback, built to help pupils check their understanding across the curriculum."
          icon={Trophy}
        >
          <span className="gfa-chip">
            <Sparkles className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            Learn by doing
          </span>
        </PageHero>

        <section className="gfa-section" aria-labelledby="quiz-list-heading">
          <div className="gfa-container">
            <div id="quiz-list-heading">
              <SectionHeading
                title="Choose your challenge"
                description="Filter by difficulty and age group to find the right practice for you."
              />
            </div>

            <section
              aria-labelledby="filters-heading"
              className="gfa-card mb-8 p-5 sm:mb-10 sm:p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3
                  id="filters-heading"
                  className="flex items-center gap-2 font-display text-xl text-brand-ink"
                >
                  <SlidersHorizontal className="h-5 w-5 text-brand-gold" aria-hidden="true" />
                  Filter quizzes
                </h3>
                <p role="status" aria-live="polite" className="gfa-chip">
                  Showing {filteredQuizzes.length} of {quizzes.length} quizzes
                </p>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <fieldset>
                  <legend className="gfa-label">Difficulty level</legend>
                  <div className="flex flex-wrap gap-2">
                    {difficultyOptions.map((level) => {
                      const active = selectedDifficulty === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSelectedDifficulty(level)}
                          className={filterChipClass(active)}
                        >
                          {active && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                          {level === "all" ? "All levels" : level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="gfa-label">Age group</legend>
                  <div className="flex flex-wrap gap-2">
                    {ageOptions.map((age) => {
                      const active = selectedAgeGroup === age;
                      return (
                        <button
                          key={age}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSelectedAgeGroup(age)}
                          className={filterChipClass(active)}
                        >
                          {active && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                          {age === "all" ? "All ages" : `${age} yrs`}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            </section>

            {loading ? (
              <div role="status" aria-live="polite" className="space-y-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-ink/70">
                  <LoaderCircle className="h-4 w-4 animate-spin text-brand-indigo" aria-hidden="true" />
                  Loading quizzes…
                </p>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="gfa-card h-80 animate-pulse overflow-hidden">
                      <div className="h-40 bg-brand-mist" />
                      <div className="space-y-3 p-6">
                        <div className="h-5 w-4/5 rounded bg-brand-mist" />
                        <div className="h-3 w-full rounded bg-brand-mist" />
                        <div className="h-3 w-2/3 rounded bg-brand-mist" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div
                role="alert"
                className="gfa-card mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-14 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <CircleAlert className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="font-display text-2xl text-brand-ink">Quizzes are unavailable</h3>
                <p className="max-w-md text-sm leading-relaxed text-brand-ink/70">{error}</p>
              </div>
            ) : filteredQuizzes.length === 0 ? (
              <div
                role="status"
                aria-live="polite"
                className="gfa-card mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-mist text-brand-indigo">
                  <SearchX className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="font-display text-2xl text-brand-ink">
                  {quizzes.length > 0 ? "No quizzes match these filters" : "No quizzes available yet"}
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-brand-ink/70">
                  {quizzes.length > 0
                    ? "Try a different difficulty or age group to see more practice questions."
                    : "New quizzes are being prepared. Please check back soon."}
                </p>
                <button type="button" onClick={clearFilters} className="gfa-btn gfa-btn-primary mt-2">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredQuizzes.map((q) => (
                  <div
                    key={q.id}
                    className="gfa-card h-full overflow-hidden transition-transform duration-200 hover:-translate-y-1"
                  >
                    <QuizCard quiz={q} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {!loading && quizzes.length > 0 && (
          <section className="gfa-container pb-16 sm:pb-24" aria-label="Quiz library">
            <div className="relative overflow-hidden rounded-[1.25rem] bg-brand-ink px-6 py-10 text-white sm:px-10">
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                  <p className="gfa-eyebrow !text-brand-gold">Keep going</p>
                  <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
                    Challenge yourself today
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                    Pick a quiz, answer the questions and track your progress towards mastery.
                  </p>
                </div>
                <div className="inline-flex shrink-0 items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-5 py-4">
                  <Trophy className="h-8 w-8 text-brand-gold" aria-hidden="true" />
                  <span>
                    <span className="block text-2xl font-semibold">{quizzes.length}</span>
                    <span className="block text-xs text-white/65">Quizzes available</span>
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <CustomFooter />
    </div>
  );
}
