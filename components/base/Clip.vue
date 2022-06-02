<template lang="pug">
div(class="text-left")
  v-row
    v-col
      v-icon(aria-label="range" role="img" aria-hidden="false") {{ mdiPaperclip }}
      span {{ $t('clip.C0001') }}
    v-spacer
    v-col
      span {{ $t('clip.C0002') }}
        v-icon(cclass="icon-space-left" aria-label="chevron-right" role="img" aria-hidden="false") {{ mdiChevronRight }}
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mdiPaperclip, mdiChevronRight } from '@mdi/js'

export default defineComponent({
  data: () => ({
    mdiPaperclip,
    mdiChevronRight
  })
})
</script>
<style lang="stylus" scoped>
</style>
