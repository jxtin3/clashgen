import { useEffect, useState } from 'react'
import { textToWalls } from '../lib/textToWalls'

export default function useWalls(text, font) {
    const [walls, setWalls] = useState([])

    useEffect(() => {
        let cancelled = false
        const timer = setTimeout(async () => {
            const result = await textToWalls(text, font)
            if (!cancelled) setWalls(result)
        }, 120) // small delay so we don't redraw on every key press
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [text, font])

    return walls
}