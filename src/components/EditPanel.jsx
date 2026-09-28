import { ChevronDown } from 'lucide-react'
import { FONTS } from '../lib/fonts'
import { WALL_LIMITS } from '../lib/limits'

const chip = (active) =>
    `rounded-xl border transition ${active ? 'border-accent bg-accent/10' : 'border-line bg-surface hover:bg-sunken'
    }`

function Group({ label, children }) {
    return (
        <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-subtle">{label}</h3>
            <div className="mt-2">{children}</div>
        </div>
    )
}

export default function EditPanel({ settings, update }) {
    const font = FONTS.find((f) => f.id === settings.fontId)

    return (
        <div className="space-y-6">
            <Group label="Town Hall">
                <div className="relative">
                    <select
                        value={settings.th}
                        onChange={(e) => update({ th: Number(e.target.value) })}
                        className="h-12 w-full appearance-none rounded-xl border border-transparent bg-sunken px-4 pr-11 text-base font-medium text-fg focus:border-accent focus:outline-none"
                    >
                        {Object.entries(WALL_LIMITS).map(([th, walls]) => (
                            <option key={th} value={th}>
                                TH{th} ({walls} walls)
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-subtle"
                    />
                </div>
                <p className="mt-2 text-sm text-subtle">The number in brackets is the wall limit.</p>
            </Group>

            <Group label="Text">
                <input
                    type="text"
                    value={settings.text}
                    maxLength={20}
                    autoComplete="off"
                    onChange={(e) => update({ text: e.target.value })}
                    placeholder="Type your name…"
                    className="h-12 w-full rounded-xl border border-transparent bg-sunken px-4 text-base text-fg placeholder:text-subtle focus:border-accent focus:outline-none"
                />
            </Group>

            <Group label="Font">
                <div className="grid grid-cols-2 gap-2">
                    {FONTS.map((f) => (
                        <button
                            key={f.id}
                            aria-pressed={settings.fontId === f.id}
                            onClick={() => update({ fontId: f.id })}
                            style={{ fontFamily: `"${f.family}"`, fontWeight: f.weight }}
                            className={`${chip(settings.fontId === f.id)} h-12 px-3 text-lg text-fg`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                {font.note && <p className="mt-2 text-sm text-subtle">{font.note}</p>}
            </Group>
        </div>
    )
}