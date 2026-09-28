import { useState } from 'react'
import useDarkMode from './hooks/useDarkMode'
import useWalls from './hooks/useWalls'
import { FONTS } from './lib/fonts'
import { WALL_LIMITS } from './lib/limits'
import Header from './components/Header'
import Intro from './components/Intro'
import Generator from './components/Generator'
import Faq from './components/Faq'
import Footer from './components/Footer'

export default function App() {
  const [dark, toggleDark] = useDarkMode()
  const [editOpen, setEditOpen] = useState(false)
  const [settings, setSettings] = useState({ text: 'CLASH', fontId: 'anton', th: 15 })

  const update = (patch) => setSettings((s) => ({ ...s, ...patch }))
  const font = FONTS.find((f) => f.id === settings.fontId)
  const walls = useWalls(settings.text, font)
  const limit = WALL_LIMITS[settings.th]

  return (
    <div className="min-h-screen bg-page font-sans text-fg">
      <Header dark={dark} onToggle={toggleDark} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Intro />
        <Generator
          dark={dark}
          settings={settings}
          update={update}
          walls={walls}
          limit={limit}
          editOpen={editOpen}
          setEditOpen={setEditOpen}
        />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}