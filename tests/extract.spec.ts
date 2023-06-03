import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { getFileList, parseContent, parseFile, parseFiles } from '@/extract'

/**
 * parseFiles
 */
describe('parseFiles', () => {
  it('should parse all files', async () => {
    expect(Array.from(
      await parseFiles([
        'tests/example/src/**/*.vue',
        'tests/example/src/**/*.ts'
      ], [
        '**/__tests__/**'
      ])
    ).sort()).toStrictEqual([
      'common:key_2',
      'context.key_1',
      'context.key_2',
      'context.nested.key',
      'key_1',
      'key_2',
      'key_3',
      'other:key_1',
      'other:other_key'
    ])
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
      await getFileList('tests/example/src/**/*.vue')
    )).toStrictEqual([
      'tests/example/src/vue-file.vue'
    ])
  })

  it('should return list of files', async () => {
    expect(normalizePaths(
      await getFileList([
        'tests/example/src/**/*.vue',
        'tests/example/src/**/*.ts'
      ])
    )).toStrictEqual([
      'tests/example/src/vue-file.vue',
      'tests/example/src/typescript-file.ts',
      'tests/example/src/i18n.ts',
      'tests/example/src/__tests__/some-test.ts'
    ])
  })

  it('should return list of files with ignore', async () => {
    expect(normalizePaths(
      await getFileList([
        'tests/example/src/**/*.vue',
        'tests/example/src/**/*.ts'
      ], [
        '**/__tests__/**'
      ])
    )).toStrictEqual([
      'tests/example/src/vue-file.vue',
      'tests/example/src/typescript-file.ts',
      'tests/example/src/i18n.ts'
    ])
  })
})

/**
 * parseFile
 */
describe('parseFile', () => {
  it('should parse translations of typescript file', async () => {
    const filePath = path.join(__dirname, 'example/src/typescript-file.ts')
    expect(await parseFile(filePath)).toStrictEqual(new Set([
      'key_1',
      'common:key_2',
      'other:key_1',
      'key_3',
      'context.key_1',
      'context.key_2',
      'context.nested.key'
    ]))
  })

  it('should parse translations of vue file', async () => {
    const filePath = path.join(__dirname, 'example/src/vue-file.vue')
    expect(await parseFile(filePath)).toStrictEqual(new Set([
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
  const parseToArray = async (content: string) => Array.from(await parseContent(content))

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
})

