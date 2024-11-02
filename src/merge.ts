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
  return generateTranslationMap(options, async ({ language, namespace, filePath }) => {
    const _existingTranslations = existingTranslations[language]?.[namespace]?.translations || {}

    let translations: TranslationStructure = options.keepMissing
      ? JSON.parse(JSON.stringify(_existingTranslations))
      : {}
    let result: TranslationResultWrite = {
      translations,
      untranslatedCount: 0
    }

    const _translationKeys = translationKeys[namespace] || []
    for (const translationKey of _translationKeys) {
      [translations, result] = await writeTranslationStructure({
        translationKey,
        filePath,
        language,
        namespace,
        fullTranslationKey: translationKey,
        existingTranslations: _existingTranslations,
        translations,
        result,
        options
      })
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
  { translationKey, filePath, language, namespace, fullTranslationKey, existingTranslations, translations, result, options }: {
    translationKey: string,
    filePath: string,
    language: string,
    namespace: string,
    fullTranslationKey: string,
    existingTranslations: TranslationStructure,
    translations: TranslationStructure,
    result: TranslationResultWrite,
    options: I18nExtractOptions
  }): Promise<[TranslationStructure, TranslationResultWrite]> => {
  const contextIdx = translationKey.indexOf('.')
  // Nested translation
  if (contextIdx > -1) {
    const context = translationKey.substring(0, contextIdx)
    const nestedKey = translationKey.substring(contextIdx + 1)
    const [_translations, _result] = await writeTranslationStructure({
      translationKey: nestedKey,
      filePath,
      language,
      namespace,
      fullTranslationKey,
      existingTranslations: mapTranslationStructure(existingTranslations[context]),
      translations: mapTranslationStructure(translations[context]),
      result,
      options
    })

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
    console.info(`Missing translation for key: "${fullTranslationKey}" in file: ${filePath}`)
    result.untranslatedCount++
  }

  // Additional suffixes
  if (options.suffixes?.length) {
    for (const suffix of options.suffixes) {
      const key = [translationKey, suffix].join('')
      if (typeof existingTranslations[key] === 'string') {
        translations[key] = existingTranslations[key]

        if (translations[key] === defaultTranslation) {
          result.untranslatedCount++
        }
      }
    }
  }

  return [translations, result]
}
