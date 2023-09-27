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
      const [namespace, key] = fullKey.includes(':')
        ? fullKey.split(':', 2)
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
  return parseContent(options, content)
}

/**
 * Parse content and return found translation keys
 */
export const parseContent = async (options: I18nExtractOptions, content: string): Promise<TranslationKeyList> => {
  const regex = options.parseRegex ?? /\B\$t\s*\(\s*['"]([\w/: ._-]+)['"]/g
  const matches: TranslationKeyList = new Set()
  let match
  do {
    match = regex.exec(content)
    if (match) {
      matches.add(match[1])
    }
  } while (match != null)
  return matches
}
