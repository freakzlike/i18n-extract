import type { I18nExtractOptions } from '@/types'
import { parseFiles } from './parse'

export const i18nExtract = async (options: I18nExtractOptions) => {
  const defaultNamespace = options.defaultNamespace || 'default'
  const translations = await parseFiles(options.input, {
    defaultNamespace
  })
  console.log('found translations', translations)
}
