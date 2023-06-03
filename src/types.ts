export type InputPattern = string | string[]

export interface I18nExtractOptions {
  input: InputPattern
  ignore?: InputPattern
  output: string
  languages: string[]
  namespaces?: {
    all: string[]
    default: string
  }
}
