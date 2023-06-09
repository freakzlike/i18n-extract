module.exports = {
  input: [
    'examples/namespaces/src/**/*.vue',
    'examples/namespaces/src/**/*.ts',
    '!**/__tests__/**'
  ],
  output: 'examples/namespaces/locales/{{lng}}/{{ns}}.json',
  languages: ['de', 'en-GB'],
  defaultNamespace: 'common'
}
