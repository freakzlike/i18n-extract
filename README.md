# @freakzlike/i18n-extract

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
  namespaces: ['common', 'other']
}
```
