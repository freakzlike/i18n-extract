module.exports = {
  input: [
    'examples/translated/src/**/*.ts'
  ],
  output: 'examples/translated/locales/{{lng}}.json',
  languages: ['de', 'en-GB']
}
