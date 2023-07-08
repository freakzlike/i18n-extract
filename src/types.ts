export type Language = string
export type Namespace = string
export type TranslationKey = string

export type ParseResult = Record<Namespace, TranslationKey[]>

export type TranslationValue = string | { [p: TranslationKey]: TranslationValue }
export type TranslationStructure = Record<TranslationKey, TranslationValue>

export interface TranslationResult {
  translations: TranslationStructure
}

export interface TranslationResultWrite extends TranslationResult {
  untranslatedCount: number
}

export type TranslationMap <T extends TranslationResult = TranslationResult> = Record<Language, Record<Namespace, T & { filePath: string}>>

export type TranslationMapLoad = TranslationMap
export type TranslationMapWrite = TranslationMap<TranslationResultWrite>

export interface I18nExtractOptions {
  input: string[]
  output: string
  languages: Language[]
  defaultNamespace?: Namespace
  namespaces?: Namespace[]
  defaultValue?: string
}
