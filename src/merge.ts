import type { I18nExtractOptions, ParseResult, TranslationMap } from './types'
import { TranslationStructure, TranslationValue } from './types'
import { generateTranslationMap } from './utils'

export const generateNewTranslations = async (
  translationKeys: ParseResult,
  existingTranslations: TranslationMap,
  options: I18nExtractOptions
): Promise<TranslationMap> => {
  return generateTranslationMap(options, async ({ language, namespace }) => {
    let translations: TranslationStructure = {}

    const _translationKeys = translationKeys[namespace] || []
    const _existingTranslations = existingTranslations[language]?.[namespace]?.translations || {}
    for (const translationKey of _translationKeys) {
      translations = await writeTranslationStructure(translationKey, _existingTranslations, translations)
    }

    return translations
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
  translations: TranslationStructure
): Promise<TranslationStructure> => {
  const contextIdx = translationKey.indexOf('.')
  if (contextIdx > -1) {
    const context = translationKey.substring(0, contextIdx)
    const nestedKey = translationKey.substring(contextIdx + 1)
    translations[context] = await writeTranslationStructure(
      nestedKey,
      mapTranslationStructure(existingTranslations[context]),
      mapTranslationStructure(translations[context])
    )
  } else if (typeof existingTranslations[translationKey] === 'string') {
    translations[translationKey] = existingTranslations[translationKey]
  } else {
    translations[translationKey] = '__MISSING_TRANSLATION__'
  }
  return translations
}
