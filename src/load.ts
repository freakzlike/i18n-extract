import { readFileSync, existsSync } from 'fs'
import { TranslationMap, I18nExtractOptions } from '@/types'
import { generateTranslationMap } from '@/utils'

export const loadTranslations = async (
  options: I18nExtractOptions
): Promise<TranslationMap> => {
  return generateTranslationMap(options, ({ filePath }) => {
    if (!existsSync(filePath)) return {}

    const rawContent = readFileSync(filePath, { encoding: 'utf8' })
    return JSON.parse(rawContent)
  })
}
