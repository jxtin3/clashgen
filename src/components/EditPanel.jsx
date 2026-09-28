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

            <Group label="Town Hall">
                <div className="grid grid-cols-4 gap-2">
                    {Object.entries(WALL_LIMITS).map(([th, walls]) => (
                        <button
                            key={th}
                            aria-pressed={settings.th === Number(th)}
                            onClick={() => update({ th: Number(th) })}
                            className={`${chip(settings.th === Number(th))} py-2 text-center`}
                        >
                            <span className="block text-sm font-semibold text-fg">TH{th}</span>
                            <span className="block text-xs text-subtle">{walls}</span>
                        </button>
                    ))}
                </div>
                <p className="mt-2 text-sm text-subtle">The small number is the wall limit.</p>
            </Group>
        </div>
    )
}