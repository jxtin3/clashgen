export const SCENE_W = 1600
export const SCENE_H = 1200

// The three corners of the 44 x 44 village on each picture (in picture pixels).
export const SCENES = {
    classic: {
        id: 'classic',
        label: 'Classic',
        src: '/scenery/classic.webp',
        top: [800, 63.8],
        right: [1473.1, 566.9],
        left: [126.9, 566.9],
    },
    war: {
        id: 'war',
        label: 'War',
        src: '/scenery/war.webp',
        top: [800, 117.2],
        right: [1397.7, 566.4],
        left: [197.7, 566.4],
    },
}