import { useEffect, useRef } from 'react'
import { BOARD } from '../lib/textToWalls'

const S = Math.SQRT1_2

export default function Preview({ walls, dark, empty }) {
    const ref = useRef(null)

    useEffect(() => {
        const canvas = ref.current
        const draw = () => {
            const size = canvas.clientWidth
            const dpr = window.devicePixelRatio || 1
            canvas.width = size * dpr
            canvas.height = size * dpr
            const ctx = canvas.getContext('2d')
            ctx.scale(dpr, dpr)

            const css = getComputedStyle(document.documentElement)
            const color = (name) => css.getPropertyValue(name).trim()

            const R = BOARD * S            // half of the diamond, in tiles
            const u = size / (2 * R + 2)   // pixels per tile
            const c = size / 2

            // the village (diamond)
            ctx.beginPath()
            ctx.moveTo(c, c - R * u)
            ctx.lineTo(c + R * u, c)
            ctx.lineTo(c, c + R * u)
            ctx.lineTo(c - R * u, c)
            ctx.closePath()
            ctx.fillStyle = color('--color-surface')
            ctx.fill()
            ctx.lineWidth = 1.5
            ctx.strokeStyle = color('--color-line')
            ctx.stroke()

            // the walls
            const h = S * u * 0.92
            ctx.fillStyle = color('--color-accent')
            for (const [i, j] of walls) {
                const dx = i + 0.5 - BOARD / 2
                const dy = j + 0.5 - BOARD / 2
                const x = c + (dx - dy) * S * u
                const y = c + (dx + dy) * S * u
                ctx.beginPath()
                ctx.moveTo(x, y - h)
                ctx.lineTo(x + h, y)
                ctx.lineTo(x, y + h)
                ctx.lineTo(x - h, y)
                ctx.closePath()
                ctx.fill()
            }
        }

        draw()
        const observer = new ResizeObserver(draw)
        observer.observe(canvas)
        return () => observer.disconnect()
    }, [walls, dark])

    return (
        <div className="relative">
            <canvas ref={ref} className="block aspect-square w-full rounded-xl bg-sunken" />
            {empty && (
                <p className="absolute inset-0 flex items-center justify-center text-sm text-subtle">
                    Type a name to start
                </p>
            )}
        </div>
    )
}