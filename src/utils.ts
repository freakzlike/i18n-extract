import { I18nExtractOptions, Language, Namespace, TranslationMap, TranslationStructure } from '@/types'

export const generateTranslationMap = async (
  options: I18nExtractOptions,
  callback: (params: {
    filePath: string,
    language: Language,
    namespace: Namespace
  }) => Promise<TranslationStructure>
): Promise<TranslationMap> => {
  const namespaces = options.namespaces?.length ? options.namespaces : ['default']

  const results: TranslationMap = {}
  await Promise.all(options.languages.map(async language => {
    results[language] = {}

    await Promise.all(namespaces.map(async namespace => {
      const filePath = options.output
        .replaceAll('{{lng}}', language)
        .replaceAll('{{ns}}', namespace)

      results[language][namespace] = {
        filePath,
        translations: await callback({
          filePath,
          language,
          namespace
        })
      }
    }))
  }))
  return results
}
