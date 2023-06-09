<template>
  <div>
    <div>
      {{ $t('key_1') }}
      {{ $t('context.key_1') }}
    </div>
    <div :data-test="$t('key_4')" />
    <div>
      {{ label }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { $t } from './i18n'

const label = computed(() => $t('key_2'))
</script>
