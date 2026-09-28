import { BOARD } from './textToWalls'
import { SCENES, SCENE_W, SCENE_H } from './scenes'

const SPRITE_PX_PER_TILE = 70   // bigger number = smaller walls
const FOOT = 0.25               // moves walls down (+) or up (-), in tile heights

const cache = {}
export function loadImage(src) {
    if (!cache[src]) {
        cache[src] = new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = () => {
                delete cache[src]
                reject(new Error(`Could not load ${src}`))
            }
            img.src = src
        })
    }
    return cache[src]
}

export async function loadAssets(sceneId, level) {
    const scene = SCENES[sceneId]
    const [bg, sprite] = await Promise.all([
        loadImage(scene.src),
        loadImage(`/walls/wall-${level}.webp`),
    ])
    return { scene, bg, sprite }
}

export function drawScene(ctx, width, { scene, bg, sprite }, walls) {
    const height = (width * SCENE_H) / SCENE_W
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bg, 0, 0, width, height)

    // where each tile is on the picture
    const s = width / SCENE_W
    const [tx, ty] = scene.top
    const exX = ((scene.right[0] - tx) / BOARD) * s
    const exY = ((scene.right[1] - ty) / BOARD) * s
    const eyX = ((scene.left[0] - tx) / BOARD) * s
    const eyY = ((scene.left[1] - ty) / BOARD) * s
    const tileH = 2 * exY
    const k = (2 * exX) / SPRITE_PX_PER_TILE
    const dw = sprite.naturalWidth * k
    const dh = sprite.naturalHeight * k

    // draw from the back of the village to the front
    const sorted = [...walls].sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
    for (const [i, j] of sorted) {
        const x = tx * s + (i + 0.5) * exX + (j + 0.5) * eyX
        const y = ty * s + (i + 0.5) * exY + (j + 0.5) * eyY
        ctx.drawImage(sprite, x - dw / 2, y + FOOT * tileH - dh, dw, dh)
    }
}