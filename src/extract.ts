import { readFileSync } from 'node:fs'
import { glob } from 'glob'
import type { InputPattern } from '@/types'

export const parseFiles = async (
  input: InputPattern,
  ignore?: InputPattern
): Promise<Set<string>> => {
  const files = await getFileList(input, ignore)
  const results = new Set<string>()

  await Promise.all(files.map(async filePath => {
    const result = await parseFile(filePath)
    result.forEach(results.add, results)
  }))

  return results
}

/**
 * List files from glob pattern
 */
export const getFileList = async (
  input: InputPattern,
  ignore?: InputPattern
): Promise<string[]> => {
  return await glob(input, {ignore})
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
