import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { getCategoryById, buildQuestions } from '../data/words'
import clsx from 'clsx'
import { useSound } from '../hooks/useSound';

export default function Quiz() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const { stats, loseHeart, recordQuizResult, markWordMastered } = useStore()

  const category = getCategoryById(categoryId!)
  const [questions] = useState(() => buildQuestions(categoryId!))
  const [current, setCurrent] = useState(0)
  const[selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [heartsLeft, setHeartsLeft] = useState(stats.hearts)

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => { return () => clearTimeout(timeoutRef.current) },[])

  if (!category) return null
  const q = questions[current]
  const progress = (current / questions.length) * 100

  const { play: playCorrect } = useSound('/sounds/correct-ding.mp3');
  const { play: playWrong } = useSound('/sounds/wrong-buzz.mp3');

  function handleAnswer(idx: number) {
    if (selected !== null || feedback !== null) return
    setSelected(idx)
    const isCorrect = idx === q.correctIndex

    if (isCorrect) {
      playCorrect();
      setFeedback('correct')
      setScore(s => s + 1)
      markWordMastered(q.wordId)
    } else {
      playWrong();
      setFeedback('wrong')
      loseHeart()
      setHeartsLeft(h => Math.max(0, h - 1))
    }

    timeoutRef.current = setTimeout(() => {
      setSelected(null); setFeedback(null);
      if (current >= questions.length - 1) {
        recordQuizResult({ categoryId: categoryId!, score: isCorrect ? score + 1 : score, total: questions.length, date: new Date().toISOString(), xpEarned: isCorrect ? score * 15 + 15 : score * 15 })
        setFinished(true)
      } else {
        setCurrent(c => c + 1)
      }
    }, 1500)
  }

  if (finished) {
    return (
      <div className="h-[100dvh] pt-20 flex items-center justify-center px-6 relative">
        <div className="bg-shape-emerald" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="content-card max-w-sm w-full text-center">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Quiz Results</h3>
          <h2 className="text-6xl font-bold text-white mb-2">{score}<span className="text-3xl text-gray-600">/{questions.length}</span></h2>
          <p className="text-gray-400 mb-8">Earned <span className="text-indigo-400 font-bold">+{score * 15} XP</span></p>
          <div className="flex flex-col gap-3">
            <button onClick={() => window.location.reload()} className="btn-primary-glass">Retry</button>
            <Link to="/categories" className="btn-glass">Exit</Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-[100dvh] flex flex-col pt-[100px] pb-8 px-4 sm:px-6 overflow-hidden relative">
      <div className="bg-shape-emerald" />
      <div className="max-w-xl mx-auto w-full flex flex-col h-full relative z-10">
        
        <div className="flex justify-between items-center mb-6 shrink-0">
          <Link to={`/flashcards/${categoryId}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Quit
          </Link>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={clsx("h-2 w-6 rounded-full transition-colors", i < heartsLeft ? "bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]" : "bg-white/10")} />
            ))}
          </div>
        </div>

        <div className="h-1.5 w-full bg-white/5 mb-10 rounded-full overflow-hidden shrink-0">
          <motion.div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" animate={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mb-auto">
              <span className="text-indigo-400 font-semibold tracking-wider text-sm mb-2 block">
                {q.type === 'en_to_kk' ? 'Select Translation' : 'Select English Term'}
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-8 drop-shadow-lg">
                {q.question}
              </h2>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col gap-4 shrink-0 pb-12">
            {q.options.map((opt, idx) => {
              const isSelected = selected === idx
              const isCorrect = idx === q.correctIndex
              const showCorrect = feedback !== null && isCorrect
              const showWrong = isSelected && feedback === 'wrong'

              return (
                <button
                  key={opt} onClick={() => handleAnswer(idx)} disabled={selected !== null}
                  className={clsx(
                    "w-full text-left p-5 rounded-2xl border font-medium text-lg transition-all duration-300 flex items-center gap-4",
                    isSelected && feedback === null ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/10 hover:text-white',
                    showCorrect && 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
                    showWrong && 'bg-pink-500/20 border-pink-500 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                  )}
                >
                  <div className={clsx("w-8 h-8 rounded border flex items-center justify-center text-sm font-bold", showCorrect ? "border-emerald-500/50 bg-emerald-500/20" : showWrong ? "border-pink-500/50 bg-pink-500/20" : "border-white/10 bg-white/5")}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1">{opt}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
