import { Moon, Sun } from 'lucide-react'

export default function Header({ dark, onToggle }) {
    return (
        <header className="sticky top-0 z-20 border-b border-line bg-page/85 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <a href="/" aria-label="ClashGen home">
                    <img src="/logo.png" alt="ClashGen" className="h-9 w-auto" />
                </a>
                <button
                    onClick={onToggle}
                    aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:text-fg"
                >
                    {dark ? <Sun size={20} strokeWidth={1.75} /> : <Moon size={20} strokeWidth={1.75} />}
                </button>
            </div>
        </header>
    )
}