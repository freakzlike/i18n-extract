import { describe, expect, it } from 'vitest'
import { writeTranslationStructure } from '@/merge'

/**
 * writeTranslationStructure
 */
describe('writeTranslationStructure', () => {
  it('should write simple translation key', async () => {
    expect(await writeTranslationStructure('key_1', {
      key_1: 'Key 1',
      key_2: 'Key 2'
    }, {})).toStrictEqual({
      key_1: 'Key 1',
    })
  })

  it('should merge simple translation key', async () => {
    expect(await writeTranslationStructure('key_1', {
      key_1: 'Key 1'
    }, {
      key_2: 'Key 2'
    })).toStrictEqual({
      key_1: 'Key 1',
      key_2: 'Key 2'
    })
  })

  it('should write simple translation key with missing translation', async () => {
    expect(await writeTranslationStructure('key_1', {
      key_2: 'Key 2'
    }, {})).toStrictEqual({
      key_1: '__MISSING_TRANSLATION__',
    })
  })

  it('should write missing translation key if different context', async () => {
    expect(await writeTranslationStructure('key_1', {
      key_1: {
        nested: '1'
      }
    }, {})).toStrictEqual({
      key_1: '__MISSING_TRANSLATION__',
    })
  })

  it('should write nested translation key', async () => {
    expect(await writeTranslationStructure('context.nested', {
      context: {
        nested: 'Nested translation',
        other: 'other'
      }
    }, {})).toStrictEqual({
      context: {
        nested: 'Nested translation'
      }
    })
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
    }, {})).toStrictEqual({
      context: {
        nested: {
          more: {
            key: 'Key'
          }
        }
      }
    })
  })

  it('should write nested translation key with missing translation', async () => {
    expect(await writeTranslationStructure('context.nested', {
      context: {
        other: 'other'
      }
    }, {})).toStrictEqual({
      context: {
        nested: '__MISSING_TRANSLATION__'
      }
    })
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
    })).toStrictEqual({
      key: 'key',
      context: {
        nested: 'Nested translation',
        other: 'other'
      }
    })
  })

  it('should handle existing string on nested translation', async () => {
    expect(await writeTranslationStructure('context.nested', {
      context: {
        nested: 'Nested translation'
      }
    }, {
      context: 'Context'
    })).toStrictEqual({
      context: {
        nested: 'Nested translation'
      }
    })
  })
})
