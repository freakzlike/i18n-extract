import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mkdirSync, writeFileSync } from 'fs'
import { i18nExtract } from '@/extract'

vi.mock('fs', async () => ({
  ...await vi.importActual<[]>('fs'),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn()
}))
const mockedWriteFile = vi.mocked(writeFileSync)
const mockedMkdir = vi.mocked(mkdirSync)

beforeEach(() => {
  mockedWriteFile.mockReset().mockReturnValue()
  mockedMkdir.mockReset().mockReturnValue(undefined)
})

const toJSON = (v: unknown) => `${JSON.stringify(v, undefined, 2)}\n`
  .replaceAll('\u2060', '\\u2060')
  .replaceAll('\u200B', '\\u200B')
  .replaceAll('\u200b', '\\u200b')
  .replaceAll('\u00A0', '\\u00A0')
  .replaceAll('\u00a0', '\\u00a0')

/**
 * i18nExtract
 */
describe('i18nExtract', () => {
  it('should extract translations with namespace', async () => {
    const options = await import('../examples/namespaces/i18n-extract.config.cjs')
    expect(await i18nExtract(options.default)).toBe(true)

    expect(mockedMkdir).not.toHaveBeenCalled()

    expect(mockedWriteFile).toHaveBeenCalledTimes(4)

    expect(mockedWriteFile).toHaveBeenCalledWith('examples/namespaces/locales/de/common.json', toJSON({
      context: {
        key_1: 'Context Key 1 DE',
        key_2: 'Context Key 2 DE',
        nested: {
          key: 'Nested Key DE'
        }
      },
      'invalid:nested:key': '__MISSING_TRANSLATION__',
      key_1: 'Key 1 DE',
      key_2: 'Key 2 DE',
      key_3: 'Key 3 DE',
      new_key: '__MISSING_TRANSLATION__'
    }))
    expect(mockedWriteFile).toHaveBeenCalledWith('examples/namespaces/locales/de/other.json', toJSON({
      key_1: 'Other Key 1 DE',
      other_key: 'Other Key DE'
    }))

    expect(mockedWriteFile).toHaveBeenCalledWith('examples/namespaces/locales/en-GB/common.json', toJSON({
      context: {
        key_1: 'Context Key 1 EN',
        key_2: 'Context Key 2 EN',
        nested: {
          key: 'Nested Key EN'
        }
      },
      'invalid:nested:key': '__MISSING_TRANSLATION__',
      key_1: 'Key 1 EN',
      key_2: 'Key 2 EN',
      key_3: 'Key 3 EN',
      new_key: '__MISSING_TRANSLATION__'
    }))
    expect(mockedWriteFile).toHaveBeenCalledWith('examples/namespaces/locales/en-GB/other.json', toJSON({
      key_1: 'Other Key 1 EN',
      other_key: 'Other Key EN'
    }))
  })

  it('should extract translations without namespace', async () => {
    const options = await import('../examples/default/i18n-extract.config.cjs')
    expect(await i18nExtract(options.default)).toBe(true)

    expect(mockedMkdir).not.toHaveBeenCalled()

    expect(mockedWriteFile).toHaveBeenCalledTimes(2)

    expect(mockedWriteFile).toHaveBeenCalledWith('examples/default/locales/de.json', toJSON({
      context: {
        key_1: 'Context Key 1\u200B DE',
        key_2: 'Context Key 2\u2060 DE',
        nested: {
          key: 'Nested Key\u00A0 DE'
        }
      },
      key_1: 'Key 1 DE',
      key_2: 'Key 2 DE',
      key_3: 'Key 3 DE',
      key_4: 'Key 4 DE',
      key_4_plural: 'Key 4 DE plural',
      new_key: '__MISSING_TRANSLATION__'
    }))
    expect(mockedWriteFile).toHaveBeenCalledWith('examples/default/locales/en-GB.json', toJSON({
      context: {
        key_1: 'Context Key 1 EN',
        key_2: 'Context Key 2 EN',
        nested: {
          key: 'Nested Key EN'
        }
      },
      key_1: 'Key 1 EN',
      key_2: 'Key 2 EN',
      key_3: 'Key 3 EN',
      key_4: 'Key 4 EN',
      key_4_plural: 'Key 4 EN plural',
      new_key: '__MISSING_TRANSLATION__'
    }))
  })

  it('should extract translations and keep old', async () => {
    const options = await import('../examples/default/i18n-extract.config.cjs')
    expect(await i18nExtract({
      ...options.default,
      keepMissing: true
    })).toBe(true)

    expect(mockedMkdir).not.toHaveBeenCalled()

    expect(mockedWriteFile).toHaveBeenCalledTimes(2)

    expect(mockedWriteFile).toHaveBeenCalledWith('examples/default/locales/de.json', toJSON({
      context: {
        key_1: 'Context Key 1\u200B DE',
        key_2: 'Context Key 2\u2060 DE',
        nested: {
          key: 'Nested Key\u00A0 DE',
          old: 'Old nested key DE'
        }
      },
      key_1: 'Key 1 DE',
      key_2: 'Key 2 DE',
      key_3: 'Key 3 DE',
      key_4: 'Key 4 DE',
      key_4_other: 'Key 4 DE other',
      key_4_plural: 'Key 4 DE plural',
      new_key: '__MISSING_TRANSLATION__',
      old_key: 'Old key',
      old_key_plural: 'Old key plural'
    }))
    expect(mockedWriteFile).toHaveBeenCalledWith('examples/default/locales/en-GB.json', toJSON({
      context: {
        key_1: 'Context Key 1 EN',
        key_2: 'Context Key 2 EN',
        nested: {
          key: 'Nested Key EN',
          old: 'Old nested key EN'
        }
      },
      key_1: 'Key 1 EN',
      key_2: 'Key 2 EN',
      key_3: 'Key 3 EN',
      key_4: 'Key 4 EN',
      key_4_other: 'Key 4 EN other',
      key_4_plural: 'Key 4 EN plural',
      new_key: '__MISSING_TRANSLATION__',
      old_key: 'Old key'
    }))
  })

  it('should extract with missing translations', async () => {
    const options = await import('../examples/default/i18n-extract.config.cjs')
    expect(await i18nExtract({
      ...options.default,
      output: 'examples/tmp/locales/{{lng}}.json',
      languages: ['fr']
    })).toBe(true)

    expect(mockedMkdir).toHaveBeenCalledTimes(1)
    expect(mockedMkdir).toHaveBeenCalledWith('examples/tmp/locales', { recursive: true })

    expect(mockedWriteFile).toHaveBeenCalledTimes(1)
    expect(mockedWriteFile).toHaveBeenCalledWith('examples/tmp/locales/fr.json', toJSON({
      context: {
        key_1: '__MISSING_TRANSLATION__',
        key_2: '__MISSING_TRANSLATION__',
        nested: {
          key: '__MISSING_TRANSLATION__'
        }
      },
      key_1: '__MISSING_TRANSLATION__',
      key_2: '__MISSING_TRANSLATION__',
      key_3: '__MISSING_TRANSLATION__',
      key_4: '__MISSING_TRANSLATION__',
      new_key: '__MISSING_TRANSLATION__'
    }))
  })

  it('should extract translations all translated', async () => {
    const options = await import('../examples/translated/i18n-extract.config.cjs')
    expect(await i18nExtract(options.default)).toBe(true)

    expect(mockedMkdir).not.toHaveBeenCalled()

    expect(mockedWriteFile).toHaveBeenCalledTimes(2)

    expect(mockedWriteFile).toHaveBeenCalledWith('examples/translated/locales/de.json', toJSON({
      key_1: 'Key 1 DE',
      key_2: 'Key 2 DE',
      key_3: 'Key 3 DE'
    }))
    expect(mockedWriteFile).toHaveBeenCalledWith('examples/translated/locales/en-GB.json', toJSON({
      key_1: 'Key 1 EN',
      key_2: 'Key 2 EN',
      key_3: 'Key 3 EN'
    }))
  })

  it('should extract translations with new translation', async () => {
    const options = await import('../examples/new/i18n-extract.config.cjs')
    expect(await i18nExtract(options.default)).toBe(true)

    expect(mockedMkdir).not.toHaveBeenCalled()

    expect(mockedWriteFile).toHaveBeenCalledTimes(4)

    expect(mockedWriteFile).toHaveBeenCalledWith('examples/new/locales/de/default.json', toJSON({
      key_1: 'Key 1 DE',
      key_2: 'Key 2 DE'
    }))
    expect(mockedWriteFile).toHaveBeenCalledWith('examples/new/locales/de/other.json', toJSON({
      key_1: '__MISSING_TRANSLATION__'
    }))

    expect(mockedWriteFile).toHaveBeenCalledWith('examples/new/locales/en-GB/default.json', toJSON({
      key_1: 'Key 1 EN',
      key_2: 'Key 2 EN'
    }))
    expect(mockedWriteFile).toHaveBeenCalledWith('examples/new/locales/en-GB/other.json', toJSON({
      key_1: '__MISSING_TRANSLATION__'
    }))
  })

  it('should extract translations with error', async () => {
    const options = await import('../examples/error/i18n-extract.config.cjs')
    expect(await i18nExtract(options.default)).toBe(true)

    expect(mockedMkdir).not.toHaveBeenCalled()

    expect(mockedWriteFile).toHaveBeenCalledTimes(1)
    expect(mockedWriteFile).toHaveBeenCalledWith('examples/error/locales/en.json', toJSON({
      nested_key: {
        key_1: 'Nested Key translation'
      },
      other_key: 'Other Key'
    }))
  })
})
