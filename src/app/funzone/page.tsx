'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
 ArrowLeft,
 ArrowRight,
 BookOpen,
 Brain,
 Calculator,
 Check,
 Gamepad2,
 Gauge,
 GraduationCap,
 Hand,
 Home,
 KeyRound,
 Keyboard,
 Palette,
 PenLine,
 Play,
 Puzzle,
 RotateCcw,
 Search,
 Sparkles,
 Target,
 Trophy,
 Volume2,
 VolumeX,
 X,
 Zap,
 XCircle,
} from 'lucide-react'
import Link from 'next/link'
import CustomHeader from '@/components/CustomHeader'
import CustomFooter from '@/components/CustomFooter'

// Game 1: Memory Game
const MemoryGame = () => {
  const [cards, setCards] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    const shuffled = [...symbols, ...symbols].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setScore(0)
    setMoves(0)
  }

  const toggleFlip = (index: number) => {
    if (flipped.includes(index) || matched.includes(index)) return
    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)
    setMoves(moves + 1)

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped])
        setScore(score + 10)
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  return (
    <div className="text-center">
      <div className="flex justify-between mb-4 text-white">
        <div className="text-lg font-bold">Score: {score}</div>
        <div className="text-lg font-bold">Moves: {moves}</div>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card, index) => (
          <motion.button
            key={index}
            onClick={() => toggleFlip(index)}
            className={`w-16 h-16 rounded-lg font-bold text-2xl transition-all ${
              flipped.includes(index) || matched.includes(index)
                ? 'bg-yellow-400 text-indigo-900'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {flipped.includes(index) || matched.includes(index) ? card : '?'}
          </motion.button>
        ))}
      </div>
      {matched.length === cards.length && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold text-yellow-300 mb-4"
        >
          You won in {moves} moves!
        </motion.div>
      )}
      <motion.button
        onClick={initializeGame}
        className="px-6 py-2 bg-yellow-400 text-indigo-900 rounded-lg font-bold hover:bg-yellow-300"
        whileHover={{ scale: 1.05 }}
      >
        <RotateCcw className="inline mr-2 w-4 h-4" />
        New Game
      </motion.button>
    </div>
  )
}

// Game 2: Quick Math
const QuickMath = () => {
  const [num1, setNum1] = useState(Math.floor(Math.random() * 20) + 1)
  const [num2, setNum2] = useState(Math.floor(Math.random() * 20) + 1)
  const [operator, setOperator] = useState<'+' | '-' | '*'>(['+', '-', '*'][Math.floor(Math.random() * 3)] as '+' | '-' | '*')
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [streak, setStreak] = useState(0)

  const correctAnswer = operator === '+' ? num1 + num2 : operator === '-' ? num1 - num2 : num1 * num2

  const handleSubmit = () => {
    if (parseInt(answer) === correctAnswer) {
      setScore(score + 10)
      setStreak(streak + 1)
      setFeedback('Correct!')
      generateNewQuestion()
      setAnswer('')
    } else {
      setFeedback('Try again.')
      setStreak(0)
    }
  }

  const generateNewQuestion = () => {
    setNum1(Math.floor(Math.random() * 20) + 1)
    setNum2(Math.floor(Math.random() * 20) + 1)
    setOperator(['+', '-', '*'][Math.floor(Math.random() * 3)] as '+' | '-' | '*')
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-600 text-white p-4 rounded-lg">
          <div className="text-sm font-semibold opacity-75">Score</div>
          <div className="text-3xl font-bold">{score}</div>
        </div>
        <div className="bg-purple-600 text-white p-4 rounded-lg">
          <div className="text-sm font-semibold opacity-75">Streak</div>
          <div className="text-3xl font-bold">{streak}</div>
        </div>
      </div>

      <div className="text-5xl font-bold text-white mb-6 bg-indigo-700 p-6 rounded-lg">
        {num1} {operator} {num2} = ?
      </div>

      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Your answer"
        className="w-full px-4 py-3 mb-4 rounded-lg text-lg text-center"
      />

      <motion.button
        onClick={handleSubmit}
        className="w-full px-6 py-3 bg-yellow-400 text-indigo-900 rounded-lg font-bold hover:bg-yellow-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play className="inline mr-2 w-4 h-4" />
        Submit Answer
      </motion.button>

      {feedback && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold mt-4 text-white"
        >
          {feedback}
        </motion.div>
      )}
    </div>
  )
}

// Game 3: Color Match
const ColorMatch = () => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-400', 'bg-purple-500', 'bg-pink-500']
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [feedback, setFeedback] = useState('')

  const addToSequence = async () => {
    const newNum = Math.floor(Math.random() * 6)
    const newSequence = [...sequence, newNum]
    setSequence(newSequence)
    setPlayerSequence([])
    playSequence(newSequence)
  }

  const playSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      flashColor(seq[i])
    }
  }

  const flashColor = (index: number) => {
    const elements = document.querySelectorAll('.color-button')
    if (elements[index]) {
      elements[index].classList.add('scale-110')
      setTimeout(() => elements[index].classList.remove('scale-110'), 300)
    }
  }

  const handleColorClick = (index: number) => {
    if (!gameActive) return
    const newPlayerSeq = [...playerSequence, index]
    setPlayerSequence(newPlayerSeq)
    flashColor(index)

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setFeedback('Wrong. Game over.')
      setGameActive(false)
      return
    }

    if (newPlayerSeq.length === sequence.length) {
      setScore(score + 10)
      setFeedback('Correct! Next round...')
      setTimeout(() => addToSequence(), 1000)
    }
  }

  const startGame = () => {
    setSequence([])
    setPlayerSequence([])
    setScore(0)
    setGameActive(true)
    addToSequence()
  }

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-white mb-6">Score: {score}</div>

      <div className="grid grid-cols-3 gap-4 mb-8 max-w-xs mx-auto">
        {colors.map((color, index) => (
          <motion.button
            key={index}
            onClick={() => handleColorClick(index)}
            className={`color-button ${color} h-20 rounded-lg cursor-pointer transition-transform hover:scale-105`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!gameActive}
          />
        ))}
      </div>

      {feedback && (
        <motion.div className="text-xl font-bold text-white mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          {feedback}
        </motion.div>
      )}

      {!gameActive && (
        <motion.button
          onClick={startGame}
          className="px-6 py-3 bg-yellow-400 text-indigo-900 rounded-lg font-bold hover:bg-yellow-300"
          whileHover={{ scale: 1.05 }}
        >
          <Play className="inline mr-2 w-4 h-4" />
          {sequence.length === 0 ? 'Start Game' : 'Play Again'}
        </motion.button>
      )}
    </div>
  )
}

// Game 4: Word Scramble
const WordScramble = () => {
  const words = useMemo(() => ['INTELLIGENCE', 'EDUCATION', 'KNOWLEDGE', 'LEARNING', 'ACADEMY', 'FUTURE', 'SUCCESS', 'GENIUS'], [])
  const [word, setWord] = useState('')
  const [scrambled, setScrambled] = useState('')
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')

  const generateWord = useCallback(() => {
    const newWord = words[Math.floor(Math.random() * words.length)]
    setWord(newWord)
    const scrambledWord = newWord.split('').sort(() => Math.random() - 0.5).join('')
    setScrambled(scrambledWord)
    setAnswer('')
    setFeedback('')
  }, [words])

  useEffect(() => {
    generateWord()
  }, [generateWord])

  const handleSubmit = () => {
    if (answer.toUpperCase() === word) {
      setScore(score + 15)
      setFeedback('Correct!')
      setTimeout(generateWord, 1500)
    } else {
      setFeedback('Try again.')
    }
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="text-2xl font-bold text-white mb-6">Score: {score}</div>

      <div className="text-4xl font-bold text-yellow-300 mb-6 bg-indigo-700 p-6 rounded-lg tracking-wider">
        {scrambled}
      </div>

      <p className="text-white mb-4 text-sm opacity-75">Unscramble the letters above!</p>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Type your answer"
        className="w-full px-4 py-3 mb-4 rounded-lg text-lg text-center"
      />

      <motion.button
        onClick={handleSubmit}
        className="w-full px-6 py-3 bg-yellow-400 text-indigo-900 rounded-lg font-bold hover:bg-yellow-300 mb-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play className="inline mr-2 w-4 h-4" />
        Submit
      </motion.button>

      {feedback && (
        <motion.div className="text-xl font-bold text-white" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          {feedback}
        </motion.div>
      )}
    </div>
  )
}

// Game 5: Reaction Time
const ReactionTime = () => {
  const [gameState, setGameState] = useState('idle') // idle, ready, active
  const [reactionTime, setReactionTime] = useState(0)
  const [bestTime, setBestTime] = useState(Infinity)
  const [totalGames, setTotalGames] = useState(0)
  const startTimeRef = useRef(0)

  const startTest = () => {
    setGameState('ready')
    const delay = Math.random() * 3000 + 1000
    setTimeout(() => setGameState('active'), delay)
  }

  const handleClick = () => {
    if (gameState === 'active') {
      const time = Date.now() - startTimeRef.current
      setReactionTime(time)
      setTotalGames(totalGames + 1)
      if (time < bestTime) setBestTime(time)
      setGameState('idle')
    }
  }

  useEffect(() => {
    if (gameState === 'active') {
      startTimeRef.current = Date.now()
    }
  }, [gameState])

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-75">Last Time</div>
          <div className="text-2xl font-bold">{reactionTime}ms</div>
        </div>
        <div className="bg-purple-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-75">Best Time</div>
          <div className="text-2xl font-bold">{bestTime === Infinity ? '-' : bestTime + 'ms'}</div>
        </div>
      </div>

      <motion.div
        onClick={handleClick}
        className={`h-40 rounded-lg flex items-center justify-center text-2xl font-bold cursor-pointer transition-all mb-6 ${
          gameState === 'idle'
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : gameState === 'ready'
              ? 'bg-yellow-400 text-indigo-900'
              : 'bg-green-500 text-white animate-pulse'
        }`}
      >
        {gameState === 'idle'
          ? 'Click to Start'
          : gameState === 'ready'
            ? 'Wait for Green...'
            : 'CLICK NOW!'}
      </motion.div>

      <motion.button
        onClick={startTest}
        className="px-6 py-3 bg-yellow-400 text-indigo-900 rounded-lg font-bold hover:bg-yellow-300"
        whileHover={{ scale: 1.05 }}
      >
        <Play className="inline mr-2 w-4 h-4" />
        Start Test
      </motion.button>

      <p className="text-white mt-4 text-sm">Games Played: {totalGames}</p>
    </div>
  )
}

// Game 6: Number Memorization
const NumberMemory = () => {
  const [numbers, setNumbers] = useState<number[]>([])
  const [revealed, setRevealed] = useState(true)
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [round, setRound] = useState(1)

  const generateNumbers = useCallback(() => {
    const newNumbers = Array.from({ length: round + 2 }, () => Math.floor(Math.random() * 10))
    setNumbers(newNumbers)
    setRevealed(true)
    setUserInput('')
    setFeedback('')
    setTimeout(() => setRevealed(false), 2000 + round * 500)
  }, [round])

  useEffect(() => {
    generateNumbers()
  }, [generateNumbers])

  const handleSubmit = () => {
    if (userInput === numbers.join('')) {
      setScore(score + round * 10)
      setFeedback(`Correct! Moving to round ${round + 1}`)
      setRound(round + 1)
      setTimeout(generateNumbers, 1500)
    } else {
      setFeedback('Wrong. Game over.')
    }
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="text-2xl font-bold text-white mb-6">Score: {score} | Round: {round}</div>

      {revealed ? (
        <motion.div className="text-6xl font-bold text-yellow-300 mb-6 bg-indigo-700 p-8 rounded-lg">
          {numbers.join(' ')}
        </motion.div>
      ) : (
        <div className="text-4xl font-bold text-white mb-6 bg-indigo-700 p-8 rounded-lg opacity-50">
          ????
        </div>
      )}

      <p className="text-white mb-4 text-sm opacity-75">Memorize and enter the numbers!</p>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Enter the numbers"
        disabled={revealed}
        className="w-full px-4 py-3 mb-4 rounded-lg text-lg text-center"
      />

      <motion.button
        onClick={handleSubmit}
        disabled={revealed}
        className="w-full px-6 py-3 bg-yellow-400 text-indigo-900 rounded-lg font-bold hover:bg-yellow-300 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
      >
        <Play className="inline mr-2 w-4 h-4" />
        Submit
      </motion.button>

      {feedback && (
        <motion.div className="text-xl font-bold text-white mt-4" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          {feedback}
        </motion.div>
      )}
    </div>
  )
}

// Game 7: Pattern Recognition
const PatternRecognition = () => {
  const patterns = [
    { sequence: [2, 4, 6, 8, '?'], answer: '10', description: 'Even numbers' },
    { sequence: [1, 1, 2, 3, 5, '?'], answer: '8', description: 'Fibonacci' },
    { sequence: [1, 4, 9, 16, '?'], answer: '25', description: 'Perfect squares' },
    { sequence: [5, 10, 15, 20, '?'], answer: '25', description: 'Multiples of 5' },
    { sequence: [100, 50, 25, '?'], answer: '12.5', description: 'Halving' },
  ]

  const [pattern, setPattern] = useState(patterns[0])
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [round, setRound] = useState(1)

  const generatePattern = () => {
    const newPattern = patterns[Math.floor(Math.random() * patterns.length)]
    setPattern(newPattern)
    setAnswer('')
    setFeedback('')
  }

  const handleSubmit = () => {
    if (answer === pattern.answer) {
      setScore(score + 20)
      setFeedback(`Correct! It was ${pattern.description}`)
      setRound(round + 1)
      setTimeout(generatePattern, 1500)
    } else {
      setFeedback(`Wrong. Answer: ${pattern.answer}`)
    }
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="text-2xl font-bold text-white mb-6">Score: {score}</div>

      <div className="text-3xl font-bold text-yellow-300 mb-6 bg-indigo-700 p-6 rounded-lg space-x-2">
        {pattern.sequence.map((num, i) => (
          <span key={i}>{num} </span>
        ))}
      </div>

      <p className="text-white mb-4 text-sm opacity-75">Find the next number in the pattern!</p>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Enter the answer"
        className="w-full px-4 py-3 mb-4 rounded-lg text-lg text-center"
      />

      <motion.button
        onClick={handleSubmit}
        className="w-full px-6 py-3 bg-yellow-400 text-indigo-900 rounded-lg font-bold hover:bg-yellow-300 mb-4"
        whileHover={{ scale: 1.05 }}
      >
        <Play className="inline mr-2 w-4 h-4" />
        Submit
      </motion.button>

      {feedback && (
        <motion.div className="text-xl font-bold text-white" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          {feedback}
        </motion.div>
      )}
    </div>
  )
}

// Game 8: Sudoku Mini
const SudokuMini = () => {
  const [grid, setGrid] = useState(
    Array(9).fill(null).map(() => Array(9).fill(''))
  )
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')

  const handleCellChange = (row: number, col: number, value: string) => {
    const newGrid = grid.map(r => [...r])
    newGrid[row][col] = value ? parseInt(value) : ''
    setGrid(newGrid)
  }

  const validateSudoku = () => {
    // Simple validation - just check if no empty cells
    const isFull = grid.every(row => row.every(cell => cell !== ''))
    if (isFull) {
      setScore(score + 50)
      setFeedback('Grid complete!')
    } else {
      setFeedback('Fill all cells first.')
    }
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="text-2xl font-bold text-white mb-6">Score: {score}</div>

      <div className="bg-indigo-700 p-4 rounded-lg mb-6 inline-block">
        <div className="grid grid-cols-3 gap-2">
          {Array(9).fill(null).map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-1 bg-white/10 p-2 rounded">
              {Array(3).fill(null).map((_, j) => {
                const row = Math.floor(i / 3) * 3 + Math.floor(j / 3)
                const col = (i % 3) * 3 + (j % 3)
                return (
                  <input
                    key={`${row}-${col}`}
                    type="number"
                    min="1"
                    max="9"
                    value={grid[row][col]}
                    onChange={(e) => handleCellChange(row, col, e.target.value)}
                    className="w-8 h-8 text-center text-white bg-indigo-600 border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <motion.button
        onClick={validateSudoku}
        className="w-full px-6 py-3 bg-yellow-400 text-indigo-900 rounded-lg font-bold hover:bg-yellow-300"
        whileHover={{ scale: 1.05 }}
      >
        <Play className="inline mr-2 w-4 h-4" />
        Check
      </motion.button>

      {feedback && (
        <motion.div className="text-xl font-bold text-white mt-4" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          {feedback}
        </motion.div>
      )}
    </div>
  )
}

// Game 9: Typing Speed
const TypingSpeed = () => {
  const texts = [
    'The quick brown fox jumps over the lazy dog.',
    'Education is the most powerful weapon in the world.',
    'Success is not final, failure is not fatal.',
    'Every moment is a fresh beginning.',
  ]

  const [text, setText] = useState('')
  const [userText, setUserText] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [gameActive, setGameActive] = useState(false)

  const startGame = () => {
    const newText = texts[Math.floor(Math.random() * texts.length)]
    setText(newText)
    setUserText('')
    setStartTime(Date.now())
    setGameActive(true)
    setAccuracy(100)
  }

  const handleType = (value: string) => {
    setUserText(value)

    if (value === text) {
      const timeInSeconds = (Date.now() - startTime) / 1000
      const words = text.split(' ').length
      setWpm(Math.round((words / timeInSeconds) * 60))
      setGameActive(false)
    }

    const correct = text.split('').filter((char, i) => char === value[i]).length
    setAccuracy(Math.round((correct / value.length) * 100) || 100)
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-75">WPM</div>
          <div className="text-2xl font-bold">{wpm}</div>
        </div>
        <div className="bg-purple-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-75">Accuracy</div>
          <div className="text-2xl font-bold">{accuracy}%</div>
        </div>
      </div>

      {text && (
        <div className="bg-indigo-700 p-4 rounded-lg mb-4 text-left">
          <p className="text-white font-mono text-sm mb-3">{text}</p>
          <textarea
            value={userText}
            onChange={(e) => handleType(e.target.value)}
            disabled={!gameActive}
            placeholder="Start typing here..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white font-mono"
            rows={3}
          />
        </div>
      )}

      <motion.button
        onClick={startGame}
        className="w-full px-6 py-3 bg-yellow-400 text-indigo-900 rounded-lg font-bold hover:bg-yellow-300"
        whileHover={{ scale: 1.05 }}
      >
        <Play className="inline mr-2 w-4 h-4" />
        {gameActive ? 'Typing...' : 'Start Typing Test'}
      </motion.button>
    </div>
  )
}

// Game 10: IQ Challenge
const IQChallenge = () => {
  const questions = [
    { question: 'What comes next in 2, 5, 10, 17, ?', options: ['24', '26', '28', '30'], answer: '26' },
    { question: 'If 3 apples + 2 oranges = 5, what is 5 apples + 3 oranges?', options: ['7', '8', '9', '10'], answer: '8' },
    { question: 'What letter comes next? A, E, I, O, ?', options: ['U', 'Y', 'W', 'X'], answer: 'U' },
    { question: 'If all roses are flowers and some flowers are red, then?', options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Cannot determine'], answer: 'Some roses are red' },
  ]

  const [question, setQuestion] = useState(questions[0])
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState('')
  const [feedback, setFeedback] = useState('')

  const generateQuestion = () => {
    const newQuestion = questions[Math.floor(Math.random() * questions.length)]
    setQuestion(newQuestion)
    setSelected('')
    setFeedback('')
  }

  const handleAnswer = (option: string) => {
    setSelected(option)
    if (option === question.answer) {
      setScore(score + 25)
      setFeedback('Correct!')
      setTimeout(generateQuestion, 1500)
    } else {
      setFeedback(`Wrong. Answer: ${question.answer}`)
    }
  }

  return (
    <div className="text-center max-w-lg mx-auto">
      <div className="text-2xl font-bold text-white mb-6">Score: {score}</div>

      <div className="bg-indigo-700 p-6 rounded-lg mb-6 text-white text-left">
        <p className="text-xl font-bold mb-6">{question.question}</p>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option, i) => (
            <motion.button
              key={i}
              onClick={() => handleAnswer(option)}
              className={`p-4 rounded-lg font-bold transition-all ${
                selected === option
                  ? 'bg-yellow-400 text-indigo-900'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>

      {feedback && (
        <motion.div className="text-xl font-bold text-white" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          {feedback}
        </motion.div>
      )}
    </div>
  )
}

export default function FunZone() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showGameInfo, setShowGameInfo] = useState<string | null>(null)

  const games = [
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Test your memory skills!',
      icon: Brain,
      fullDescription: 'Match pairs of symbols by flipping cards. The fewer moves you make, the better your score!',
      howToPlay: [
        'Click on cards to flip them over',
        'Try to match pairs of the same symbol',
        'Remember the position of each symbol',
        'Match all pairs to win',
        'Earn 10 points for each match'
      ]
    },
    {
      id: 'math',
      title: 'Quick Math',
      description: 'Solve math problems fast!',
      icon: Calculator,
      fullDescription: 'Solve random math problems as quickly as you can. Speed and accuracy matter!',
      howToPlay: [
        'A math problem will appear on screen',
        'Quickly calculate the answer',
        'Enter your answer and press Enter',
        'Get it right for 10 points',
        'Wrong answers end the game'
      ]
    },
    {
      id: 'colors',
      title: 'Color Sequence',
      description: 'Repeat the color pattern!',
      icon: Palette,
      fullDescription: 'Watch and repeat increasingly complex color sequences. Memory and focus required!',
      howToPlay: [
        'Watch the colored squares light up',
        'Memorize the sequence',
        'Click the squares in the same order',
        'Each round adds a new color to repeat',
        'Earn 10 points per successful round'
      ]
    },
    {
      id: 'words',
      title: 'Word Scramble',
      description: 'Unscramble the letters!',
      icon: PenLine,
      fullDescription: 'Rearrange scrambled letters to form the correct word. Great for vocabulary!',
      howToPlay: [
        'Letters will be shown in random order',
        'Unscramble them to form a word',
        'Type your answer and press Enter',
        'Correct answers earn 15 points',
        'Words get progressively harder'
      ]
    },
    {
      id: 'reaction',
      title: 'Reaction Time',
      description: 'Test your reflexes!',
      icon: Zap,
      fullDescription: 'React as fast as possible when the square turns green. Test your reflexes!',
      howToPlay: [
        'Click "Start Test" to begin',
        'Wait for the square to turn green',
        'Click as soon as it turns green',
        'Your reaction time will be recorded',
        'Try to beat your best time'
      ]
    },
    {
      id: 'numbers',
      title: 'Number Memory',
      description: 'Memorize number sequences!',
      icon: KeyRound,
      fullDescription: 'Numbers appear briefly, then disappear. Memorize and type them back!',
      howToPlay: [
        'Numbers will be displayed briefly',
        'Memorize all the numbers',
        'Type them in the correct order',
        'Each round adds more numbers',
        'Score increases with each round'
      ]
    },
    {
      id: 'pattern',
      title: 'Pattern Recognition',
      description: 'Find the pattern!',
      icon: Search,
      fullDescription: 'Identify mathematical patterns and predict the next number in the sequence.',
      howToPlay: [
        'Look at the number sequence',
        'Identify the pattern or rule',
        'Predict the next number',
        'Enter your answer',
        'Each correct answer earns 20 points'
      ]
    },
    {
      id: 'sudoku',
      title: 'Sudoku Mini',
      description: 'Fill the grid!',
      icon: Target,
      fullDescription: 'Classic Sudoku puzzle. Fill each cell with numbers 1-9.',
      howToPlay: [
        'Fill each 3x3 box with numbers 1-9',
        'Each row must have 1-9',
        'Each column must have 1-9',
        'No repeats in rows, columns, or boxes',
        'Complete the grid to earn 50 points'
      ]
    },
    {
      id: 'typing',
      title: 'Typing Speed',
      description: 'Test your typing speed!',
      icon: Keyboard,
      fullDescription: 'Type the given text as quickly and accurately as possible. Measures WPM and accuracy!',
      howToPlay: [
        'Click "Start Typing Test"',
        'Type the text exactly as shown',
        'Speed and accuracy are measured',
        'WPM = Words Per Minute',
        'Accuracy shows percentage of correct characters'
      ]
    },
    {
      id: 'iq',
      title: 'IQ Challenge',
      description: 'Solve tricky problems!',
      icon: Puzzle,
      fullDescription: 'Logic and reasoning questions. Each correct answer tests your intelligence!',
      howToPlay: [
        'Read the question carefully',
        'Consider all answer options',
        'Select your answer',
        'Instant feedback on correctness',
        'Each right answer earns 25 points'
      ]
    },
    {
      id: 'fingerplacement',
      title: 'Finger Placement Guide',
      description: 'Learn proper keyboard hand positioning!',
      icon: Hand,
      fullDescription: 'Master the correct finger placement on the keyboard. Essential for touch typing! Learn hand position for home row, upper row, and bottom row keys.',
      howToPlay: [
        'Start with the home row lesson',
        'Learn which finger goes on which key',
        'Follow the tips and guidelines',
        'Mark each lesson as completed',
        'Progress through all positioning levels'
      ]
    },
    {
      id: 'homerowmaster',
      title: 'Home Row Master',
      description: 'Practice home row keys!',
      icon: Home,
      fullDescription: 'Build muscle memory by typing words using only home row keys (A, S, D, F, J, K, L, ;). Perfect for beginners!',
      howToPlay: [
        'Click "Start Home Row Practice"',
        'Type the displayed home row words',
        'Earn points for accuracy',
        'Track your WPM (Words Per Minute)',
        'Perfect for building finger memory'
      ]
    },
    {
      id: 'accuracy',
      title: 'Typing Accuracy',
      description: 'Focus on typing accurately!',
      icon: Target,
      fullDescription: 'Accuracy is more important than speed! Type sentences carefully and precisely to maximize your score.',
      howToPlay: [
        'Start an accuracy challenge',
        'Type each sentence carefully',
        'Errors are highlighted in red',
        'Track your accuracy percentage',
        'Perfect matches earn bonus points'
      ]
    },
    {
      id: 'touchlessons',
      title: 'Touch Typing Lessons',
      description: 'Structured typing lessons!',
      icon: GraduationCap,
      fullDescription: 'Progress through structured lessons learning different keyboard zones. From home row to complete keyboard mastery!',
      howToPlay: [
        'Complete each lesson in order',
        'Type practice text exactly',
        'Advance to next lesson when ready',
        'Track lessons mastered',
        'Cover all keyboard zones'
      ]
    },
    {
      id: 'speedbuilder',
      title: 'Speed Builder',
      description: 'Build typing speed progressively!',
      icon: Gauge,
      fullDescription: 'Progressive difficulty levels. Start slow and build up your typing speed gradually. Each level has a WPM target.',
      howToPlay: [
        'Start at Level 1 with low WPM target',
        'Type the entire text accurately',
        'Reach the WPM target to advance',
        'Difficulty increases with each level',
        'Earn points for level completion'
      ]
    },
    {
      id: 'keycombos',
      title: 'Key Combinations',
      description: 'Master special key combinations!',
      icon: Keyboard,
      fullDescription: 'Learn to use special keys including Shift, Tab, Enter, and Backspace. Master keyboard combinations for typing efficiency!',
      howToPlay: [
        'Press the key shown on screen',
        'Includes uppercase, special keys, and controls',
        'Boost your score with accuracy',
        'Build a combo streak',
        'Essential for complete keyboard mastery'
      ]
    },
  ]

  // Typing Game 1: Keyboard Finger Placement Guide
const KeyboardFingerPlacement = () => {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(4).fill(false))

  const lessons = [
    {
      title: 'Home Row - Left Hand',
      description: 'Learn proper left hand placement on the home row',
      keys: ['A', 'S', 'D', 'F'],
      fingers: ['Pinky', 'Ring', 'Middle', 'Index'],
      image: 'Home row',
      tips: [
        'Rest your left pinky on the "A" key',
        'Ring finger goes on "S" key',
        'Middle finger goes on "D" key',
        'Index finger goes on "F" key',
        'Keep your hand relaxed and curved',
        'Your fingers should rest lightly on these keys'
      ]
    },
    {
      title: 'Home Row - Right Hand',
      description: 'Learn proper right hand placement on the home row',
      keys: ['J', 'K', 'L', ';'],
      fingers: ['Index', 'Middle', 'Ring', 'Pinky'],
      image: 'Home row',
      tips: [
        'Rest your right index finger on "J" key',
        'Middle finger goes on "K" key',
        'Ring finger goes on "L" key',
        'Pinky finger goes on ";" key',
        'Keep your fingers aligned with home row',
        'This is your resting position'
      ]
    },
    {
      title: 'Upper Row Keys',
      description: 'Extend your fingers to reach upper row keys',
      keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      fingers: ['From home row', 'Extend upward', 'Keep wrist still', 'Return to home'],
      image: 'Reach up',
      tips: [
        'Left hand: Reach up from A, S, D, F keys',
        'Right hand: Reach up from J, K, L, ; keys',
        'Move fingers, not your hand',
        'Always return to home row position',
        'Practice reaching without looking',
        'Your wrist should stay still'
      ]
    },
    {
      title: 'Bottom Row Keys',
      description: 'Properly reach the bottom row keys',
      keys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
      fingers: ['Extend down', 'Keep alignment', 'Quick return', 'Home position'],
      image: 'Reach down',
      tips: [
        'Left hand: Reach down from A, S, D, F keys',
        'Right hand: Reach down from J, K, L, ; keys',
        'Fingers move down then return quickly',
        'Don\'t shift your hand position',
        'Eyes should follow the text, not keyboard',
        'Practice blind reaching'
      ]
    }
  ]

  const lesson = lessons[currentLesson]
  const isCompleted = completedLessons[currentLesson]

  const markAsComplete = () => {
    const newCompleted = [...completedLessons]
    newCompleted[currentLesson] = true
    setCompletedLessons(newCompleted)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{lesson.title}</h2>
        <p className="text-indigo-100">{lesson.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Keyboard Visualization */}
        <div className="bg-white/10 p-6 rounded-xl border border-white/20">
          <div className="text-5xl text-center mb-4">{lesson.image}</div>
          <h3 className="text-xl font-bold text-white mb-4 text-center">Key Layout</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {lesson.keys.map((key, i) => (
              <motion.div
                key={i}
                className="w-12 h-12 bg-yellow-400 text-indigo-900 rounded-lg flex items-center justify-center font-bold text-lg cursor-pointer hover:bg-yellow-300 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {key}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Finger Mapping */}
        <div className="bg-white/10 p-6 rounded-xl border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Finger Placement</h3>
          <div className="space-y-3">
            {lesson.keys.map((key, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">
                  {key}
                </div>
                <span className="text-white font-semibold flex-1">{lesson.fingers[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white/10 p-6 rounded-xl border border-white/20 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Tips & Guidelines</h3>
        <ul className="space-y-2">
          {lesson.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-white">
              <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-indigo-900 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                {i + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-6">
        <motion.button
          onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
          disabled={currentLesson === 0}
          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-bold transition-all"
          whileHover={{ scale: 1.05 }}
        >
          ← Previous
        </motion.button>
        <motion.button
          onClick={markAsComplete}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            isCompleted
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          whileHover={{ scale: 1.05 }}
        >
          {isCompleted ? 'Completed' : 'Mark Complete'}
        </motion.button>
        <motion.button
          onClick={() => setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))}
          disabled={currentLesson === lessons.length - 1}
          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-bold transition-all"
          whileHover={{ scale: 1.05 }}
        >
          Next →
        </motion.button>
      </div>

      {/* Progress */}
      <div className="bg-white/10 p-4 rounded-lg border border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-semibold">Lessons Completed</span>
          <span className="text-yellow-400 font-bold">{completedLessons.filter(Boolean).length}/{lessons.length}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            className="bg-yellow-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedLessons.filter(Boolean).length / lessons.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}

// Typing Game 2: Home Row Master
const HomeRowMaster = () => {
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [wpm, setWpm] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [gameActive, setGameActive] = useState(false)

  const homeRowWords = [
    'sad', 'had', 'ads', 'add', 'dad', 'flash', 'hash', 'dash', 'asked', 'grass',
    'shall', 'salad', 'flash', 'glad', 'jazz', 'fell', 'jell', 'kale', 'lake', 'fell',
    'folk', 'desk', 'fad', 'half', 'flask', 'ledge', 'shelf', 'skilled', 'skilled'
  ]

  const startGame = () => {
    const randomWords = []
    for (let i = 0; i < 5; i++) {
      randomWords.push(homeRowWords[Math.floor(Math.random() * homeRowWords.length)])
    }
    setText(randomWords.join(' '))
    setUserInput('')
    setStartTime(Date.now())
    setGameActive(true)
    setAccuracy(100)
    setWpm(0)
  }

  const handleInput = (value: string) => {
    setUserInput(value)

    if (value === text) {
      const timeInSeconds = (Date.now() - startTime) / 1000
      const words = value.split(' ').length
      setWpm(Math.round((words / timeInSeconds) * 60))
      setScore(score + 50)
      setGameActive(false)
    }

    const correct = text.split('').filter((char, i) => char === value[i]).length
    const acc = value.length > 0 ? Math.round((correct / value.length) * 100) : 100
    setAccuracy(acc)
  }

  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400 rounded-lg">
        <p className="text-white text-sm">Practice typing using only home row keys (A, S, D, F, J, K, L, ;)</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-75">Score</div>
          <div className="text-3xl font-bold">{score}</div>
        </div>
        <div className="bg-purple-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-75">Accuracy</div>
          <div className="text-3xl font-bold">{accuracy}%</div>
        </div>
        <div className="bg-pink-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-75">WPM</div>
          <div className="text-3xl font-bold">{wpm}</div>
        </div>
      </div>

      {text && (
        <div className="bg-indigo-700 p-6 rounded-lg mb-6">
          <p className="text-white font-mono text-2xl mb-6 tracking-wider">{text}</p>
          <input
            type="text"
            value={userInput}
            onChange={(e) => handleInput(e.target.value)}
            disabled={!gameActive}
            placeholder="Type the words here..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white font-mono text-lg placeholder-gray-400"
            autoFocus
          />
        </div>
      )}

      <motion.button
        onClick={startGame}
        className="w-full px-6 py-3 bg-yellow-400 text-indigo-900 rounded-lg font-bold hover:bg-yellow-300"
        whileHover={{ scale: 1.05 }}
      >
        <Play className="inline mr-2 w-4 h-4" />
        {gameActive ? 'Typing...' : 'Start Home Row Practice'}
      </motion.button>
    </div>
  )
}

// Typing Game 3: Typing Accuracy Challenge
const TypingAccuracyChallenge = () => {
  const texts = [
    'The quick brown fox jumps over the lazy dog',
    'Practice makes perfect in typing',
    'Accuracy is more important than speed',
    'Focus on proper finger placement while typing',
    'Build muscle memory through consistent practice',
    'Type each word carefully and deliberately',
    'Your accuracy will improve with patience',
    'Never rush when learning to type'
  ]

  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [completed, setCompleted] = useState(false)

  const startGame = () => {
    const newText = texts[Math.floor(Math.random() * texts.length)]
    setText(newText)
    setUserInput('')
    setGameActive(true)
    setAccuracy(100)
    setErrors(0)
    setCompleted(false)
  }

  const handleInput = (value: string) => {
    setUserInput(value)

    if (value === text) {
      setScore(score + (accuracy >= 95 ? 100 : accuracy >= 85 ? 50 : 25))
      setCompleted(true)
      setGameActive(false)
    }

    let errorCount = 0
    text.split('').forEach((char, i) => {
      if (value[i] && char !== value[i]) {
        errorCount++
      }
    })
    setErrors(errorCount)

    const correct = text.split('').filter((char, i) => char === value[i]).length
    const acc = value.length > 0 ? Math.round((correct / value.length) * 100) : 100
    setAccuracy(acc)
  }

  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="mb-6 p-4 bg-amber-500/20 border border-amber-400 rounded-lg">
        <p className="text-white text-sm">Focus on accuracy! Type each word carefully without errors.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-75">Score</div>
          <div className="text-3xl font-bold">{score}</div>
        </div>
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-75">Accuracy</div>
          <div className="text-3xl font-bold">{accuracy}%</div>
        </div>
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <div className="text-sm opacity-75">Errors</div>
          <div className="text-3xl font-bold">{errors}</div>
        </div>
      </div>

      {text && (
        <div className="bg-indigo-700 p-6 rounded-lg mb-6">
          <p className="text-white font-mono text-xl mb-6 leading-relaxed">{text}</p>
          <div className="relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => handleInput(e.target.value)}
              disabled={!gameActive}
              placeholder="Type the text above..."
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white font-mono placeholder-gray-400"
              autoFocus
            />
            {text && userInput && (
              <div className="mt-2 p-3 bg-white/10 rounded-lg text-left">
                <p className="text-gray-300 text-sm font-mono">
                  {text.split('').map((char, i) => (
                    <span
                      key={i}
                      className={
                        userInput[i] === undefined
                          ? 'text-white'
                          : userInput[i] === char
                          ? 'text-green-400'
                          : 'text-red-400'
                      }
                    >
                      {char}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6 p-4 bg-green-500/20 border border-green-400 rounded-lg"
        >
          <p className="text-green-300 font-bold text-lg">Perfect! Great accuracy!</p>
        </motion.div>
      )}

      <motion.button
        onClick={startGame}
        className="w-full px-6 py-3 bg-yellow-400 text-indigo-900 rounded-lg font-bold hover:bg-yellow-300"
        whileHover={{ scale: 1.05 }}
      >
        <Play className="inline mr-2 w-4 h-4" />
        {gameActive ? 'Typing...' : 'Start Accuracy Challenge'}
      </motion.button>
    </div>
  )
}

// Typing Game 4: Touch Typing Lessons
const TouchTypingLessons = () => {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [lessonsCompleted, setLessonsCompleted] = useState(0)

  const lessons = [
    {
      title: 'Lesson 1: Home Row Comfort',
      keys: 'a s d f j k l ;',
      practice: 'aaa sss ddd fff jjj kkk lll ;;;',
      description: 'Get comfortable with home row keys'
    },
    {
      title: 'Lesson 2: Home Row Words',
      keys: 'a s d f j k l ;',
      practice: 'dad had ask flask desk fell lakes fjords',
      description: 'Type simple words using home row'
    },
    {
      title: 'Lesson 3: Upper Keys Left',
      keys: 'q w e r t y u i o p',
      practice: 'we wet wet were were where where work work',
      description: 'Reach to upper row with left hand'
    },
    {
      title: 'Lesson 4: Upper Keys Right',
      keys: 'y u i o p',
      practice: 'you your type type python python popup puppy',
      description: 'Reach to upper row with right hand'
    },
    {
      title: 'Lesson 5: Bottom Row Keys',
      keys: 'z x c v b n m',
      practice: 'box box mix mixed comma bench bunch bunch',
      description: 'Reach down to bottom row keys'
    },
    {
      title: 'Lesson 6: Combined Practice',
      keys: 'all keys',
      practice: 'The lazy fox jumped over the brown bush',
      description: 'Practice with all keys combined'
    }
  ]

  const lesson = lessons[currentLesson]
  const isComplete = userInput.toLowerCase() === lesson.practice.toLowerCase()

  const handleNext = () => {
    if (isComplete) {
      setLessonsCompleted(lessonsCompleted + 1)
      setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))
      setUserInput('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{lesson.title}</h2>
        <p className="text-indigo-200">{lesson.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Progress */}
        <div className="bg-indigo-600/30 p-4 rounded-lg border border-indigo-400">
          <p className="text-indigo-200 text-sm mb-2">Progress</p>
          <p className="text-2xl font-bold text-white">{currentLesson + 1}/{lessons.length}</p>
        </div>

        {/* Lessons Completed */}
        <div className="bg-green-600/30 p-4 rounded-lg border border-green-400">
          <p className="text-green-200 text-sm mb-2">Lessons Mastered</p>
          <p className="text-2xl font-bold text-white">{lessonsCompleted}</p>
        </div>
      </div>

      <div className="bg-indigo-700/50 p-6 rounded-lg mb-6 border border-indigo-500">
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Target Keys: {lesson.keys}</p>
          <p className="text-white font-mono text-lg tracking-wider">{lesson.practice}</p>
        </div>

        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type the practice text..."
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white font-mono placeholder-gray-400"
          autoFocus
        />

        {isComplete && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 p-3 bg-green-500/20 border border-green-400 rounded-lg"
          >
            <p className="text-green-300 font-bold">Perfect! Move to next lesson</p>
          </motion.div>
        )}
      </div>

      <div className="flex gap-4">
        <motion.button
          onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
          disabled={currentLesson === 0}
          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-bold"
          whileHover={{ scale: 1.05 }}
        >
          ← Previous
        </motion.button>
        <motion.button
          onClick={handleNext}
          disabled={!isComplete}
          className="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-indigo-900 rounded-lg font-bold"
          whileHover={{ scale: 1.05 }}
        >
          {isComplete ? 'Next →' : 'Type correctly to continue'}
        </motion.button>
      </div>
    </div>
  )
}

// Typing Game 5: Speed Builder Challenge
const SpeedBuilderChallenge = () => {
  const difficultyLevels = [
    { level: 1, wpm: 20, words: 15, text: 'the cat sat on the mat and fell asleep' },
    { level: 2, wpm: 30, words: 20, text: 'practice typing every day to improve your skills' },
    { level: 3, wpm: 40, words: 25, text: 'touch typing allows you to type without looking at the keyboard' },
    { level: 4, wpm: 50, words: 30, text: 'proper posture and hand placement are essential for fast typing' },
    { level: 5, wpm: 60, words: 35, text: 'consistency and dedication will help you become an excellent typist' }
  ]

  const [currentLevel, setCurrentLevel] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [levelCompleted, setLevelCompleted] = useState(false)

  const difficulty = difficultyLevels[currentLevel]

  const startGame = () => {
    setUserInput('')
    setStartTime(Date.now())
    setGameActive(true)
    setLevelCompleted(false)
    setWpm(0)
  }

  const handleInput = (value: string) => {
    setUserInput(value)

    if (value === difficulty.text) {
      const timeInSeconds = (Date.now() - startTime) / 1000
      const words = value.split(' ').length
      const calculatedWpm = Math.round((words / timeInSeconds) * 60)
      setWpm(calculatedWpm)
      setGameActive(false)
      setLevelCompleted(true)
    }

    const timeInSeconds = (Date.now() - startTime) / 1000
    if (timeInSeconds > 0) {
      const words = value.split(' ').length
      setWpm(Math.round((words / timeInSeconds) * 60))
    }
  }

  const handleNextLevel = () => {
    if (currentLevel < difficultyLevels.length - 1 && wpm >= difficulty.wpm) {
      setCurrentLevel(currentLevel + 1)
      setUserInput('')
      setWpm(0)
      setLevelCompleted(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-indigo-200 text-sm">Level {currentLevel + 1}</p>
            <h2 className="text-2xl font-bold text-white">Speed Challenge</h2>
          </div>
          <div className="text-right">
            <p className="text-indigo-200 text-sm">Target WPM</p>
            <p className="text-3xl font-bold text-yellow-300">{difficulty.wpm}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-600 p-4 rounded-lg">
          <p className="text-blue-200 text-sm">Current WPM</p>
          <p className="text-3xl font-bold text-white">{wpm}</p>
        </div>
        <div className="bg-purple-600 p-4 rounded-lg">
          <p className="text-purple-200 text-sm">Progress</p>
          <p className="text-3xl font-bold text-white">{currentLevel + 1}/{difficultyLevels.length}</p>
        </div>
      </div>

      <div className="bg-indigo-700 p-6 rounded-lg mb-6">
        <p className="text-white font-mono text-lg mb-4 leading-relaxed">{difficulty.text}</p>
        <input
          type="text"
          value={userInput}
          onChange={(e) => handleInput(e.target.value)}
          disabled={!gameActive}
          placeholder="Type the text..."
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white font-mono placeholder-gray-400"
          autoFocus
        />
      </div>

      {levelCompleted && wpm >= difficulty.wpm && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6 p-4 bg-green-500/20 border border-green-400 rounded-lg text-center"
        >
          <p className="text-green-300 font-bold text-lg">Level complete! WPM: {wpm}</p>
        </motion.div>
      )}

      {levelCompleted && wpm < difficulty.wpm && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6 p-4 bg-orange-500/20 border border-orange-400 rounded-lg text-center"
        >
          <p className="text-orange-300 font-semibold">Need {difficulty.wpm - wpm} more WPM to pass</p>
        </motion.div>
      )}

      <div className="flex gap-4">
        <motion.button
          onClick={startGame}
          className="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 rounded-lg font-bold"
          whileHover={{ scale: 1.05 }}
        >
          <Play className="inline mr-2 w-4 h-4" />
          {gameActive ? 'Typing...' : 'Start Level'}
        </motion.button>
        <motion.button
          onClick={handleNextLevel}
          disabled={!levelCompleted || wpm < difficulty.wpm || currentLevel === difficultyLevels.length - 1}
          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-bold"
          whileHover={{ scale: 1.05 }}
        >
          Next Level →
        </motion.button>
      </div>
    </div>
  )
}

// Typing Game 6: Key Combination Master
const KeyCombinationMaster = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [streak, setStreak] = useState(0)

  const combinations = [
    { text: 'shift + a = A', keys: 'A' },
    { text: 'shift + s = S', keys: 'S' },
    { text: 'shift + d = D', keys: 'D' },
    { text: 'shift + f = F', keys: 'F' },
    { text: 'shift + j = J', keys: 'J' },
    { text: 'shift + k = K', keys: 'K' },
    { text: 'shift + l = L', keys: 'L' },
    { text: 'shift + semicolon = :', keys: ':' },
    { text: 'space bar', keys: ' ' },
    { text: 'backspace', keys: 'backspace' },
    { text: 'enter key', keys: 'enter' },
    { text: 'tab key', keys: 'tab' }
  ]

  const current = combinations[currentIndex]

  const handleInput = (e: React.KeyboardEvent) => {
    let typedKey = ''
    
    if (e.key === ' ') typedKey = ' '
    else if (e.key === 'Enter') typedKey = 'enter'
    else if (e.key === 'Tab') { e.preventDefault(); typedKey = 'tab' }
    else if (e.key === 'Backspace') typedKey = 'backspace'
    else typedKey = e.key.toUpperCase()

    if (typedKey === current.keys) {
      setScore(score + 10)
      setStreak(streak + 1)
      if (currentIndex < combinations.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setCurrentIndex(0)
      }
    } else {
      setAccuracy(Math.max(0, accuracy - 5))
      setStreak(0)
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-indigo-200 text-sm">Score</p>
            <p className="text-3xl font-bold text-white">{score}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-sm">Streak</p>
            <p className="text-3xl font-bold text-yellow-300">{streak}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-sm">Accuracy</p>
            <p className="text-3xl font-bold text-green-300">{accuracy}%</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-700 p-12 rounded-xl mb-8">
        <p className="text-white text-sm opacity-75 mb-4">Press this key:</p>
        <p className="text-6xl font-bold text-yellow-400 font-mono mb-4">{current.text}</p>
        <p className="text-white text-lg">{`${currentIndex + 1}/${combinations.length}`}</p>
      </div>

      <div className="bg-white/10 p-8 rounded-lg border-2 border-white/20 mb-6">
        <input
          type="text"
          onKeyDown={handleInput}
          placeholder="Press any key..."
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white text-center text-2xl font-bold placeholder-gray-400"
          autoFocus
        />
      </div>

      <p className="text-white text-sm opacity-75">Progress: {currentIndex + 1} of {combinations.length}</p>
      <div className="w-full bg-white/20 rounded-full h-2 mt-3">
        <motion.div
          className="bg-yellow-400 h-2 rounded-full"
          animate={{ width: `${((currentIndex + 1) / combinations.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

  useEffect(() => {
 if (!showGameInfo) return;
 const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') setShowGameInfo(null);
 };
 window.addEventListener('keydown', onKeyDown);
 return () => window.removeEventListener('keydown', onKeyDown);
}, [showGameInfo])

const activeGame = games.find((game) => game.id === selectedGame)
const infoGame = games.find((game) => game.id === showGameInfo)
const InfoIcon = infoGame?.icon

const renderGame = () => {
    switch (selectedGame) {
      case 'memory':
        return <MemoryGame />
      case 'math':
        return <QuickMath />
      case 'colors':
        return <ColorMatch />
      case 'words':
        return <WordScramble />
      case 'reaction':
        return <ReactionTime />
      case 'numbers':
        return <NumberMemory />
      case 'pattern':
        return <PatternRecognition />
      case 'sudoku':
        return <SudokuMini />
      case 'typing':
        return <TypingSpeed />
      case 'iq':
        return <IQChallenge />
      case 'fingerplacement':
        return <KeyboardFingerPlacement />
      case 'homerowmaster':
        return <HomeRowMaster />
      case 'accuracy':
        return <TypingAccuracyChallenge />
      case 'touchlessons':
        return <TouchTypingLessons />
      case 'speedbuilder':
        return <SpeedBuilderChallenge />
      case 'keycombos':
        return <KeyCombinationMaster />
      default:
        return null
    }
  }

  return (
 <div className="min-h-screen bg-brand-surface text-brand-ink">
  <CustomHeader />

  <main className="pt-32 pb-16 sm:pt-40">
   <section className="gfa-container mb-12">
    <p className="gfa-eyebrow mb-4">
     <Sparkles aria-hidden="true" className="h-4 w-4" />
     Fun Zone
    </p>
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
     <div>
      <h1 className="gfa-display max-w-2xl">Play, practise, progress.</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-ink/70 sm:text-lg">
       Short, focused games that help pupils sharpen memory, numeracy, language and keyboard skills — one round at a time.
      </p>
     </div>
     <div className="flex flex-wrap gap-3">
      <Link href="/quizzes" className="gfa-btn gfa-btn-secondary">
       Browse quizzes
       <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
      <Link href="/" className="gfa-btn gfa-btn-primary">
       Back to home
      </Link>
     </div>
    </div>
   </section>

   <div className="gfa-container">
    {!selectedGame ? (
     <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
       {games.map((game) => {
        const Icon = game.icon;
        return (
         <article key={game.id} className="gfa-card flex flex-col p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-ink text-brand-gold">
           <Icon aria-hidden="true" className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold text-brand-ink">{game.title}</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink/65">{game.description}</p>
          <div className="mt-6 flex flex-wrap gap-2 border-t border-brand-line pt-4">
           <button type="button" onClick={() => setShowGameInfo(game.id)} className="gfa-btn gfa-btn-secondary">
            <BookOpen aria-hidden="true" className="h-4 w-4" />
            How to play
           </button>
           <button type="button" onClick={() => setSelectedGame(game.id)} className="gfa-btn gfa-btn-primary">
            <Play aria-hidden="true" className="h-4 w-4" />
            Play now
           </button>
          </div>
         </article>
        );
       })}
      </div>

      <section className="gfa-card mt-12 bg-brand-ink p-6 text-white sm:p-8" aria-labelledby="why-play-title">
       <h2 id="why-play-title" className="font-display text-2xl font-semibold text-white">Why play?</h2>
       <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
         { label: "Brain training", icon: Brain },
         { label: "Quick games", icon: Zap },
         { label: "Score points", icon: Trophy },
         { label: "Improve skills", icon: Target },
        ].map((item) => {
         const ItemIcon = item.icon;
         return (
          <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white/10 p-4">
           <ItemIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-brand-gold" />
           <span className="text-sm font-semibold">{item.label}</span>
          </div>
         );
        })}
       </div>
      </section>
     </>
    ) : (
     <>
      <div className="gfa-card mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
       <div>
        <p className="gfa-eyebrow mb-1">Now playing</p>
        <h2 className="font-display text-2xl font-semibold text-brand-ink">{activeGame?.title}</h2>
       </div>
       <div className="flex flex-wrap gap-2">
        <button
         type="button"
         onClick={() => setSoundEnabled(!soundEnabled)}
         aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
         aria-pressed={soundEnabled}
         className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-line bg-white text-brand-ink transition hover:border-brand-indigo"
        >
         {soundEnabled ? <Volume2 aria-hidden="true" className="h-5 w-5" /> : <VolumeX aria-hidden="true" className="h-5 w-5" />}
        </button>
        <button type="button" onClick={() => setSelectedGame(null)} className="gfa-btn gfa-btn-secondary">
         <ArrowLeft aria-hidden="true" className="h-4 w-4" />
         All games
        </button>
       </div>
      </div>
      <div className="gfa-card p-4 sm:p-8">
       {renderGame()}
      </div>
     </>
    )}
   </div>

   {!selectedGame && (
    <section className="gfa-container mt-16">
     <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-indigo to-brand-violet px-6 py-12 text-center text-white sm:px-12">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/15" />
      <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold sm:text-4xl">Ready for a bigger challenge?</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-indigo-100/80 sm:text-base">
       Move from brain teasers to curriculum-aligned quizzes and see how much you have learned.
      </p>
      <Link href="/quizzes" className="gfa-btn mt-8 bg-white text-brand-indigo hover:bg-indigo-50">
       Explore quizzes
       <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
     </div>
    </section>
   )}
  </main>

  <CustomFooter />

  <AnimatePresence>
   {infoGame && (
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     onClick={() => setShowGameInfo(null)}
     className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-ink/70 p-4 backdrop-blur-sm"
    >
     <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-info-title"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={(event) => event.stopPropagation()}
      className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] border border-brand-line bg-white p-6 shadow-2xl sm:p-8"
     >
      <div className="mb-5 flex items-start justify-between gap-4">
       <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-ink text-brand-gold">
        {InfoIcon && <InfoIcon aria-hidden="true" className="h-5 w-5" />}
       </div>
       <button type="button" onClick={() => setShowGameInfo(null)} aria-label="Close game details" autoFocus className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-line text-brand-ink hover:bg-brand-mist">
        <X aria-hidden="true" className="h-5 w-5" />
       </button>
      </div>

      <h3 id="game-info-title" className="font-display text-2xl font-semibold text-brand-ink">{infoGame.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">{infoGame.fullDescription}</p>

      <div className="mt-6 rounded-2xl border border-brand-line bg-brand-surface p-5">
       <h4 className="mb-3 font-semibold text-brand-ink">How to play</h4>
       <ul className="space-y-2">
        {infoGame.howToPlay.map((step, index) => (
         <li key={index} className="flex items-start gap-3 text-sm text-brand-ink/70">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-ink text-xs font-bold text-brand-gold">{index + 1}</span>
          <span>{step}</span>
         </li>
        ))}
       </ul>
      </div>

      <button
       type="button"
       onClick={() => {
        setSelectedGame(infoGame.id);
        setShowGameInfo(null);
       }}
       className="gfa-btn gfa-btn-primary mt-6 w-full"
      >
       <Play aria-hidden="true" className="h-4 w-4" />
       Play now
      </button>
     </motion.div>
    </motion.div>
   )}
  </AnimatePresence>
 </div>
)
}
