export interface I18nExtractOptions {
  input: string[]
  output: string
  languages: string[]
  namespaces?: {
    all: string[]
    default: string
  }
}
