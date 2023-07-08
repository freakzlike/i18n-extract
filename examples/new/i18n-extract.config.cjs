module.exports = {
  input: [
    'examples/new/src/**/*.ts'
  ],
  output: 'examples/new/locales/{{lng}}/{{ns}}.json',
  languages: ['de', 'en-GB'],
  namespaces: ['default', 'other']
}
