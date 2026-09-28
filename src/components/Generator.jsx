import { useEffect, useState } from 'react'
import {
    Check,
    Download,
    ExternalLink,
    Link2,
    SlidersHorizontal,
    X,
} from 'lucide-react'
import Preview from './Preview'
import EditPanel from './EditPanel'
import { exportPng } from '../lib/exportPng'
import { buildShareUrl } from '../lib/settings'
import { copyText } from '../lib/copyText'
import { getClashLayoutUrl } from '../lib/clashLayout'


export default function Generator({ settings, update, walls, zoom, limit, level, editOpen, setEditOpen }) {
    const [saving, setSaving] = useState(false)
    const [copyState, setCopyState] = useState('idle') // idle | ok | fail
    const over = walls.length > limit
    const percent = Math.min(100, (walls.length / limit) * 100)

    // Phone drawer: lock the page behind it, and let Esc close it
    useEffect(() => {
        if (!editOpen) return
        const isPhone = window.matchMedia('(max-width: 1023px)').matches
        const onKey = (e) => e.key === 'Escape' && setEditOpen(false)
        window.addEventListener('keydown', onKey)
        if (isPhone) document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [editOpen, setEditOpen])

    const copyLink = async () => {
        const ok = await copyText(buildShareUrl(settings))
        setCopyState(ok ? 'ok' : 'fail')
        setTimeout(() => setCopyState('idle'), 2200)
    }

    const openInClash = () => {
        const url = getClashLayoutUrl({
            th: settings.th,
            type: 'HV',
        })

        if (!url) return

        window.location.href = url
    }

    const savePng = async () => {
        if (!walls.length || saving) return
        setSaving(true)
        try {
            await exportPng({
                walls,
                sceneId: settings.sceneId,
                level,
                name: settings.text,
                th: settings.th,
            })
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    return (
        <section className="mt-8 lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-6">
            {/* LEFT: preview card */}
            <div className="reveal rounded-2xl border border-line bg-surface p-3 shadow-sm sm:p-4">
                <Preview
                    walls={walls}
                    sceneId={settings.sceneId}
                    level={level}
                    empty={!settings.text.trim()}
                />

                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-medium text-fg">Walls</span>
                    <span className={over ? 'font-semibold text-danger' : 'text-muted'}>
                        {walls.length} / {limit}
                    </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-sunken">
                    <div
                        className={`h-2 rounded-full transition-all ${over ? 'bg-danger' : 'bg-accent'}`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
                {over && (
                    <p className="mt-2 text-sm text-danger">
                        {walls.length - limit} walls over the limit for TH{settings.th}. Try zooming out, shorter text or a higher Town Hall.
                    </p>
                )}
                {!over && settings.zoom === null && zoom < 1 && walls.length > 0 && (
                    <p className="mt-2 text-sm text-subtle">
                        Text scaled to {Math.round(zoom * 100)}% to fit the wall limit.
                        {zoom < 0.5 && ' It is very small, so try shorter text.'}
                    </p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                        onClick={copyLink}
                        className="btn-primary flex h-12 items-center justify-center gap-2 rounded-xl font-semibold"
                    >
                        {copyState === 'ok' ? (
                            <Check size={18} strokeWidth={2.5} />
                        ) : (
                            <Link2 size={18} strokeWidth={2} />
                        )}

                        {copyState === 'ok'
                            ? 'Copied!'
                            : copyState === 'fail'
                                ? 'Copy failed'
                                : 'Copy Link'}
                    </button>

                    <button
                        onClick={openInClash}
                        disabled={!getClashLayoutUrl({ th: settings.th, type: 'HV' })}
                        className="btn-secondary flex h-12 items-center justify-center gap-2 rounded-xl font-semibold disabled:pointer-events-none disabled:opacity-50"
                    >
                        <ExternalLink size={18} strokeWidth={2} />
                        Open in Clash
                    </button>
                </div>

                <div className="mt-3">
                    <button
                        onClick={savePng}
                        disabled={!walls.length || saving}
                        className="btn-secondary flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold disabled:pointer-events-none disabled:opacity-50"
                    >
                        <Download size={18} strokeWidth={2} />
                        {saving ? 'Saving…' : 'Save PNG'}
                    </button>
                </div>

                <span className="sr-only" role="status">
                    {copyState === 'ok' ? 'Link copied' : ''}
                </span>
            </div>

            {/* Dim area behind the drawer (mobile). Tap to close. */}
            {editOpen && (
                <div className="fixed inset-0 z-30 bg-black/25 lg:hidden" onClick={() => setEditOpen(false)} />
            )}

            {/* RIGHT: edit panel (drawer on mobile, sticky card on desktop) */}
            <aside
                className={`fixed right-0 top-0 z-40 flex h-dvh w-[88%] max-w-sm flex-col bg-surface shadow-2xl transition-transform duration-200
        ${editOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:sticky lg:right-auto lg:top-20 lg:z-auto lg:h-auto lg:max-h-[calc(100dvh-6rem)] lg:w-auto lg:max-w-none lg:translate-x-0 lg:rounded-2xl lg:border lg:border-line lg:shadow-sm`}
            >
                <div className="flex shrink-0 items-center justify-between px-4 pt-3">
                    <div>
                        <h2 className="text-base font-semibold text-fg">Edit design</h2>
                        <p className={`text-xs ${over ? 'font-medium text-danger' : 'text-subtle'}`}>
                            {walls.length} / {limit} walls
                        </p>
                    </div>
                    <button
                        onClick={() => setEditOpen(false)}
                        aria-label="Close editor"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition hover:bg-sunken hover:text-fg active:scale-90 lg:hidden"
                    >
                        <X size={20} strokeWidth={1.75} />
                    </button>
                </div>

                <EditPanel settings={settings} update={update} zoom={zoom} />

                <div className="shrink-0 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden">
                    <button
                        onClick={() => setEditOpen(false)}
                        className="btn-primary h-11 w-full rounded-xl text-sm font-semibold"
                    >
                        Done
                    </button>
                </div>
            </aside>

            {/* Floating Edit button (mobile) */}
            {!editOpen && (
                <button
                    onClick={() => setEditOpen(true)}
                    className="fixed bottom-5 right-5 z-20 flex h-14 items-center gap-2 rounded-full bg-fg px-6 font-semibold text-page shadow-lg transition active:scale-95 lg:hidden"
                >
                    <SlidersHorizontal size={20} strokeWidth={2} /> Edit
                </button>
            )}
        </section>
    )
}