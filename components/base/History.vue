<template lang="pug">
div(class="text-left")
  v-row
    v-col
      v-icon(aria-label="range" role="img" aria-hidden="false") {{ mdiHistory }}
      span {{ $t('history.H0001') }}
    v-spacer
    v-col
      span {{ $t('history.H0002') }}
        v-icon(class="icon-space-left" aria-label="chevron-right" role="img" aria-hidden="false") {{ mdiChevronRight }}

</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mdiHistory, mdiChevronRight } from '@mdi/js'

export default defineComponent({
  data: () => ({
    mdiHistory,
    mdiChevronRight
  })
})
</script>
<style lang="stylus" scoped>
</style>
