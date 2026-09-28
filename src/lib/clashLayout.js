import { BASE_TEMPLATES } from './baseTemplates'

export function getClashLayoutUrl({ th, type = 'HV' } = {}) {
    const village = type === 'HV' ? 'homeVillage' : null
    const template = BASE_TEMPLATES[th]?.[village]

    return template?.link ?? null
}