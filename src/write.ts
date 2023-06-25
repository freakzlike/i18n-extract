import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { TranslationMap } from './types'

export const writeTranslations = async (
  translationResults: TranslationMap
): Promise<void> => {
  await Promise.all(Object.values(translationResults).map(async (languageTranslations) => {
    await Promise.all(Object.values(languageTranslations).map(async ({ filePath, translations }) => {
      const content = JSON.stringify(translations, undefined, 2)

      const directory = dirname(filePath)
      if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true })
      }

      writeFileSync(filePath, `${content}\n`)
    }))
  }))
}
