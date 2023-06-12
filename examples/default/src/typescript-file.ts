import { $t } from './i18n'

console.log($t('key_1'))
$t('key_2')
$t('key_1')

// Multiline
$t(
  'key_3'
)

$t(   "key_3"   )

$t('context.key_1')
$t('context.key_2')
$t('context.nested.key')
$t('new_key')

/**
 * Not parse this
 */
const $a = $t
const a$t = $t

$a('not_key_1')
a$t('not_key_2')
