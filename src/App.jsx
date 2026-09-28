import { useEffect, useState } from 'react'
import useDarkMode from './hooks/useDarkMode'
import useWalls from './hooks/useWalls'
import { FONTS } from './lib/fonts'
import { WALL_LIMITS, WALL_LEVELS } from './lib/limits'
import { loadInitialSettings, saveSettings, clearShareParams } from './lib/settings'
import Header from './components/Header'
import Intro from './components/Intro'
import Generator from './components/Generator'
import Faq from './components/Faq'
import Footer from './components/Footer'

export default function App() {
  const [dark, toggleDark] = useDarkMode()
  const [editOpen, setEditOpen] = useState(false)
  const [settings, setSettings] = useState(loadInitialSettings)

  useEffect(() => {
    clearShareParams()
  }, [])

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const update = (patch) => setSettings((s) => ({ ...s, ...patch }))
  const font = FONTS.find((f) => f.id === settings.fontId)
  const limit = WALL_LIMITS[settings.th]
  const level = WALL_LEVELS[settings.th]
  const { walls, zoom } = useWalls(settings.text, font, limit, settings)

  return (
    <div className="min-h-screen bg-page font-sans text-fg">
      <Header dark={dark} onToggle={toggleDark} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Intro />
        <Generator
          settings={settings}
          update={update}
          walls={walls}
          zoom={zoom}
          limit={limit}
          level={level}
          editOpen={editOpen}
          setEditOpen={setEditOpen}
        />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}