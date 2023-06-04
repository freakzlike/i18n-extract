import { readFileSync } from 'fs'
import { glob } from 'glob'

export const parseFiles = async (
  input: string[],
  { defaultNamespace }: { defaultNamespace: string }
): Promise<Record<string, Set<string>>> => {
  const files = await getFileList(input)
  const results: Record<string, Set<string>> = {}

  await Promise.all(files.map(async filePath => {
    const fileResults = await parseFile(filePath)
    fileResults.forEach(fullKey => {
      const [namespace, key] = fullKey.includes(':')
        ? fullKey.split(':', 2)
        : [defaultNamespace, fullKey]

      if (!results[namespace]) {
        results[namespace] = new Set<string>()
      }
      results[namespace].add(key)
    })
  }))

  return results
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
export const parseFile = async (filePath: string): Promise<Set<string>> => {
  const content = readFileSync(filePath, { encoding: 'utf8' })
  return parseContent(content)
}

/**
 * Parse content and return found translation keys
 */
export const parseContent = async (content: string): Promise<Set<string>> => {
  const regex = /\B\$t\s*\(\s*['"]([\w/: ._-]+)['"]/g
  const matches = new Set<string>()
  let match
  do {
    match = regex.exec(content)
    if (match) {
      matches.add(match[1])
    }
  } while (match != null)
  return matches
}
