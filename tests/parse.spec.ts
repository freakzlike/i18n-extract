import { describe, expect, it, vi } from 'vitest'
import path from 'node:path'
import { getFileList, parseContent, parseFile, parseFiles } from '@/parse'
import { CustomParser, I18nExtractOptions } from '@/types'
import { readFileSync } from 'fs'

const options: I18nExtractOptions = {
  input: [
    'examples/namespaces/src/**/*.vue',
    'examples/namespaces/src/**/*.ts',
    '!**/__tests__/**'
  ],
  output: 'examples/namespaces/locales/{{lng}}.json',
  languages: ['de', 'en-GB'],
  defaultNamespace: 'common'
}
const getFileContent = (filePath: string) => readFileSync(filePath, { encoding: 'utf8' })

/**
 * parseFiles
 */
describe('parseFiles', () => {
  it('should parse all files', async () => {
    const results = await parseFiles(options)

    expect(Object.keys(results).sort()).toStrictEqual(['common', 'other'])
    expect(results.common).toStrictEqual([
      'context.key_1',
      'context.key_2',
      'context.nested.key',
      'invalid:nested:key',
      'key_1',
      'key_2',
      'key_3',
      'new_key'
    ])
    expect(results.other).toStrictEqual([
      'key_1',
      'other_key'
    ])
  })

  it('should parse all files with default namespace', async () => {
    const results = await parseFiles({
      ...options,
      defaultNamespace: undefined
    })

    expect(Object.keys(results).sort()).toStrictEqual(['common', 'default', 'other'])
    expect(results.default).toStrictEqual([
      'context.key_1',
      'context.key_2',
      'context.nested.key',
      'key_1',
      'key_2',
      'key_3',
      'new_key'
    ])
    expect(results.common).toStrictEqual([
      'invalid:nested:key',
      'key_2'
    ])
    expect(results.other).toStrictEqual([
      'key_1',
      'other_key'
    ])
  })

  it('should parse all files with custom parser', async () => {
    const parser = vi.fn<CustomParser>((_, content) =>
      [...content.matchAll(/\B\$t\s*\('([\w/: _-]+)'/g)].map((matches) => matches[1]))
    const results = await parseFiles({
      input: [
        'examples/default/src/**/*.vue',
        'examples/default/src/**/*.ts',
        '!**/__tests__/**'
      ],
      output: 'examples/default/locales/{{lng}}.json',
      languages: ['de', 'en-GB'],
      parser
    })

    expect(Object.keys(results).sort()).toStrictEqual(['default'])
    expect(results.default).toStrictEqual([
      'key_1',
      'key_2',
      'key_4',
      'new_key'
    ])

    expect(parser).toHaveBeenCalledTimes(3)
    expect(parser).toHaveBeenCalledWith(
      'examples/default/src/i18n.ts',
      getFileContent('examples/default/src/i18n.ts')
    )
    expect(parser).toHaveBeenCalledWith(
      'examples/default/src/typescript-file.ts',
      getFileContent('examples/default/src/typescript-file.ts')
    )
    expect(parser).toHaveBeenCalledWith(
      'examples/default/src/vue-file.vue',
      getFileContent('examples/default/src/vue-file.vue')
    )
  })
})

/**
 * getFileList
 */
describe('getFileList', () => {
  // Avoid different test results on windows/linux
  const normalizePaths = (paths: string[]) => paths.map(path => path.replace(/\\/g, '/'))

  it('should return list of single files', async () => {
    expect(normalizePaths(
      await getFileList(['examples/namespaces/src/**/*.vue'])
    )).toStrictEqual([
      'examples/namespaces/src/vue-file.vue'
    ])
  })

  it('should return list of files', async () => {
    expect(normalizePaths(
      await getFileList([
        'examples/namespaces/src/**/*.vue',
        'examples/namespaces/src/**/*.ts'
      ])
    )).toStrictEqual([
      'examples/namespaces/src/i18n.ts',
      'examples/namespaces/src/typescript-file.ts',
      'examples/namespaces/src/vue-file.vue',
      'examples/namespaces/src/__tests__/some-test.ts'
    ])
  })

  it('should return list of files with ignore', async () => {
    expect(normalizePaths(
      await getFileList([
        'examples/namespaces/src/**/*.vue',
        'examples/namespaces/src/**/*.ts',
        '!**/__tests__/**'
      ])
    )).toStrictEqual([
      'examples/namespaces/src/i18n.ts',
      'examples/namespaces/src/typescript-file.ts',
      'examples/namespaces/src/vue-file.vue'
    ])
  })
})

/**
 * parseFile
 */
describe('parseFile', () => {
  it('should parse translations of typescript file', async () => {
    const filePath = path.join(__dirname, '../examples/namespaces/src/typescript-file.ts')
    expect(await parseFile(options, filePath)).toStrictEqual(new Set([
      'common:invalid:nested:key',
      'key_1',
      'common:key_2',
      'other:key_1',
      'key_3',
      'context.key_1',
      'context.key_2',
      'context.nested.key',
      'new_key'
    ]))
  })

  it('should parse translations of vue file', async () => {
    const filePath = path.join(__dirname, '../examples/namespaces/src/vue-file.vue')
    expect(await parseFile(options, filePath)).toStrictEqual(new Set([
      'key_1',
      'context.key_1',
      'other:other_key',
      'key_2'
    ]))
  })
})

/**
 * parseContent
 */
describe('parseContent', () => {
  const parseToArray = async (content: string) => Array.from(await parseContent(options, 'some-file.txt', content))

  it('should find translations from content', async () => {
    expect(await parseToArray('$t("key_1")')).toStrictEqual(['key_1'])
    expect(await parseToArray(`$t('key-1')`)).toStrictEqual(['key-1'])
    expect(await parseToArray('$t("with space")')).toStrictEqual(['with space'])
    expect(await parseToArray('$t("with/slash")')).toStrictEqual(['with/slash'])
    expect(await parseToArray('$t("context.key")')).toStrictEqual(['context.key'])
    expect(await parseToArray(`$t('menu', { label: 'some'})`)).toStrictEqual(['menu'])
    expect(await parseToArray('$t("name:some.text")')).toStrictEqual(['name:some.text'])
    expect(await parseToArray(`$t('key_1')    $t('key_2')`)).toStrictEqual(['key_1', 'key_2'])
    expect(await parseToArray(`($t    (     'save'   ))`)).toStrictEqual(['save'])
    expect(await parseToArray(`
      concat($t(
        'translate'
      )
    `)).toStrictEqual(['translate'])
    expect(await parseToArray(`
      $t('one')
      $t('two')
      $t('three')
      $t('four')
    `)).toStrictEqual(['one', 'two', 'three', 'four'])
    expect(await parseToArray(`
      $t('duplicate')
      $t('duplicate')
      $t('duplicate')
    `)).toStrictEqual(['duplicate'])
  })

  it('should not find translations from content', async () => {
    expect(await parseToArray('$t(key_1)')).toStrictEqual([])
    expect(await parseToArray(`$t(\\'key_1\\')`)).toStrictEqual([])
    expect(await parseToArray('a$t("key_1")')).toStrictEqual([])
    expect(await parseToArray('$ t("key_1")')).toStrictEqual([])
    expect(await parseToArray('$x("key_1")')).toStrictEqual([])
    expect(await parseToArray(`$t('tra
        nslate'`
    )).toStrictEqual([])
  })

  it('should parse with custom regex', async () => {
    expect(Array.from(await parseContent({
      ...options,
      parseRegex: /\B\$tc\s*\(\s*['"]([\w/: ._-]+)['"]/g
    }, 'some-file.txt', '$tc("key_1")'))).toStrictEqual(['key_1'])
  })

  it('should parse with parser function', async () => {
    const parser = vi.fn<CustomParser>((_, content) =>
      [...content.matchAll(/\B\$tx\s*\(\s*['"]([\w/: ._-]+)['"]/g)].map((matches) => matches[1]))

    expect(Array.from(await parseContent({
      ...options,
      parser
    }, 'some-file.txt', '$tx("key_1")'))).toStrictEqual(['key_1'])

    expect(parser).toHaveBeenCalledTimes(1)
    expect(parser).toHaveBeenCalledWith('some-file.txt', '$tx("key_1")')
  })
})
