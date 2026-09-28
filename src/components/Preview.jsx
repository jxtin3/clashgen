import { useEffect, useRef } from 'react'
import { SCENE_W, SCENE_H } from '../lib/scenes'
import { loadAssets, drawScene } from '../lib/drawScene'

export default function Preview({ walls, sceneId, level, empty }) {
    const ref = useRef(null)

    useEffect(() => {
        let cancelled = false
        const canvas = ref.current

        const draw = async () => {
            const assets = await loadAssets(sceneId, level)
            if (cancelled) return
            const cw = canvas.clientWidth
            if (!cw) return
            const ch = (cw * SCENE_H) / SCENE_W
            const dpr = window.devicePixelRatio || 1
            canvas.width = Math.round(cw * dpr)
            canvas.height = Math.round(ch * dpr)
            const ctx = canvas.getContext('2d')
            ctx.scale(dpr, dpr)
            drawScene(ctx, cw, assets, walls)
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