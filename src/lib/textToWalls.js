export const BOARD = 44          // the village is 44 x 44 tiles
const RES = 8                    // pixels per tile in the hidden text image
const VIEW = 64                  // the hidden image covers 64 x 64 tiles
const TARGET_WIDTH = 56          // text may be this many tiles wide
const MAX_EM = 16                // biggest letter size, in tiles
const SHARPNESS = 0.4            // how much of a tile the text must cover to become a wall
const S = Math.SQRT1_2

export async function textToWalls(text, font) {
    const clean = text.trim()
    if (!clean) return []

    // make sure the font is really loaded before we draw with it
    await document.fonts.load(`${font.weight} 100px "${font.family}"`)

    const size = VIEW * RES
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const fontString = (px) => `${font.weight} ${px}px "${font.family}"`

    // 1. find a letter size that makes the text fit
    ctx.font = fontString(100)
    const widthAt100 = ctx.measureText(clean).width
    const em = Math.min((TARGET_WIDTH * 100) / widthAt100, MAX_EM)

    // 2. draw the text in the middle of the hidden image
    ctx.font = fontString(em * RES)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    const m = ctx.measureText(clean)
    const mid = size / 2
    const baseline = mid + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2
    ctx.fillStyle = '#000'
    ctx.fillText(clean, mid, baseline)
    const data = ctx.getImageData(0, 0, size, size).data

    // 3. check every tile: is it covered by the text?
    const walls = []
    const half = BOARD / 2
    const offsets = [-1 / 3, 0, 1 / 3]
    for (let j = 0; j < BOARD; j++) {
        for (let i = 0; i < BOARD; i++) {
            let hits = 0
            for (const oy of offsets) {
                for (const ox of offsets) {
                    const dx = i + 0.5 + ox - half
                    const dy = j + 0.5 + oy - half
                    // turn the tile 45 degrees, like the in-game diamond view
                    const px = Math.round(mid + (dx - dy) * S * RES)
                    const py = Math.round(mid + (dx + dy) * S * RES)
                    if (px < 0 || py < 0 || px >= size || py >= size) continue
                    if (data[(py * size + px) * 4 + 3] > 128) hits++
                }
            }
            if (hits / 9 >= SHARPNESS) walls.push([i, j])
        }
    }
    return walls
}