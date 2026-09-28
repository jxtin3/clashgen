import { useEffect, useState } from 'react'
import { textToWalls } from '../lib/textToWalls'

export default function useWalls(text, font, limit) {
    const [result, setResult] = useState({ walls: [], zoom: 1 })

    useEffect(() => {
        let cancelled = false
        const timer = setTimeout(async () => {
            const r = await textToWalls(text, font, limit)
            if (!cancelled) setResult(r)
        }, 120)
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [text, font, limit])

    return result
}