import { useState } from 'react'
import useDarkMode from './hooks/useDarkMode'
import Header from './components/Header'
import Intro from './components/Intro'
import Generator from './components/Generator'
import Faq from './components/Faq'
import Footer from './components/Footer'

export default function App() {
  const [dark, toggleDark] = useDarkMode()
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="min-h-screen bg-page font-sans text-fg">
      <Header dark={dark} onToggle={toggleDark} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Intro />
        <Generator editOpen={editOpen} setEditOpen={setEditOpen} />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}