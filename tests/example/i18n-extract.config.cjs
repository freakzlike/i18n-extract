module.exports = {
  input: [
    'tests/example/src/**/*.vue',
    'tests/example/src/**/*.ts',
    '!**/__tests__/**'
  ],
  output: 'tests/example/locales/{{lng}}/{{ns}}.json',
  languages: ['de', 'en-GB'],
  namespaces: {
    all: ['common', 'other'],
    default: 'common'
  }
}
