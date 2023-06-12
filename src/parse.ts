import { readFileSync } from 'fs'
import { glob } from 'glob'
import { Namespace, ParseResult, TranslationKey } from './types'

type TranslationKeyList = Set<TranslationKey>

export const parseFiles = async (
  input: string[],
  { defaultNamespace }: { defaultNamespace: Namespace }
): Promise<ParseResult> => {
  const files = await getFileList(input)
  const results: Record<Namespace, TranslationKeyList> = {}

  await Promise.all(files.map(async filePath => {
    const fileResults = await parseFile(filePath)
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
): Promise<string[]> => {
  const _input = input.filter(v => !v.startsWith('!'))
  const ignore = input.filter(v => v.startsWith('!')).map(v => v.substring(1))
  return await glob(_input, { ignore })
}

/**
 * Parse file
 */
export const parseFile = async (filePath: string): Promise<TranslationKeyList> => {
  const content = readFileSync(filePath, { encoding: 'utf8' })
  return parseContent(content)
}

/**
 * Parse content and return found translation keys
 */
export const parseContent = async (content: string): Promise<TranslationKeyList> => {
  const regex = /\B\$t\s*\(\s*['"]([\w/: ._-]+)['"]/g
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
