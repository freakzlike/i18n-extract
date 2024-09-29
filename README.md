# @freakzlike/i18n-extract

[![Latest Version](https://img.shields.io/npm/v/@freakzlike/i18n-extract.svg)](https://www.npmjs.com/package/@freakzlike/i18n-extract)
[![License](https://img.shields.io/npm/l/i18n-extract.svg)](https://github.com/freakzlike/i18n-extract/blob/main/LICENSE)

Minimalistic and low dependency translation key extractor.

Searchs for usage of `$t` and writes keys to JSON files.

Input from source code
```javascript
$t('some_key')

// with namespace to split into separate files
$t('common:some_key')

// nested key
$t('messages.success')
```

Output to translation file
```json
{
  "some_key": "__MISSING_TRANSLATION__",
  "messages": {
    "success": "__MISSING_TRANSLATION__"
  }
}
```

## Requirements
* Node.js >= `18.15.0`

Might as well work with lower Node.js versions. Developed and tested on `18.15.0`.

## Execute

Extracts translations from source files and writes translation files:

```shell
i18n-extract ./i18n-extract.config.cjs
```

Extract translations from source files and checks for untranslated messages.
Can be used in CI and does not write the translation files.

```shell
i18n-check ./i18n-extract.config.cjs
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
  // Optional: Default value for new translations
  defaultValue: '__MISSING_TRANSLATION__',
  // Optional: Regex to extract transations from source code
  // The translation key must be the first match
  parseRegex: /\B\$t\s*\(\s*['"]([\w/: ._-]+)['"]/g,
  // Optional: Parser function, receives file content as string and should return list of found translation keys
  // Type: (filePath: string, content: string) => string[]
  parser: (filePath, content) =>
    [...content.matchAll(/\B\$t\s*\(\s*['"]([\w/: ._-]+)['"]/g)].map((matches) => matches[1]),
  // Optional: Keep missing translations and not delete them
  keepMissing: false
}
```
