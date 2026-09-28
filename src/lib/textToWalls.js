export const BOARD = 44            // the village is 44 x 44 tiles
const BUILD_MARGIN = 2             // outer tiles where walls can't go (please check in the game)
const RATIO = 0.75                 // tile height / tile width in the game view
const RES = 10                     // pixels per unit in the hidden text image
const VIEW_W = 96                  // hidden image size, in units
const VIEW_H = 72
const FIT_W = 0.84 * 88            // auto size: text uses 84% of the village width
const MAX_H = 0.4 * 66             // and 40% of its height
const MIN_ZOOM = 0.3               // smallest the text may shrink to

// zoom: null = auto fit to the wall limit
export const DEFAULT_TRANSFORM = { zoom: null, rotation: 0, sharpness: 50, x: 0, y: 0 }

export async function textToWalls(text, font, limit, t = DEFAULT_TRANSFORM) {
    const clean = text.trim()
    if (!clean) return { walls: [], zoom: 1 }

    await document.fonts.load(`${font.weight} 100px "${font.family}"`)

    const w = VIEW_W * RES
    const h = VIEW_H * RES
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const fontString = (px) => `${font.weight} ${px}px "${font.family}"`

    // 1. find a letter size that fits the village
    ctx.font = fontString(100)
    const m100 = ctx.measureText(clean)
    const h100 = m100.actualBoundingBoxAscent + m100.actualBoundingBoxDescent
    const em = Math.min((FIT_W * 100) / m100.width, (MAX_H * 100) / h100)

    // 2. draw the text in the middle
    ctx.font = fontString(em * RES)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    const m = ctx.measureText(clean)
    const midX = w / 2
    const midY = h / 2
    ctx.fillStyle = '#000'
    ctx.fillText(clean, midX, midY + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2)
    const data = ctx.getImageData(0, 0, w, h).data

    // 3. list every tile covered by the text
    const threshold = 0.1 + (t.sharpness / 100) * 0.6   // higher sharpness = thinner letters
    const rad = (t.rotation * Math.PI) / 180
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    const offsets = [-1 / 3, 0, 1 / 3]

    const collect = (zoom) => {
        const list = []
        for (let j = BUILD_MARGIN; j < BOARD - BUILD_MARGIN; j++) {
            for (let i = BUILD_MARGIN; i < BOARD - BUILD_MARGIN; i++) {
                let hits = 0
                for (const oy of offsets) {
                    for (const ox of offsets) {
                        const dx = i + 0.5 + ox - BOARD / 2
                        const dy = j + 0.5 + oy - BOARD / 2
                        // where this tile is on the screen, moved by the offset
                        const sx = dx - dy - t.x
                        const sy = (dx + dy) * RATIO - t.y
                        // turn and scale to find the matching spot in the text image
                        const bx = (sx * cos + sy * sin) / zoom
                        const by = (-sx * sin + sy * cos) / zoom
                        const px = Math.round(midX + bx * RES)
                        const py = Math.round(midY + by * RES)
                        if (px < 0 || py < 0 || px >= w || py >= h) continue
                        if (data[(py * w + px) * 4 + 3] > 128) hits++
                    }
                }
                if (hits / 9 >= threshold) list.push([i, j])
            }
        }
        return list
    }

    // the person chose a zoom: use it exactly
    if (t.zoom != null) return { walls: collect(t.zoom), zoom: t.zoom }

    // auto: shrink the text until it fits the wall limit
    let zoom = 1
    let walls = collect(1)
    if (walls.length > limit) {
        let lo = MIN_ZOOM
        let hi = 1
        for (let n = 0; n < 9; n++) {
            const mid = (lo + hi) / 2
            if (collect(mid).length <= limit) lo = mid
            else hi = mid
        }
        zoom = lo
        walls = collect(lo)
    }
    return { walls, zoom }
}