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

/**
 * i18nExtract
 */
describe('i18nExtract', () => {
  it('should extract translations with namespace', async () => {
    const options = await import('../examples/namespaces/i18n-extract.config.cjs')
    await i18nExtract(options.default)

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
    await i18nExtract(options.default)

    expect(mockedMkdir).not.toHaveBeenCalled()

    expect(mockedWriteFile).toHaveBeenCalledTimes(2)

    expect(mockedWriteFile).toHaveBeenCalledWith('examples/default/locales/de.json', toJSON({
      context: {
        key_1: 'Context Key 1 DE',
        key_2: 'Context Key 2 DE',
        nested: {
          key: 'Nested Key DE'
        }
      },
      key_1: 'Key 1 DE',
      key_2: 'Key 2 DE',
      key_3: 'Key 3 DE',
      key_4: 'Key 4 DE',
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
      new_key: '__MISSING_TRANSLATION__'
    }))
  })

  it('should extract with missing translations', async () => {
    const options = await import('../examples/default/i18n-extract.config.cjs')
    await i18nExtract({
      ...options.default,
      output: 'examples/tmp/locales/{{lng}}.json',
      languages: ['fr']
    })

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
    await i18nExtract(options.default)

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
    await i18nExtract(options.default)

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
})
