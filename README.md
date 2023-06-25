# @freakzlike/i18n-extract

[![Latest Version](https://img.shields.io/npm/v/@freakzlike/i18n-extract.svg)](https://www.npmjs.com/package/@freakzlike/i18n-extract)
[![License](https://img.shields.io/npm/l/i18n-extract.svg)](https://github.com/freakzlike/i18n-extract/blob/main/LICENSE)

Minimalistic and low dependency translation key extractor

## Execute

```shell
i18n-extract ./i18n-extract.config.cjs
```

## Config

```js
// i18n-extract.config.cjs
module.exports = {
  input: [
    'src/**/*.vue',
    'src/**/*.ts',
    // Don't extract from tests
    '!**/__tests__/**'
  ],
  // Output path with placeholders
  // Example: locales/de/common.json
  output: 'locales/{{lng}}/{{ns}}.json',
  languages: ['de', 'en-GB'],
  // Optional: Default namespace if none given in translation
  defaultNamespace: 'common',
  // Optional: Namespaces
  namespaces: ['common', 'other'],
  // Default value for new translations
  defaultValue: '__MISSING_TRANSLATION__'
}
```
