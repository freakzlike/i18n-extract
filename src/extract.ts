import type { I18nExtractOptions } from './types'
import { TranslationMapWrite } from './types'
import { parseFiles } from './parse'
import { loadTranslations } from './load'
import { generateNewTranslations } from './merge'
import { dirname } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

export const i18nExtract = async (
  options: I18nExtractOptions
) => {
  const translationKeys = await parseFiles(options)
  const existingTranslations = await loadTranslations(options)

  const translationResults = await generateNewTranslations(translationKeys, existingTranslations, options)
  await writeTranslations(translationResults)

  return true
}

export const writeTranslations = async (
  translationResults: TranslationMapWrite
): Promise<void> => {
  await Promise.all(Object.values(translationResults).map(async (languageTranslations) => {
    await Promise.all(Object.values(languageTranslations).map(async ({ filePath, translations }) => {

      // Sort all keys
      const allKeys = new Set<string>()
      JSON.stringify(translations, (key, value) => {
        allKeys.add(key)
        return value
      })
      const content = JSON.stringify(translations, Array.from(allKeys).sort(), 2)
        .replaceAll('\u2060', '\\u2060')
        .replaceAll('\u200B', '\\u200B')
        .replaceAll('\u00A0', '\\u00A0')

      const directory = dirname(filePath)
      if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true })
      }

      writeFileSync(filePath, `${content}\n`)
    }))
  }))
}
