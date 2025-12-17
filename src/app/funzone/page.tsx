'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Volume2, VolumeX, Home, Play, RotateCcw, X, BookOpen } from 'lucide-react'
import Link from 'next/link'
import CustomHeader from '@/components/CustomHeader'

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
    const symbols = ['🎨', '🎭', '🎪', '🎬', '🎸', '🎺', '🎻', '🎲']
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
          🎉 You Won in {moves} moves!
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
      setFeedback('✅ Correct!')
      generateNewQuestion()
      setAnswer('')
    } else {
      setFeedback('❌ Try again!')
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
      setFeedback('❌ Wrong! Game Over!')
      setGameActive(false)
      return
    }

    if (newPlayerSeq.length === sequence.length) {
      setScore(score + 10)
      setFeedback('✅ Correct! Next round...')
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
      setFeedback('✅ Correct!')
      setTimeout(generateWord, 1500)
    } else {
      setFeedback('❌ Try again!')
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
      setFeedback(`✅ Correct! Moving to round ${round + 1}`)
      setRound(round + 1)
      setTimeout(generateNumbers, 1500)
    } else {
      setFeedback('❌ Wrong! Game Over!')
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
      setFeedback(`✅ Correct! It was ${pattern.description}`)
      setRound(round + 1)
      setTimeout(generatePattern, 1500)
    } else {
      setFeedback(`❌ Wrong! Answer: ${pattern.answer}`)
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
      setFeedback('✅ Grid Complete!')
    } else {
      setFeedback('❌ Fill all cells!')
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
      setFeedback('✅ Correct!')
      setTimeout(generateQuestion, 1500)
    } else {
      setFeedback(`❌ Wrong! Answer: ${question.answer}`)
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
      title: '🧠 Memory Match',
      description: 'Test your memory skills!',
      icon: '🧠',
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
      title: '🔢 Quick Math',
      description: 'Solve math problems fast!',
      icon: '🔢',
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
      title: '🎨 Color Sequence',
      description: 'Repeat the color pattern!',
      icon: '🎨',
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
      title: '📝 Word Scramble',
      description: 'Unscramble the letters!',
      icon: '📝',
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
      title: '⚡ Reaction Time',
      description: 'Test your reflexes!',
      icon: '⚡',
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
      title: '🔐 Number Memory',
      description: 'Memorize number sequences!',
      icon: '🔐',
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
      title: '🔍 Pattern Recognition',
      description: 'Find the pattern!',
      icon: '🔍',
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
      title: '🎯 Sudoku Mini',
      description: 'Fill the grid!',
      icon: '🎯',
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
      title: '⌨️ Typing Speed',
      description: 'Test your typing speed!',
      icon: '⌨️',
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
      title: '🧩 IQ Challenge',
      description: 'Solve tricky problems!',
      icon: '🧩',
      fullDescription: 'Logic and reasoning questions. Each correct answer tests your intelligence!',
      howToPlay: [
        'Read the question carefully',
        'Consider all answer options',
        'Select your answer',
        'Instant feedback on correctness',
        'Each right answer earns 25 points'
      ]
    },
  ]

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
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-300 via-purple-600 to-blue-900">
      <CustomHeader />

      <div className="relative z-10 pt-30 pb-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Gamepad2 className="w-6 h-6 text-yellow-300" />
            <span className="text-white font-bold">Fun Zone</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🎮 Welcome to Fun Zone! 🎉
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Train your brain while having fun! Play intellectual games and challenge yourself.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto px-4">
          {!selectedGame ? (
            <>
              {/* Games Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {games.map((game) => (
                  <motion.div key={game.id} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity" />
                    <motion.div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 group-hover:border-white/50 transition-all text-white h-full flex flex-col justify-between">
                      <div>
                        <div className="text-5xl mb-4">{game.icon}</div>
                        <h3 className="text-2xl font-bold mb-2">{game.title}</h3>
                        <p className="text-indigo-100 mb-4">{game.description}</p>
                      </div>
                      <div className="flex gap-3 pt-4 border-t border-white/20">
                        <motion.button
                          onClick={() => setShowGameInfo(game.id)}
                          className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <BookOpen className="w-4 h-4" />
                          Info
                        </motion.button>
                        <motion.button
                          onClick={() => setSelectedGame(game.id)}
                          className="flex-1 px-3 py-2 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="w-4 h-4" />
                          Play
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Features Section */}
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6">✨ Why Play?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['🧠 Brain Training', '⚡ Quick Games', '🏆 Score Points', '🎯 Improve Skills'].map((item) => (
                    <div key={item} className="text-center">
                      <p className="font-semibold">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          ) : (
            <>
              {/* Game Header */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {games.find((g) => g.id === selectedGame)?.title}
                  </h2>
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-3 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
                      whileHover={{ scale: 1.05 }}
                    >
                      {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                      onClick={() => setSelectedGame(null)}
                      className="p-3 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Home className="w-5 h-5" />
                      Back
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Game Container */}
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 min-h-96"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {renderGame()}
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      {!selectedGame && (
        <motion.section
          className="relative py-16 px-4 z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-3">Have Fun & Learn! 🚀</h3>
            <p className="text-indigo-100 mb-6">
              These games are designed to challenge your mind and improve your cognitive skills while having fun!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 rounded-lg font-bold transition-all"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </motion.section>
      )}

      {/* Game Info Modal */}
      <AnimatePresence>
        {showGameInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGameInfo(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 max-w-md w-full border-2 border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl">{games.find((g) => g.id === showGameInfo)?.icon}</div>
                <motion.button
                  onClick={() => setShowGameInfo(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                  whileHover={{ scale: 1.1 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              <h3 className="text-3xl font-bold text-white mb-2">
                {games.find((g) => g.id === showGameInfo)?.title}
              </h3>

              <p className="text-indigo-100 mb-6 text-lg">
                {games.find((g) => g.id === showGameInfo)?.fullDescription}
              </p>

              <div className="bg-white/10 rounded-xl p-4 mb-6">
                <h4 className="text-xl font-bold text-yellow-300 mb-3">How to Play:</h4>
                <ul className="text-white space-y-2">
                  {games
                    .find((g) => g.id === showGameInfo)
                    ?.howToPlay.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-indigo-900 rounded-full flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <motion.button
                onClick={() => {
                  setSelectedGame(showGameInfo)
                  setShowGameInfo(null)
                }}
                className="w-full px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Play className="w-5 h-5" />
                Play Now
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
