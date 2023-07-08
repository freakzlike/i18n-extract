import { readFileSync, existsSync } from 'fs'
import type { TranslationMapLoad, I18nExtractOptions, TranslationStructure } from './types'
import { generateTranslationMap } from './utils'

export const loadTranslations = async (
  options: I18nExtractOptions
): Promise<TranslationMapLoad> => {
  return generateTranslationMap(options, async ({ filePath }) => {
    let translations: TranslationStructure = {}

    if (existsSync(filePath)) {
      const rawContent = readFileSync(filePath, { encoding: 'utf8' })
      translations = JSON.parse(rawContent)
    }

    return {
      filePath,
      translations
    }
  })
}
