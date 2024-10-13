import { describe, expect, it } from 'vitest'
import { loadTranslations } from '@/load'
import { TranslationMap } from '@/types'

/**
 * loadTranslations
 */
describe('loadTranslations', () => {
  it('should load translations from files with namespaces', async () => {
    const expectedResult: TranslationMap = {
      de: {
        common: {
          filePath: 'examples/namespaces/locales/de/common.json',
          translations: {
            key_1: 'Key 1 DE',
            key_2: 'Key 2 DE',
            key_3: 'Key 3 DE',
            context: {
              key_1: 'Context Key 1 DE',
              key_2: 'Context Key 2 DE',
              nested: {
                key: 'Nested Key DE'
              }
            },
            old_key: 'Old key'
          }
        },
        other: {
          filePath: 'examples/namespaces/locales/de/other.json',
          translations: {
            key_1: 'Other Key 1 DE',
            other_key: 'Other Key DE'
          }
        }
      },
      'en-GB': {
        common: {
          filePath: 'examples/namespaces/locales/en-GB/common.json',
          translations: {
            key_1: 'Key 1 EN',
            key_2: 'Key 2 EN',
            key_3: 'Key 3 EN',
            context: {
              key_1: 'Context Key 1 EN',
              key_2: 'Context Key 2 EN',
              nested: {
                key: 'Nested Key EN'
              }
            },
            old_key: 'Old key'
          }
        },
        other: {
          filePath: 'examples/namespaces/locales/en-GB/other.json',
          translations: {
            key_1: 'Other Key 1 EN',
            other_key: 'Other Key EN'
          }
        }
      }
    }

    expect(await loadTranslations({
      input: ['src/**'],
      output: 'examples/namespaces/locales/{{lng}}/{{ns}}.json',
      languages: ['de', 'en-GB'],
      namespaces: ['common', 'other']
    })).toStrictEqual(expectedResult)
  })

  it('should load translations from files without namespaces', async () => {
    const expectedResult: TranslationMap = {
      de: {
        default: {
          filePath: 'examples/default/locales/de.json',
          translations: {
            key_3: 'Key 3 DE',
            key_1: 'Key 1 DE',
            key_2: 'Key 2 DE',
            key_4: 'Key 4 DE',
            key_4_plural: 'Key 4 DE plural',
            key_4_other: 'Key 4 DE other',
            context: {
              key_2: 'Context Key 2\u2060 DE',
              key_1: 'Context Key 1\u200b DE',
              nested: {
                old: 'Old nested key DE',
                key: 'Nested Key\u00A0 DE'
              }
            },
            old_key: 'Old key'
          }
        }
      },
      'en-GB': {
        default: {
          filePath: 'examples/default/locales/en-GB.json',
          translations: {
            key_3: 'Key 3 EN',
            key_1: 'Key 1 EN',
            key_2: 'Key 2 EN',
            key_4: 'Key 4 EN',
            key_4_plural: 'Key 4 EN plural',
            key_4_other: 'Key 4 EN other',
            context: {
              key_2: 'Context Key 2 EN',
              key_1: 'Context Key 1 EN',
              nested: {
                old: 'Old nested key EN',
                key: 'Nested Key EN'
              }
            },
            old_key: 'Old key'
          }
        }
      }
    }

    expect(await loadTranslations({
      input: ['src/**'],
      output: 'examples/default/locales/{{lng}}.json',
      languages: ['de', 'en-GB']
    })).toStrictEqual(expectedResult)
  })

  it('should handle missing file', async () => {
    expect(await loadTranslations({
      input: ['src/**'],
      output: 'examples/default/locales/{{lng}}.json',
      languages: ['fr']
    })).toStrictEqual({
      fr: {
        default: {
          filePath: 'examples/default/locales/fr.json',
          translations: {}
        }
      }
    })
  })
})
