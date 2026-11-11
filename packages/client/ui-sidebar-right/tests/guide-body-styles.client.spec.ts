/** Guide body style contracts: the capsule column fills the pane, centres a short guide, and scrolls a tall one. */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(fileURLToPath(new URL('../src/client/tabs/guide/GuideBody.module.css', import.meta.url)), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, ' ')

/**
 * Declarations of one exact selector, keyed by property.
 * @param selector - exact selector text.
 * @returns the normalized declarations, or undefined when absent.
 */
function declarations(selector: string): Map<string, string> | undefined {
  for (const [, selectorList = '', body = ''] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!selectorList.split(',').map(value => value.trim()).includes(selector)) continue
    const found = new Map<string, string>()
    for (const part of body.split(';')) {
      const colon = part.indexOf(':')
      if (colon === -1) continue
      found.set(part.slice(0, colon).trim(), part.slice(colon + 1).trim().replace(/\s+/g, ' '))
    }
    return found
  }
  return undefined
}

describe('GuideBody.module.css', () => {
  it('fills the pane and scrolls a tall guide from its start', () => {
    expect(declarations('.guide')?.get('height')).toBe('100%')
    expect(declarations('.guide')?.get('overflow-y')).toBe('auto')
  })

  it('centres a short guide with safe center so a tall one stays reachable', () => {
    expect(declarations('.guide')?.get('justify-content')).toBe('safe center')
  })
})
