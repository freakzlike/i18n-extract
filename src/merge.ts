import type {
  I18nExtractOptions,
  ParseResult,
  TranslationMapLoad,
  TranslationMapWrite,
  TranslationResultWrite,
  TranslationStructure,
  TranslationValue
} from './types'
import { generateTranslationMap } from './utils'

export const generateNewTranslations = async (
  translationKeys: ParseResult,
  existingTranslations: TranslationMapLoad,
  options: I18nExtractOptions
): Promise<TranslationMapWrite> => {
  return generateTranslationMap(options, async ({ language, namespace }) => {
    let translations: TranslationStructure = {}
    let result: TranslationResultWrite = {
      translations,
      untranslatedCount: 0
    }

    const _translationKeys = translationKeys[namespace] || []
    const _existingTranslations = existingTranslations[language]?.[namespace]?.translations || {}
    for (const translationKey of _translationKeys) {
      [translations, result] = await writeTranslationStructure(
        translationKey,
        _existingTranslations,
        translations,
        result,
        options
      )
    }

    return {
      ...result,
      translations
    }
  })
}

const mapTranslationStructure = (
  translationValue: TranslationValue
): TranslationStructure => typeof translationValue === 'string' || !translationValue
  ? {}
  : translationValue

export const writeTranslationStructure = async (
  translationKey: string,
  existingTranslations: TranslationStructure,
  translations: TranslationStructure,
  result: TranslationResultWrite,
  options: I18nExtractOptions
): Promise<[TranslationStructure, TranslationResultWrite]> => {
  const contextIdx = translationKey.indexOf('.')
  // Nested translation
  if (contextIdx > -1) {
    const context = translationKey.substring(0, contextIdx)
    const nestedKey = translationKey.substring(contextIdx + 1)
    const [_translations, _result] = await writeTranslationStructure(
      nestedKey,
      mapTranslationStructure(existingTranslations[context]),
      mapTranslationStructure(translations[context]),
      result,
      options
    )

    translations[context] = _translations

    return [
      translations,
      _result
    ]
  }

  // String translation

  const defaultTranslation = options.defaultValue || '__MISSING_TRANSLATION__'

  if (typeof existingTranslations[translationKey] === 'string') {
    translations[translationKey] = existingTranslations[translationKey]
  } else {
    translations[translationKey] = defaultTranslation
  }
  if (translations[translationKey] === defaultTranslation) {
    result.untranslatedCount++
  }
  return [translations, result]
}
