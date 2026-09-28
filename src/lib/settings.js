import { FONTS } from './fonts'
import { WALL_LIMITS } from './limits'
import { SCENES } from './scenes'
import { DEFAULT_TRANSFORM } from './textToWalls'

const KEY = 'clashgen:settings:v1'

export const DEFAULT_SETTINGS = {
    text: 'CLASH',
    fontId: 'clash-bold',
    th: 15,
    sceneId: 'classic',
    ...DEFAULT_TRANSFORM,
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const num = (v, fallback) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
}

// Turns anything (saved data or a link) into safe settings.
export function sanitize(raw = {}) {
    const d = DEFAULT_SETTINGS
    const th = Number(raw.th)
    return {
        text: typeof raw.text === 'string' ? raw.text.slice(0, 20) : d.text,
        fontId: FONTS.some((f) => f.id === raw.fontId) ? raw.fontId : d.fontId,
        th: WALL_LIMITS[th] ? th : d.th,
        sceneId: Object.hasOwn(SCENES, raw.sceneId) ? raw.sceneId : d.sceneId,
        zoom: raw.zoom == null ? null : clamp(num(raw.zoom, 1), 0.3, 2.5),
        rotation: clamp(Math.round(num(raw.rotation, d.rotation)), -90, 90),
        sharpness: clamp(Math.round(num(raw.sharpness, d.sharpness)), 0, 100),
        x: clamp(Math.round(num(raw.x, d.x)), -44, 44),
        y: clamp(Math.round(num(raw.y, d.y)), -33, 33),
    }
}

// The link that opens the same design.
export function buildShareUrl(s) {
    const d = DEFAULT_SETTINGS
    const p = new URLSearchParams()
    p.set('t', s.text)
    p.set('f', s.fontId)
    p.set('th', s.th)
    p.set('bg', s.sceneId)
    if (s.rotation !== d.rotation) p.set('r', s.rotation)
    if (s.zoom !== null) p.set('z', Math.round(s.zoom * 100))
    if (s.sharpness !== d.sharpness) p.set('s', s.sharpness)
    if (s.x !== d.x) p.set('x', s.x)
    if (s.y !== d.y) p.set('y', s.y)
    return `${window.location.origin}${window.location.pathname}?${p}`
}

// Order: a shared link first, then the saved design, then the defaults.
export function loadInitialSettings() {
    try {
        const p = new URLSearchParams(window.location.search)
        if (p.has('t')) {
            return sanitize({
                text: p.get('t'),
                fontId: p.get('f'),
                th: p.get('th'),
                sceneId: p.get('bg'),
                rotation: p.get('r'),
                zoom: p.has('z') ? num(p.get('z'), 100) / 100 : null,
                sharpness: p.get('s'),
                x: p.get('x'),
                y: p.get('y'),
            })
        }
    } catch {
        /* ignore and use the saved design */
    }
    try {
        const saved = localStorage.getItem(KEY)
        if (saved) return sanitize(JSON.parse(saved))
    } catch {
        /* ignore and use the defaults */
    }
    return DEFAULT_SETTINGS
}

export function saveSettings(s) {
    try {
        localStorage.setItem(KEY, JSON.stringify(s))
    } catch {
        /* storage can be blocked (private mode) */
    }
}

// Removes the ?t=... part from the address bar after a shared link is read,
// so a later refresh keeps your own edits instead of the link's design.
export function clearShareParams() {
    if (new URLSearchParams(window.location.search).has('t')) {
        window.history.replaceState(null, '', window.location.pathname)
    }
}