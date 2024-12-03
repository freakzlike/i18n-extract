import { readFileSync } from 'fs'
import fastGlob from 'fast-glob'
import type { Namespace, ParseResult, TranslationKey } from './types'
import { I18nExtractOptions } from './types'

type TranslationKeyList = Set<TranslationKey>

export const parseFiles = async (
  options: I18nExtractOptions
): Promise<ParseResult> => {
  const files = await getFileList(options.input)
  const defaultNamespace = options.defaultNamespace || 'default'
  const results: Record<Namespace, TranslationKeyList> = {}

  await Promise.all(files.map(async filePath => {
    const fileResults = await parseFile(options, filePath)
    fileResults.forEach(fullKey => {
      const namespaceIndex = fullKey.indexOf(':')
      const [namespace, key] = namespaceIndex > 0
        ? [fullKey.substring(0, namespaceIndex), fullKey.substring(namespaceIndex + 1)]
        : [defaultNamespace, fullKey]

      if (!results[namespace]) {
        results[namespace] = new Set()
      }
      results[namespace].add(key)
    })
  }))

  return Object.entries(results).reduce<ParseResult>((obj, [namespace, values]) => {
    obj[namespace] = [...values].sort()
    return obj
  }, {})
}

/**
 * List files from glob pattern
 */
export const getFileList = async (
  input: string[]
): Promise<string[]> => await fastGlob(input)

/**
 * Parse file
 */
export const parseFile = async (options: I18nExtractOptions, filePath: string): Promise<TranslationKeyList> => {
  const content = readFileSync(filePath, { encoding: 'utf8' })
  return parseContent(options, filePath, content)
}

/**
 * Parse content and return found translation keys
 */
export const parseContent = async (options: I18nExtractOptions, filePath: string, content: string): Promise<TranslationKeyList> => {
  if (options.parser) {
    const results = options.parser(filePath, content)
    return results instanceof Set ? results : new Set(results)
  } else {
    const regex = options.parseRegex ?? /\B\$t\s*\(\s*['"]([\w/: ._-]+)['"]/g
    const matches: TranslationKeyList = new Set()
    for (const match of content.matchAll(regex)) {
      matches.add(match[1])
    }
    return matches
  }
}
