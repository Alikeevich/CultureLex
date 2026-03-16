import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import Home from './pages/Home'
import Categories from './pages/Categories'
import Flashcards from './pages/Flashcards'
import Quiz from './pages/Quiz'
import Progress from './pages/Progress'
import Achievements from './pages/Achievements'

export default function App() {
  return (
    <BrowserRouter>
      {/* Глобальная изумрудная сфера для подсветки по центру */}
      <div className="bg-shape-emerald" />
      
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/flashcards/:categoryId" element={<Flashcards />} />
        <Route path="/quiz/:categoryId" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/achievements" element={<Achievements />} />
      </Routes>
    </BrowserRouter>
  )
}
