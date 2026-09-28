import { SCENE_W, SCENE_H } from './scenes'
import { loadAssets, drawScene } from './drawScene'

export async function exportPng({ walls, sceneId, level, name, th }) {
    const assets = await loadAssets(sceneId, level)
    const canvas = document.createElement('canvas')
    canvas.width = SCENE_W
    canvas.height = SCENE_H
    drawScene(canvas.getContext('2d'), SCENE_W, assets, walls)

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('Could not create the image')

    const slug =
        name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'design'
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clashgen-${slug}-th${th}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
}