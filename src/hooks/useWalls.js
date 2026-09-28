import { useEffect, useState } from 'react'
import { textToWalls } from '../lib/textToWalls'

export default function useWalls(text, font, limit, t) {
    const [result, setResult] = useState({ walls: [], zoom: 1 })

    useEffect(() => {
        let cancelled = false
        const timer = setTimeout(async () => {
            const r = await textToWalls(text, font, limit, {
                zoom: t.zoom,
                rotation: t.rotation,
                sharpness: t.sharpness,
                x: t.x,
                y: t.y,
            })
            if (!cancelled) setResult(r)
        }, 120)
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [text, font, limit, t.zoom, t.rotation, t.sharpness, t.x, t.y])

    return result
}