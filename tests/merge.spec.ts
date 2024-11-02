import { describe, expect, it } from 'vitest'
import { writeTranslationStructure } from '@/merge'

/**
 * writeTranslationStructure
 */
describe('writeTranslationStructure', () => {
  const defaultParams = (translationKey: string): Omit<Parameters<typeof writeTranslationStructure>[0], 'existingTranslations'> => ({
    translationKey,
    fullTranslationKey: translationKey,
    filePath: 'examples/default/locales/en.json',
    language: 'en',
    namespace: 'default',
    translations: {},
    result: {
      translations: {},
      untranslatedCount: 0
    },
    options: {
      input: ['src/**'],
      output: 'examples/default/locales/{{lng}}.json',
      languages: ['de', 'en-GB'],
      suffixes: ['_plural']
    }
  })

  it('should write simple translation key', async () => {
    expect(await writeTranslationStructure({
      ...defaultParams('key_1'),
      existingTranslations: {
        key_1: 'Key 1',
        key_1_plural: 'Key 1 plural',
        key_1_other: 'Key 1 other',
        key_2: 'Key 2'
      }
    })).toStrictEqual([
      {
        key_1: 'Key 1',
        key_1_plural: 'Key 1 plural'
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 0
      }
    ])
  })

  it('should merge simple translation key', async () => {
    expect(await writeTranslationStructure({
      ...defaultParams('key_1'),
      existingTranslations: {
        key_1: 'Key 1'
      },
      translations: {
        key_2: 'Key 2'
      }
    })).toStrictEqual([
      {
        key_1: 'Key 1',
        key_2: 'Key 2'
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 0
      }
    ])
  })

  it('should write simple translation key with missing translation', async () => {
    expect(await writeTranslationStructure({
      ...defaultParams('key_1'),
      existingTranslations: {
        key_2: 'Key 2'
      }
    })).toStrictEqual([
      {
        key_1: '__MISSING_TRANSLATION__'
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 1
      }
    ])
  })

  it('should write simple translation key with missing translation', async () => {
   const params = defaultParams('key_1')
    expect(await writeTranslationStructure({
      ...params,
      existingTranslations: {
        key_2: 'Key 2'
      },
      result: {
        translations: {},
        untranslatedCount: 5
      },
      options: {
        ...params.options,
        defaultValue: '__NEW_KEY__'
      }
    })).toStrictEqual([
      {
        key_1: '__NEW_KEY__'
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 6
      }
    ])
  })

  it('should write and count missing translation key', async () => {
    expect(await writeTranslationStructure({
      ...defaultParams('key_1'),
      existingTranslations: {
        key_1: '__MISSING_TRANSLATION__',
        key_1_plural: '__MISSING_TRANSLATION__'
      }
    })).toStrictEqual([
      {
        key_1: '__MISSING_TRANSLATION__',
        key_1_plural: '__MISSING_TRANSLATION__'
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 2
      }
    ])
  })

  it('should write missing translation key if different context', async () => {
    expect(await writeTranslationStructure({
      ...defaultParams('key_1'),
      existingTranslations: {
        key_1: {
          nested: '1'
        }
      }
    })).toStrictEqual([
      {
        key_1: '__MISSING_TRANSLATION__'
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 1
      }
    ])
  })

  it('should write nested translation key', async () => {
    expect(await writeTranslationStructure({
      ...defaultParams('context.nested'),
      existingTranslations: {
        context: {
          nested: 'Nested translation',
          other: 'other'
        }
      }
    })).toStrictEqual([
      {
        context: {
          nested: 'Nested translation'
        }
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 0
      }
    ])
  })

  it('should write multiple nested translation key', async () => {
    expect(await writeTranslationStructure({
      ...defaultParams('context.nested.more.key'),
      existingTranslations: {
        context: {
          nested: {
            more: {
              key: 'Key'
            }
          }
        }
      }
    })).toStrictEqual([
      {
        context: {
          nested: {
            more: {
              key: 'Key'
            }
          }
        }
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 0
      }
    ])
  })

  it('should write nested translation key with missing translation', async () => {
    expect(await writeTranslationStructure({
      ...defaultParams('context.nested'),
      existingTranslations: {
        context: {
          other: 'other'
        }
      },
      result: {
        translations: {},
        untranslatedCount: 2
      }
    })).toStrictEqual([
      {
        context: {
          nested: '__MISSING_TRANSLATION__'
        }
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 3
      }
    ])
  })

  it('should merge nested translation key', async () => {
    expect(await writeTranslationStructure({
      ...defaultParams('context.nested'),
      existingTranslations: {
        context: {
          nested: 'Nested translation'
        }
      },
      translations: {
        key: 'key',
        context: {
          other: 'other'
        }
      }
    })).toStrictEqual([
      {
        key: 'key',
        context: {
          nested: 'Nested translation',
          other: 'other'
        }
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 0
      }
    ])
  })

  it('should handle existing string on nested translation', async () => {
    expect(await writeTranslationStructure({
      ...defaultParams('context.nested'),
      existingTranslations: {
        context: {
          nested: 'Nested translation'
        }
      },
      translations: {
        context: 'Context'
      }
    })).toStrictEqual([
      {
        context: {
          nested: 'Nested translation'
        }
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 0
      }
    ])
  })
})
