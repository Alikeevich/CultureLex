import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { categories, words } from '../data/words'

export default function Categories() {
  const stats = useStore((s) => s.stats)

  return (
    <div className="min-h-[100dvh] pt-28 pb-12 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">Library Modules</h1>
          <p className="text-gray-400 mt-2">Explore all available culture and language topics.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => {
            const catWords = words.filter((w) => w.categoryId === cat.id)
            const catLearned = catWords.filter((w) => stats.learnedWordIds.includes(w.id)).length
            const pct = Math.round((catLearned / catWords.length) * 100) || 0
            const isDone = catLearned === catWords.length && catWords.length > 0

            return (
              <motion.div 
                key={cat.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }} 
                className="content-card flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Module 0{idx + 1}</span>
                    <h2 className="text-2xl font-bold text-white mt-1">{cat.nameKk}</h2>
                  </div>
                  {isDone && (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded border border-emerald-500/30 backdrop-blur-md">
                      Completed
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 text-sm mb-6 flex-1">{cat.descriptionKk}</p>

                <div className="mb-6">
                  <div className="flex justify-between text-sm font-medium text-gray-300 mb-2">
                    <span>Progress</span>
                    <span className="text-white">{catLearned} / {catWords.length} words</span>
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${pct}%` }} 
                      transition={{ duration: 0.8 }} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                  <Link to={`/flashcards/${cat.id}`} className="btn-primary-glass text-sm py-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Study
                  </Link>
                  <Link to={`/quiz/${cat.id}`} className="btn-glass text-sm py-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Quiz
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
