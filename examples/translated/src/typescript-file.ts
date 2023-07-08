const $t = (key: string) => `translated: ${key}`


console.log($t('key_1'))
$t('key_2')
$t('key_1')

// Multiline
$t(
  'key_3'
)

$t(   "key_3"   )

/**
 * Not parse this
 */
const $a = $t
const a$t = $t

$a('not_key_1')
a$t('not_key_2')
