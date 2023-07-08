#!/usr/bin/env node
const { i18nCheck } = require('../dist/i18n-extract.cjs')
const path = require('node:path')

const args = process.argv.slice(2)
if (!args.length || !args[0]) {
  console.log('Error: Missing config path')
  process.exit()
}

const options = require(path.resolve(process.cwd(), args[0]))
i18nCheck(options).then(result => {
  if (!result) {
    process.exit(1)
  }
})
