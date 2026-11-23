"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Brain, Check, RotateCcw, Sparkles, Puzzle as PuzzleIcon } from "lucide-react";

const GALLERY_IMAGES = [
  "/images/gallery/science-lab.jpg",
  "/images/gallery/art.jpg",
  "/images/gallery/sports.jpg",
  "/images/gallery/library.jpg",
  "/images/gallery/music.jpg",
  "/images/gallery/classroom.jpg",
];

const QUESTIONS = [
  { question: "What is 5 + 3?", options: ["6", "8", "9", "7"], answer: "8" },
  { question: "Which planet is closest to the sun?", options: ["Earth", "Mars", "Mercury", "Venus"], answer: "Mercury" },
  { question: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Rome"], answer: "Paris" },
  { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
  { question: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "NaCl"], answer: "H2O" },
  { question: "Which is the longest river?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: "Nile" },
  { question: "How many legs does a spider have?", options: ["6", "8", "10", "12"], answer: "8" },
  { question: "Which part of the plant makes food?", options: ["Roots", "Stem", "Leaves", "Flowers"], answer: "Leaves" },
];

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function MemoryGame() {
  const cards = useMemo(() => shuffle([...GALLERY_IMAGES, ...GALLERY_IMAGES]), []);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [status, setStatus] = useState("Choose two cards to find a matching pair.");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const selectCard = (index: number) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) return;
    const next = [...flipped, index];
    setFlipped(next);

    if (next.length !== 2) return;
    const [first, second] = next;

    if (cards[first] === cards[second]) {
      const done = [...matched, first, second];
      setMatched(done);
      setFlipped([]);
      setStatus(done.length === cards.length ? "Perfect! Every pair has been found." : "Well done — those cards match.");
      return;
    }

    setStatus("Not a match. Try another pair.");
    timer.current = setTimeout(() => {
      setFlipped([]);
      setStatus("Choose two cards to find a matching pair.");
    }, 900);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setFlipped([]);
    setMatched([]);
    setStatus("New round. Choose two cards to find a matching pair.");
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {cards.map((src, index) => {
          const isOpen = flipped.includes(index) || matched.includes(index);
          return (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => selectCard(index)}
              aria-label={`Card ${index + 1}${isOpen ? ", revealed" : ", hidden"}`}
              aria-pressed={isOpen}
              className={`relative aspect-square overflow-hidden rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                matched.includes(index)
                  ? "border-brand-gold"
                  : isOpen
                    ? "border-brand-indigo"
                    : "border-brand-line bg-brand-ink"
              }`}
            >
              {isOpen ? (
                <Image src={src} alt="" fill sizes="(max-width: 640px) 30vw, 160px" className="object-cover" />
              ) : (
                <Brain className="absolute inset-0 m-auto h-7 w-7 text-brand-gold/70" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-4 min-h-6 text-sm text-brand-ink/65" role="status" aria-live="polite">{status}</p>
      <button type="button" onClick={reset} className="gfa-btn gfa-btn-secondary mt-2">
        <RotateCcw aria-hidden="true" className="h-4 w-4" />
        Start over
      </button>
    </div>
  );
}

function SlidingPuzzle() {
  const image = useMemo(() => shuffle(GALLERY_IMAGES)[0], []);
  const solvedOrder = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  const [tiles, setTiles] = useState<number[]>(() => shuffle(solvedOrder));
  const solved = tiles.join() === solvedOrder.join();
  const emptyIndex = tiles.indexOf(0);

  const moveTile = (index: number) => {
    const row = Math.floor(index / 3);
    const column = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyColumn = emptyIndex % 3;
    const isAdjacent = (Math.abs(row - emptyRow) === 1 && column === emptyColumn) ||
      (Math.abs(column - emptyColumn) === 1 && row === emptyRow);
    if (!isAdjacent || solved) return;
    const next = [...tiles];
    [next[index], next[emptyIndex]] = [next[emptyIndex], next[index]];
    setTiles(next);
  };

  return (
    <div>
      <div className="mx-auto grid aspect-square w-full max-w-xs grid-cols-3 gap-1 rounded-2xl border border-brand-line bg-brand-mist p-1">
        {tiles.map((tile, index) => {
          if (tile === 0) return <div key={`empty-${index}`} className="rounded-lg bg-white/50" aria-hidden="true" />;
          const row = Math.floor(index / 3);
          const column = index % 3;
          const emptyRow = Math.floor(emptyIndex / 3);
          const emptyColumn = emptyIndex % 3;
          const canMove = (Math.abs(row - emptyRow) === 1 && column === emptyColumn) ||
            (Math.abs(column - emptyColumn) === 1 && row === emptyRow);
          return (
            <button
              key={tile}
              type="button"
              onClick={() => moveTile(index)}
              disabled={!canMove || solved}
              aria-label={`Move tile ${tile}`}
              className="rounded-lg border border-white/60 bg-brand-ink/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:cursor-not-allowed disabled:opacity-90"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "300% 300%",
                backgroundPosition: `${((tile - 1) % 3) * 50}% ${Math.floor((tile - 1) / 3) * 50}%`,
              }}
            />
          );
        })}
      </div>
      <p className="mt-4 min-h-6 text-sm text-brand-ink/65" role="status" aria-live="polite">
        {solved ? "Beautifully done — the picture is complete." : "Move a tile next to the empty space to rearrange the picture."}
      </p>
      <button
        type="button"
        onClick={() => { setTiles(shuffle(solvedOrder)); }}
        className="gfa-btn gfa-btn-secondary mt-2"
      >
        <RotateCcw aria-hidden="true" className="h-4 w-4" />
        Shuffle again
      </button>
    </div>
  );
}

function QuickQuiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const question = QUESTIONS[index];
  const correct = selected === question.answer;
  const expression = selected === null ? "/cartoon_idle.gif" : correct ? "/cartoon_happy.gif" : "/cartoon_sad.gif";

  const next = () => {
    if (index === QUESTIONS.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start">
      <div className="mx-auto w-32 overflow-hidden rounded-2xl border border-brand-line bg-white">
        <Image src={expression} alt="" width={128} height={128} unoptimized className="h-32 w-32 object-cover" />
      </div>
      <div>
        <p className="gfa-eyebrow mb-2">Question {index + 1} of {QUESTIONS.length}</p>
        <p className="mb-4 text-lg font-semibold text-brand-ink">{question.question}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {question.options.map((option) => {
            const isAnswer = revealed && option === question.answer;
            const isSelected = selected === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => { if (!selected) setSelected(option); }}
                aria-pressed={isSelected}
                disabled={selected !== null}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                  isAnswer
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : isSelected
                      ? "border-rose-400 bg-rose-50 text-rose-800"
                      : "border-brand-line bg-white text-brand-ink hover:border-brand-indigo"
                }`}
              >
                {option}
                {isAnswer && <Check aria-hidden="true" className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
        <p className="mt-4 min-h-6 text-sm text-brand-ink/70" role="status" aria-live="polite">
          {selected === null
            ? "Choose an answer to see how you did."
            : correct
              ? "Correct — nicely done!"
              : revealed
                ? `The correct answer is ${question.answer}.`
                : "Not quite. Reveal the answer or move on."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {selected !== null && !correct && (
            <button type="button" onClick={() => setRevealed(true)} disabled={revealed} className="gfa-btn gfa-btn-secondary">
              Show answer
            </button>
          )}
          <button type="button" onClick={next} disabled={selected === null && !revealed} className="gfa-btn gfa-btn-primary">
            {index === QUESTIONS.length - 1 ? "Start again" : "Next question"}
          </button>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: "memory", label: "Memory match", icon: Brain },
  { id: "puzzle", label: "Picture puzzle", icon: PuzzleIcon },
  { id: "quiz", label: "Quick quiz", icon: Sparkles },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function PlayZone() {
  const [active, setActive] = useState<TabId>("memory");

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + offset + TABS.length) % TABS.length;
    setActive(TABS[nextIndex].id);
    document.getElementById(`play-tab-${TABS[nextIndex].id}`)?.focus();
  };

  return (
    <div className="gfa-card overflow-hidden">
      <div className="flex flex-col gap-1 border-b border-brand-line bg-brand-mist px-3 py-2 sm:flex-row sm:gap-2 sm:px-4">
        {TABS.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              id={`play-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`play-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive ? "bg-brand-ink text-white shadow-sm" : "text-brand-ink/65 hover:bg-white"
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="p-4 sm:p-6 lg:p-8" role="tabpanel" id={`play-panel-${active}`} aria-labelledby={`play-tab-${active}`}>
        {active === "memory" && <MemoryGame />}
        {active === "puzzle" && <SlidingPuzzle />}
        {active === "quiz" && <QuickQuiz />}
      </div>
    </div>
  );
}
