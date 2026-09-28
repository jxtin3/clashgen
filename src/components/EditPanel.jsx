import { useState } from 'react'
import { ChevronDown, Move, Palette, RotateCcw } from 'lucide-react'
import { SCENES } from '../lib/scenes'
import { FONTS } from '../lib/fonts'
import { WALL_LIMITS } from '../lib/limits'
import { DEFAULT_TRANSFORM } from '../lib/textToWalls'

const chip = (active) =>
    `rounded-lg border transition hover:-translate-y-px active:scale-[0.97] ${active ? 'border-accent bg-accent/10' : 'border-line bg-surface hover:bg-sunken'
    }`

// 16px on phones (stops iPhone auto-zoom), smaller on desktop
const field =
    'h-10 w-full rounded-lg border border-transparent bg-sunken px-3 text-[16px] text-fg placeholder:text-subtle focus:border-accent focus:outline-none lg:text-sm'

const TABS = [
    { id: 'design', label: 'Design', Icon: Palette },
    { id: 'transform', label: 'Transform', Icon: Move },
]

function Group({ label, children }) {
    return (
        <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-subtle">{label}</h3>
            <div className="mt-1.5">{children}</div>
        </div>
    )
}

function Slider({ label, value, min, max, unit = '', hint, extra, onChange }) {
    const pct = ((value - min) / (max - min)) * 100
    return (
        <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 text-[13px]">
                <span className="font-medium text-fg">{label}</span>
                <span className="flex items-center gap-2 text-muted">
                    {extra}
                    {value}
                    {unit}
                </span>
            </div>
            <input
                type="range"
                className="slider mt-0.5"
                min={min}
                max={max}
                step={1}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{ '--pct': `${pct}%` }}
            />
            {hint && <p className="text-[11px] text-subtle">{hint}</p>}
        </div>
    )
}

function DesignTab({ settings, update }) {
    const font = FONTS.find((f) => f.id === settings.fontId)

    return (
        <div className="space-y-5">
            <Group label="Town Hall">
                <div className="relative">
                    <select
                        value={settings.th}
                        onChange={(e) => update({ th: Number(e.target.value) })}
                        className={`${field} appearance-none pr-9 font-medium`}
                    >
                        {Object.entries(WALL_LIMITS).map(([th, walls]) => (
                            <option key={th} value={th}>
                                TH{th} ({walls} walls)
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-subtle"
                    />
                </div>
            </Group>

            <Group label="Text">
                <input
                    type="text"
                    value={settings.text}
                    maxLength={20}
                    autoComplete="off"
                    onChange={(e) => update({ text: e.target.value })}
                    placeholder="Type your name…"
                    className={field}
                />
            </Group>

            <Group label="Font">
                <div className="grid grid-cols-2 gap-1.5">
                    {FONTS.map((f) => (
                        <button
                            key={f.id}
                            aria-pressed={settings.fontId === f.id}
                            onClick={() => update({ fontId: f.id })}
                            style={{ fontFamily: `"${f.family}"`, fontWeight: f.weight }}
                            className={`${chip(settings.fontId === f.id)} h-10 px-2 text-base text-fg`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                {font.note && <p className="mt-1.5 text-xs text-subtle">{font.note}</p>}
            </Group>

            <Group label="Background">
                <div className="grid grid-cols-2 gap-1.5">
                    {Object.values(SCENES).map((s) => (
                        <button
                            key={s.id}
                            aria-pressed={settings.sceneId === s.id}
                            onClick={() => update({ sceneId: s.id })}
                            className={`${chip(settings.sceneId === s.id)} h-10 px-2 text-sm font-medium text-fg`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </Group>
        </div>
    )
}

function TransformTab({ settings, update, zoom }) {
    const autoZoom = settings.zoom === null

    return (
        <div className="space-y-4">
            <Slider
                label="Rotation"
                value={settings.rotation}
                min={-90}
                max={90}
                unit="°"
                onChange={(v) => update({ rotation: v })}
            />
            <Slider
                label="Zoom"
                value={Math.round(zoom * 100)}
                min={30}
                max={250}
                unit="%"
                onChange={(v) => update({ zoom: v / 100 })}
                extra={
                    autoZoom ? (
                        <span className="text-[11px] text-subtle">auto</span>
                    ) : (
                        <button
                            onClick={() => update({ zoom: null })}
                            className="text-[11px] font-semibold text-accent"
                        >
                            Auto fit
                        </button>
                    )
                }
            />
            <Slider
                label="Sharpness"
                value={settings.sharpness}
                min={0}
                max={100}
                hint="Higher = thinner letters and fewer walls."
                onChange={(v) => update({ sharpness: v })}
            />
            <div className="grid grid-cols-2 gap-4">
                <Slider
                    label="X offset"
                    value={settings.x}
                    min={-44}
                    max={44}
                    onChange={(v) => update({ x: v })}
                />
                <Slider
                    label="Y offset"
                    value={settings.y}
                    min={-33}
                    max={33}
                    onChange={(v) => update({ y: v })}
                />
            </div>
            <button
                onClick={() => update(DEFAULT_TRANSFORM)}
                className="btn-secondary flex h-9 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold"
            >
                <RotateCcw size={15} strokeWidth={2} /> Reset
            </button>
        </div>
    )
}

export default function EditPanel({ settings, update, zoom }) {
    const [tab, setTab] = useState('design')

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            {/* tabs stay in place, content scrolls under them */}
            <div className="shrink-0 px-4 pt-3">
                <div role="tablist" className="grid grid-cols-2 gap-1 rounded-xl bg-sunken p-1">
                    {TABS.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            role="tab"
                            aria-selected={tab === id}
                            onClick={() => setTab(id)}
                            className={`flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition active:scale-[0.97] ${tab === id ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg'
                                }`}
                        >
                            <Icon size={16} strokeWidth={2} /> {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
                {tab === 'design' ? (
                    <DesignTab settings={settings} update={update} />
                ) : (
                    <TransformTab settings={settings} update={update} zoom={zoom} />
                )}
            </div>
        </div>
    )
}