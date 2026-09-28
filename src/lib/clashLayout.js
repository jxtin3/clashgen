// A real Clash of Clans layout link that was generated in-game.
//
// IMPORTANT:
// This is a template/base link, not a dynamically generated layout.
// We do not manufacture the Supercell payload ourselves.

export const TH15_HOME_VILLAGE_TEMPLATE =
    'https://link.clashofclans.com/en?action=OpenLayout&id=TH15%3AHV%3AAAAAOwAAAAJ9O7OX71TzBHdi20xoriPe'

export function getClashLayoutUrl({ th, type = 'HV' } = {}) {
    if (th !== 15 || type !== 'HV') {
        return null
    }

    return TH15_HOME_VILLAGE_TEMPLATE
}