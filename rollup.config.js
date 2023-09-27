import ts from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

function createEntry (options) {
  const { format, output } = options

  const config = {
    input: 'src/index.ts',
    external: [
      'fast-glob'
    ],
    plugins: [
      resolve(),
      commonjs(),
      ts({
        include: ['src/**/*.ts'],
        compilerOptions: {
          declaration: format === 'es',
          target: 'es2022',
          module: format === 'cjs' ? 'es2022' : 'esnext'
        }
      })
    ],
    output: {
      name: 'I18nExtract',
      file: output,
      format
    }
  }

  console.log(`Building ${format}: ${config.output.file}`)

  return config
}

export default [
  createEntry({ format: 'es', output: 'dist/i18n-extract.js' }),
  createEntry({ format: 'cjs', output: 'dist/i18n-extract.cjs' })
]
