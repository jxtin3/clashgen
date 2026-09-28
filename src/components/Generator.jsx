import { Download, Link2, SlidersHorizontal, X } from 'lucide-react'
import Preview from './Preview'
import EditPanel from './EditPanel'

export default function Generator({ settings, update, walls, zoom, limit, level, editOpen, setEditOpen }) {
    const over = walls.length > limit
    const percent = Math.min(100, (walls.length / limit) * 100)

    return (
        <section className="mt-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-6">
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
                        {walls.length - limit} walls over the limit for TH{settings.th}. Try shorter text or a higher Town Hall.
                    </p>
                )}
                {!over && zoom < 1 && walls.length > 0 && (
                    <p className="mt-2 text-sm text-subtle">
                        Text scaled to {Math.round(zoom * 100)}% to fit the wall limit.
                        {zoom < 0.5 && ' It is very small, so try shorter text.'}
                    </p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <button className="btn-primary flex h-12 items-center justify-center gap-2 rounded-xl font-semibold">
                        <Link2 size={18} strokeWidth={2} /> Copy Link
                    </button>
                    <button className="btn-secondary flex h-12 items-center justify-center gap-2 rounded-xl font-semibold">
                        <Download size={18} strokeWidth={2} /> Save PNG
                    </button>
                </div>
            </div>

            {/* Dim area behind the drawer (mobile). Tap to close. */}
            {editOpen && (
                <div className="fixed inset-0 z-30 bg-black/25 lg:hidden" onClick={() => setEditOpen(false)} />
            )}

            {/* RIGHT: edit panel (drawer on mobile, normal card on desktop) */}
            <aside
                className={`fixed inset-y-0 right-0 z-40 flex w-[88%] max-w-sm flex-col bg-surface shadow-2xl transition-transform duration-200
        ${editOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:rounded-2xl lg:border lg:border-line lg:shadow-sm`}
            >
                <div className="flex items-center justify-between border-b border-line p-4">
                    <div>
                        <h2 className="text-lg font-semibold text-fg">Edit design</h2>
                        <p className={`text-sm ${over ? 'font-medium text-danger' : 'text-subtle'}`}>
                            {walls.length} / {limit} walls
                        </p>
                    </div>
                    <button
                        onClick={() => setEditOpen(false)}
                        aria-label="Close editor"
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition hover:bg-sunken hover:text-fg active:scale-90 lg:hidden"
                    >
                        <X size={20} strokeWidth={1.75} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <EditPanel settings={settings} update={update} />
                </div>

                <div className="border-t border-line p-4 lg:hidden">
                    <button
                        onClick={() => setEditOpen(false)}
                        className="btn-primary h-12 w-full rounded-xl font-semibold"
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