import { describe, expect, it } from 'vitest'
import { writeTranslationStructure } from '@/merge'
import { I18nExtractOptions } from '@/types'

/**
 * writeTranslationStructure
 */
describe('writeTranslationStructure', () => {
  const defaultOptions: I18nExtractOptions = {
    input: ['src/**'],
    output: 'examples/default/locales/{{lng}}.json',
    languages: ['de', 'en-GB']
  }

  it('should write simple translation key', async () => {
    expect(await writeTranslationStructure('key_1', {
      key_1: 'Key 1',
      key_2: 'Key 2'
    }, {}, {
      translations: {},
      untranslatedCount: 0
    }, defaultOptions)).toStrictEqual([
      {
        key_1: 'Key 1'
      },
      {
        translations: expect.any(Object),
        untranslatedCount: 0
      }
    ])
  })

  it('should merge simple translation key', async () => {
    expect(await writeTranslationStructure('key_1', {
      key_1: 'Key 1'
    }, {
      key_2: 'Key 2'
    }, {
      translations: {},
      untranslatedCount: 0
    }, defaultOptions)).toStrictEqual([
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
    expect(await writeTranslationStructure('key_1', {
      key_2: 'Key 2'
    }, {}, {
      translations: {},
      untranslatedCount: 0
    }, defaultOptions)).toStrictEqual([
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
    expect(await writeTranslationStructure('key_1', {
      key_2: 'Key 2'
    }, {}, {
      translations: {},
      untranslatedCount: 5
    }, {
      ...defaultOptions,
      defaultValue: '__NEW_KEY__'
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

  it('should write missing translation key if different context', async () => {
    expect(await writeTranslationStructure('key_1', {
      key_1: {
        nested: '1'
      }
    }, {}, {
      translations: {},
      untranslatedCount: 0
    }, defaultOptions)).toStrictEqual([
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
    expect(await writeTranslationStructure('context.nested', {
      context: {
        nested: 'Nested translation',
        other: 'other'
      }
    }, {}, {
      translations: {},
      untranslatedCount: 0
    }, defaultOptions)).toStrictEqual([
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
    expect(await writeTranslationStructure('context.nested.more.key', {
      context: {
        nested: {
          more: {
            key: 'Key'
          }
        }
      }
    }, {}, {
      translations: {},
      untranslatedCount: 0
    }, defaultOptions)).toStrictEqual([
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
    expect(await writeTranslationStructure('context.nested', {
      context: {
        other: 'other'
      }
    }, {}, {
      translations: {},
      untranslatedCount: 2
    }, defaultOptions)).toStrictEqual([
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
    expect(await writeTranslationStructure('context.nested', {
      context: {
        nested: 'Nested translation'
      }
    }, {
      key: 'key',
      context: {
        other: 'other'
      }
    }, {
      translations: {},
      untranslatedCount: 0
    }, defaultOptions)).toStrictEqual([
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
    expect(await writeTranslationStructure('context.nested', {
      context: {
        nested: 'Nested translation'
      }
    }, {
      context: 'Context'
    }, {
      translations: {},
      untranslatedCount: 0
    }, defaultOptions)).toStrictEqual([
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
