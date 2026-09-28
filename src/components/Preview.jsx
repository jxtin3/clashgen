import { useEffect, useRef } from 'react'
import { BOARD } from '../lib/textToWalls'
import { SCENES, SCENE_W, SCENE_H } from '../lib/scenes'

const SPRITE_PX_PER_TILE = 70   // a wall picture this wide fills one tile (bigger number = smaller walls)
const FOOT = 0.25               // moves walls down (+) or up (-), in tile heights

const cache = {}
function loadImage(src) {
    if (!cache[src]) {
        cache[src] = new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = src
        })
    }
    return cache[src]
}

export default function Preview({ walls, sceneId, level, empty }) {
    const ref = useRef(null)

    useEffect(() => {
        let cancelled = false
        const canvas = ref.current
        const scene = SCENES[sceneId]

        const draw = async () => {
            const [bg, sprite] = await Promise.all([
                loadImage(scene.src),
                loadImage(`/walls/wall-${level}.webp`),
            ])
            if (cancelled) return
            const cw = canvas.clientWidth
            if (!cw) return
            const ch = (cw * SCENE_H) / SCENE_W
            const dpr = window.devicePixelRatio || 1
            canvas.width = Math.round(cw * dpr)
            canvas.height = Math.round(ch * dpr)
            const ctx = canvas.getContext('2d')
            ctx.scale(dpr, dpr)
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(bg, 0, 0, cw, ch)

            // where each tile is on the picture
            const s = cw / SCENE_W
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

        draw()
        const observer = new ResizeObserver(draw)
        observer.observe(canvas)
        return () => {
            cancelled = true
            observer.disconnect()
        }
    }, [walls, sceneId, level])

    return (
        <div className="relative">
            <canvas ref={ref} className="block aspect-[4/3] w-full rounded-xl bg-sunken" />
            {empty && (
                <p className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/25 text-sm font-medium text-white">
                    Type a name to start
                </p>
            )}
        </div>
    )
}