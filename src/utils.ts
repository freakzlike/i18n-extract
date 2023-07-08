import type {
  I18nExtractOptions,
  Language,
  Namespace,
  TranslationMap,
  TranslationResult
} from './types'

export const generateTranslationMap = async <T extends TranslationResult> (
  options: I18nExtractOptions,
  callback: (params: {
    filePath: string,
    language: Language,
    namespace: Namespace
  }) => Promise<T>
): Promise<TranslationMap<T>> => {
  const namespaces = options.namespaces?.length ? options.namespaces : ['default']

  const results: TranslationMap<T> = {}
  await Promise.all(options.languages.map(async language => {
    results[language] = {}

    await Promise.all(namespaces.map(async namespace => {
      const filePath = options.output
        .replaceAll('{{lng}}', language)
        .replaceAll('{{ns}}', namespace)

      const _result = await callback({
        filePath,
        language,
        namespace
      })

      results[language][namespace] = {
        ..._result,
        filePath
      }
    }))
  }))
  return results
}
