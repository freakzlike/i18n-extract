export type Language = string
export type Namespace = string
export type TranslationKey = string

export type TranslationKeyList = Set<TranslationKey>
export type ParseResult = Record<Namespace, TranslationKeyList>

export type TranslationValue = string | { [p: TranslationKey]: TranslationValue }
export type TranslationStructure = Record<TranslationKey, TranslationValue>

export type TranslationMap = Record<Language, Record<Namespace, {
  filePath: string
  translations: TranslationStructure
}>>

export interface I18nExtractOptions {
  input: string[]
  output: string
  languages: Language[]
  defaultNamespace?: Namespace
}
