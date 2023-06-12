import type { I18nExtractOptions } from './types'
import { parseFiles } from './parse'
import { loadTranslations } from './load'
import { writeTranslations } from './write'
import { generateNewTranslations } from './merge'

export const i18nExtract = async (options: I18nExtractOptions) => {
  const defaultNamespace = options.defaultNamespace || 'default'
  const translationKeys = await parseFiles(options.input, {
    defaultNamespace
  })
  const existingTranslations = await loadTranslations(options)

  const translations = await generateNewTranslations(translationKeys, existingTranslations, options)
  await writeTranslations(translations)
}
