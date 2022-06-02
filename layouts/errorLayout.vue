<template lang="pug">
  v-app
    BaseInitialLoading(:loading='initialLoading' :opacity="1")
    BaseLoadingCircle(:loading='loading')
    BaseMenu
    v-main(app)
      v-container(fluid class="align-start no-padding-top pa-0")
        div.content
          nuxt
</template>
<script lang="ts">
import {computed, defineComponent} from '@nuxtjs/composition-api'
import { useAppStore } from "~/store/appModule";
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// let appModule = createNamespacedHelpers('app')

export default defineComponent({
  name: 'default',
  setup() {
    const appModule = useAppStore()
    const loading = computed(() => appModule.loading)
    const initialLoading = computed(() => appModule.initialLoading)
    return { loading, initialLoading }
  }
})
</script>
<style lang="stylus" scoped>
.v-application
  font-family 'Yu Gothic UI','Yu Gothic', 'Hiragino Kaku Gothic Pro', 'Hiragino Kaku Gothic ProN', Arial
/* Font Family */
/* Yu Gothic UI -> YuGothR.ttc */
/* Yu Gothic -> YuGothM.ttc YuGothL.ttc YuGothB.ttc */
/* Hiragino Kaku Gothic Pro -> ヒラギノ角ゴシック W6.ttc*/
/* Hiragino Kaku Gothic ProN ->  ヒラギノ角ゴシック W3.ttc */
.no-padding-top
  padding-top 0px
.container
  height 100%
div
  height 100%
.loading-page
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  background rgba(255,255,255,0.8)
  z-index 999
  .progress-linear
    width 100%
    min-width 300px
    color #43a5c4
</style>
