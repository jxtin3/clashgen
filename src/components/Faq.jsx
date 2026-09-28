import { ChevronDown } from 'lucide-react'

const QUESTIONS = [
    { q: 'What is ClashGen?', a: 'A free tool that turns text into a wall design you can rebuild in Clash of Clans.' },
    { q: 'Can I copy the design straight into the game?', a: 'Not yet. Copy Link shares your design on ClashGen so anyone can open the same one.' },
    { q: 'Will every design fit my Town Hall level?', a: 'The tool warns you when a design needs more walls than your Town Hall allows.' },
]

export default function Faq() {
    return (
        <section className="mt-14">
            <h2 className="text-xl font-semibold text-fg">Frequently asked questions</h2>
            <div className="mt-4 space-y-3">
                {QUESTIONS.map((item) => (
                    <details key={item.q} className="group rounded-xl border border-line bg-surface p-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-fg">
                            {item.q}
                            <ChevronDown size={18} className="shrink-0 text-subtle transition group-open:rotate-180" />
                        </summary>
                        <p className="mt-3 text-muted">{item.a}</p>
                    </details>
                ))}
            </div>

            <h2 className="mt-12 text-xl font-semibold text-fg">Feedback</h2>
            <p className="mt-2 text-muted">The feedback form comes in Phase 5.</p>
        </section>
    )
}