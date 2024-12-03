import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { i18nCheck } from '@/check'

/**
 * i18nCheck
 */
describe('i18nCheck', () => {
  let spyConsole = vi.spyOn(console, 'log').mockReturnValue()

  beforeEach(() => {
    spyConsole = vi.spyOn(console, 'log').mockReturnValue()
  })

  afterEach(() => {
    spyConsole.mockRestore()
  })

  it('should check translations with namespace', async () => {
    const options = await import('../examples/namespaces/i18n-extract.config.cjs')
    expect(await i18nCheck(options.default)).toBe(false)

    expect(spyConsole).toHaveBeenCalledTimes(2)
    expect(spyConsole).toHaveBeenCalledWith('examples/namespaces/locales/de/common.json has untranslated messages!')
    expect(spyConsole).toHaveBeenCalledWith('examples/namespaces/locales/en-GB/common.json has untranslated messages!')
  })

  it('should check translations without namespace', async () => {
    const options = await import('../examples/default/i18n-extract.config.cjs')
    expect(await i18nCheck(options.default)).toBe(false)

    expect(spyConsole).toHaveBeenCalledTimes(2)
    expect(spyConsole).toHaveBeenCalledWith('examples/default/locales/de.json has untranslated messages!')
    expect(spyConsole).toHaveBeenCalledWith('examples/default/locales/en-GB.json has untranslated messages!')
  })

  it('should check translations all translated', async () => {
    const options = await import('../examples/translated/i18n-extract.config.cjs')
    expect(await i18nCheck(options.default)).toBe(true)

    expect(spyConsole).not.toHaveBeenCalled()
  })

  it('should check translations with missing file', async () => {
    const options = await import('../examples/new/i18n-extract.config.cjs')
    expect(await i18nCheck(options.default)).toBe(false)

    expect(spyConsole).toHaveBeenCalledTimes(2)
    expect(spyConsole).toHaveBeenCalledWith('examples/new/locales/de/other.json has untranslated messages!')
    expect(spyConsole).toHaveBeenCalledWith('examples/new/locales/en-GB/other.json has untranslated messages!')
  })

  it('should check translations with error', async () => {
    const options = await import('../examples/error/i18n-extract.config.cjs')
    expect(await i18nCheck(options.default)).toBe(false)

    expect(spyConsole).toHaveBeenCalledTimes(1)
    expect(spyConsole).toHaveBeenCalledWith('examples/error/locales/en.json has untranslated messages!')
  })
})
