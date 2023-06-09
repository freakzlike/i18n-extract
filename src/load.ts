import { readFileSync, existsSync } from 'fs'
import { TranslationMap, Language, Namespace, TranslationStructure } from '@/types'

export const loadTranslations = async (
  pathTemplate: string,
  { languages, namespaces }: {
    languages: Language[],
    namespaces?: Namespace[]
  }
): Promise<TranslationMap> => {
  const _namespaces = namespaces?.length ? namespaces : ['default']

  const results: TranslationMap = {}

  languages.forEach(language => {
    results[language] = {}

    _namespaces.forEach(namespace => {
      let translations: TranslationStructure = {}
      const filePath = pathTemplate
        .replaceAll('{{lng}}', language)
        .replaceAll('{{ns}}', namespace)

      if (existsSync(filePath)) {
        const rawContent = readFileSync(filePath, { encoding: 'utf8' })
        translations = JSON.parse(rawContent)
      }

      results[language][namespace] = {
        filePath,
        translations
      }
    })
  })

  return results
}
