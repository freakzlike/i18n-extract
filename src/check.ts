import type { I18nExtractOptions } from './types'
import { parseFiles } from './parse'
import { loadTranslations } from './load'
import { generateNewTranslations } from './merge'
import { TranslationMapWrite } from './types'

export const i18nCheck = async (
  options: I18nExtractOptions
) => {
  const translationKeys = await parseFiles(options)
  const existingTranslations = await loadTranslations(options)

  const translationResults = await generateNewTranslations(translationKeys, existingTranslations, options)
  return await checkUntranslated(translationResults)
}

const checkUntranslated = async (translationResults: TranslationMapWrite): Promise<boolean> => {
  let hasUntranslated = false
  for (const languageTranslations of Object.values(translationResults)) {
    for (const { filePath, untranslatedCount} of Object.values(languageTranslations)) {
      if (untranslatedCount) {
        hasUntranslated = true
        console.log(`${filePath} has untranslated messages!`)
      }
    }
  }
  return !hasUntranslated
}
