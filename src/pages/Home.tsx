import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { categories, words } from '../data/words'

export default function Home() {
  const stats = useStore((s) => s.stats)
  const totalWords = words.length
  const learnedCount = stats.learnedWordIds.length

  return (
    <div className="min-h-[100dvh] pt-28 pb-32 md:pb-12 px-6 relative">
      <div className="bg-shape-emerald" /> {/* Подсветка фона */}
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back. Here's your language progress overview.</p>
        </header>

        {/* Главные метрики (AetherUI style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="content-card">
            <h2 className="text-lg font-semibold text-white">Words Mastered</h2>
            <p className="text-4xl font-bold mt-2 text-indigo-400">{learnedCount} <span className="text-lg text-gray-500">/ {totalWords}</span></p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="content-card">
            <h2 className="text-lg font-semibold text-white">Total Experience</h2>
            <p className="text-4xl font-bold mt-2 text-pink-400">{stats.xp} <span className="text-lg text-gray-500">XP</span></p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="content-card">
            <h2 className="text-lg font-semibold text-white">Current Streak</h2>
            <p className="text-4xl font-bold mt-2 text-emerald-400">{stats.streak} <span className="text-lg text-gray-500">Days</span></p>
          </motion.div>
        </div>

        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white">Library Modules</h2>
            <p className="text-gray-400 mt-1">Select a category to start learning.</p>
          </div>
        </div>

        {/* Сетка Категорий */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const catWords = words.filter((w) => w.categoryId === cat.id)
            const catLearned = catWords.filter((w) => stats.learnedWordIds.includes(w.id)).length
            
            return (
              <motion.div key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + idx * 0.1 }}>
                <Link to={`/flashcards/${cat.id}`} className="content-card flex flex-col h-full group block">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">{cat.nameKk}</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-white/10 text-gray-300 rounded border border-white/5">Module 0{idx + 1}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6 flex-1">{cat.descriptionKk}</p>
                  
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm text-gray-300">Progress: <span className="text-white font-bold">{catLearned}/{catWords.length}</span></span>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
