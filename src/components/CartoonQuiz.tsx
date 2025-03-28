"use client";

import { useState } from "react";
import Image from "next/image";

// Quiz questions (50 in total)
const QUIZ_QUESTIONS = [
  { question: "What is 5 + 3?", options: ["6", "8", "9", "7"], answer: "8" },
  { question: "Which planet is closest to the sun?", options: ["Earth", "Mars", "Mercury", "Venus"], answer: "Mercury" },
  { question: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Rome"], answer: "Paris" },
  { question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Hemingway", "Tolkien", "Dickens"], answer: "Shakespeare" },
  { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
  { question: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "NaCl"], answer: "H2O" },
  { question: "Which is the longest river?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: "Nile" },
  { question: "How many legs does a spider have?", options: ["6", "8", "10", "12"], answer: "8" },
  { question: "Which gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
  { question: "What is 12 × 12?", options: ["120", "144", "132", "156"], answer: "144" },
  { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Silver"], answer: "Diamond" },
  { question: "How many players are on a football team?", options: ["9", "10", "11", "12"], answer: "11" },
  { question: "Which country is famous for the Great Wall?", options: ["Japan", "China", "India", "Korea"], answer: "China" },
  { question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer: "2" },
  { question: "How many wings does a butterfly have?", options: ["2", "4", "6", "8"], answer: "4" },
  { question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"], answer: "Leonardo da Vinci" },
  { question: "Which is the largest mammal?", options: ["Elephant", "Blue Whale", "Shark", "Giraffe"], answer: "Blue Whale" },
  { question: "Which gas do we breathe in the most?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], answer: "Nitrogen" },
  { question: "How many colors are in a rainbow?", options: ["5", "6", "7", "8"], answer: "7" },
  { question: "Which month has 28 days?", options: ["January", "February", "All of them", "December"], answer: "All of them" },
  { question: "Which part of the plant makes food?", options: ["Roots", "Stem", "Leaves", "Flowers"], answer: "Leaves" },
  { question: "What is the fastest land animal?", options: ["Cheetah", "Horse", "Lion", "Kangaroo"], answer: "Cheetah" },
  { question: "What is the largest planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Jupiter" },
  { question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], answer: "100°C" },
  { question: "What does a caterpillar turn into?", options: ["Bee", "Spider", "Butterfly", "Ant"], answer: "Butterfly" },
  { question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: "Pacific" },
  { question: "How many hours are in a day?", options: ["12", "24", "36", "48"], answer: "24" },
  { question: "Which country is home to the kangaroo?", options: ["USA", "Australia", "Canada", "India"], answer: "Australia" },
  { question: "Which animal is known as the 'King of the Jungle'?", options: ["Tiger", "Lion", "Elephant", "Gorilla"], answer: "Lion" },
  { question: "Which shape has four equal sides?", options: ["Rectangle", "Triangle", "Circle", "Square"], answer: "Square" },
  { question: "Which sport is played at Wimbledon?", options: ["Soccer", "Tennis", "Cricket", "Basketball"], answer: "Tennis" },
  { question: "How many seconds are in a minute?", options: ["30", "45", "60", "90"], answer: "60" },
  { question: "Which fruit is known as the 'King of Fruits'?", options: ["Apple", "Mango", "Banana", "Orange"], answer: "Mango" },
  { question: "Which bird is a symbol of peace?", options: ["Eagle", "Pigeon", "Dove", "Owl"], answer: "Dove" },
];

export default function CartoonQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [characterExpression, setCharacterExpression] = useState("/cartoon_idle.gif");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const handleAnswerClick = (selected: string) => {
    setSelectedOption(selected);

    if (selected === QUIZ_QUESTIONS[currentQuestion].answer) {
      setFeedback("Nice one there, pal! 🎉");
      setCharacterExpression("/cartoon_happy.gif");

      setTimeout(() => {
        if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setFeedback(null);
          setCharacterExpression("/cartoon_idle.gif");
          setSelectedOption(null);
          setShowCorrectAnswer(false);
        } else {
          setFeedback("You've completed the quiz! 🎉");
        }
      }, 1500);
    } else {
      setFeedback("Keep trying, don't stop! 😅");
      setCharacterExpression("/cartoon_sad.gif");
    }
  };

  const handleIDontKnow = () => {
    setShowCorrectAnswer(true);
    setFeedback("The correct answer is highlighted.");

    // Automatically move to the next question after 3 seconds
    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setFeedback(null);
        setCharacterExpression("/cartoon_idle.gif");
        setSelectedOption(null);
        setShowCorrectAnswer(false);
      } else {
        setFeedback("You've completed the quiz! 🎉");
      }
    }, 3000); // 3 seconds delay before moving to the next question
  };

  return (
    <div className="flex flex-col items-center text-center p-6">
      {/* Progress Bar */}
      <div className="w-80 h-3 bg-gray-300 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        ></div>
      </div>

      {/* Cartoon Character */}
      <div className="relative w-48 h-48">
        <Image src={characterExpression} alt="Cartoon Character" width={200} height={200} priority unoptimized />
      </div>

      {/* Quiz Board */}
      <div className="bg-white border-4 border-black rounded-lg p-4 shadow-lg w-80 mt-2">
        <h2 className="text-xl font-bold text-black">{QUIZ_QUESTIONS[currentQuestion].question}</h2>
      </div>

      {/* Answer Choices */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`p-3 rounded-lg transition font-semibold 
              ${showCorrectAnswer && option === QUIZ_QUESTIONS[currentQuestion].answer ? "bg-green-500 text-white" :
              selectedOption === option ? "bg-red-500 text-white" : "bg-blue-500 text-white hover:bg-blue-700"}`}
            onClick={() => handleAnswerClick(option)}
            disabled={showCorrectAnswer}
          >
            {option}
          </button>
        ))}
      </div>

      {/* "I Don't Know" Option */}
      <button
        className="bg-gray-600 text-white p-3 rounded-lg mt-4 hover:bg-gray-800 transition"
        onClick={handleIDontKnow}
      >
        I Don't Know
      </button>

      {/* Feedback */}
      {feedback && <p className="mt-4 text-lg font-semibold text-white">{feedback}</p>}
    </div>
  );
}