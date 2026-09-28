import { Download, Link2, SlidersHorizontal, X } from 'lucide-react'

export default function Generator({ editOpen, setEditOpen }) {
    return (
        <section className="mt-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-6">
            {/* LEFT: preview card */}
            <div className="rounded-2xl border border-line bg-surface p-3 shadow-sm sm:p-4">
                <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-sunken text-sm text-subtle">
                    Preview area
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                    <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-accent-fg transition hover:opacity-90">
                        <Link2 size={18} strokeWidth={2} /> Copy Link
                    </button>
                    <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface font-semibold text-fg transition hover:bg-sunken">
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
                    <h2 className="text-lg font-semibold text-fg">Edit design</h2>
                    <button
                        onClick={() => setEditOpen(false)}
                        aria-label="Close editor"
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition hover:bg-sunken hover:text-fg lg:hidden"
                    >
                        <X size={20} strokeWidth={1.75} />
                    </button>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto p-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-subtle">Text</label>
                        <input
                            disabled
                            placeholder="Type your name…"
                            className="mt-2 h-12 w-full rounded-xl bg-sunken px-4 text-fg placeholder:text-subtle"
                        />
                    </div>
                    <p className="text-sm text-subtle">Font, Town Hall and the other controls come in Phase 2.</p>
                </div>

                <div className="border-t border-line p-4 lg:hidden">
                    <button
                        onClick={() => setEditOpen(false)}
                        className="h-12 w-full rounded-xl bg-accent font-semibold text-accent-fg"
                    >
                        Done
                    </button>
                </div>
            </aside>

            {/* Floating Edit button (mobile) */}
            {!editOpen && (
                <button
                    onClick={() => setEditOpen(true)}
                    className="fixed bottom-5 right-5 z-20 flex h-14 items-center gap-2 rounded-full bg-fg px-6 font-semibold text-page shadow-lg lg:hidden"
                >
                    <SlidersHorizontal size={20} strokeWidth={2} /> Edit
                </button>
            )}
        </section>
    )
}