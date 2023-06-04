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
    'src/**/*.ts'
  ],
  output: 'locales/{{lng}}/{{ns}}.json',
  languages: ['de', 'en-GB'],
  namespaces: {
    all: ['common', 'other'],
    default: 'common'
  }
}
```
