module.exports = {
  input: [
    'examples/default/src/**/*.vue',
    'examples/default/src/**/*.ts',
    '!**/__tests__/**'
  ],
  output: 'examples/default/locales/{{lng}}.json',
  languages: ['de', 'en-GB'],
  suffixes: ['_plural']
}
