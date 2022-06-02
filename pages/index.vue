<template lang="pug">
div(id="home-page" class="home-content")
  BaseSearch(@rendered="onChildRendered('BaseSearch')" @onSearchRedirect='onSearchResult')
  ResultClip(@rendered="onChildRendered('ResultClip')")
  // BaseSysOverview(@rendered="onChildRendered('BaseSysOverview')")
  ResultPreviewPanel(
    :open="showPreviewPanel"
    :class="`${showPreviewPanel || 'hide'}`"
    parentClass=".home-content"
    @close="onResultPreviewPanelClose"
    @rendered="onChildRendered('ResultPreviewPanel')"
  )
</template>
<script lang="ts">
import { defineComponent, ref, useRouter } from '@nuxtjs/composition-api'
import { useAppStore } from "~/store/appModule";
import { useClipStore } from "~/store/clipModule";
// TODO: Vuex to pinia
// import appModule from '~/store/app/app'

export default defineComponent({
  name: 'home',
  setup(_, context) {
    const appModule = useAppStore()
    const clipModule = useClipStore()
    let isBaseSearchRendered = false
    let isResultClipRendered = false
    let isBaseSysOverview = false
    let isResultPreviewPanelRendered = false
    let showPreviewPanel = ref(false)

    const onResultPreviewPanelClose = () => {
      showPreviewPanel.value = false
    }
    const onChildRendered = (componentName: string) => {
      switch (componentName) {
        case 'BaseSearch':
          isBaseSearchRendered = true
          break
        case 'ResultClip':
          isResultClipRendered = true
          break
        case 'BaseSysOverview':
          isBaseSysOverview = true
          break
        case 'ResultPreviewPanel':
          isResultPreviewPanelRendered = true
          break
        default:
          break
      }
      if (
        isBaseSearchRendered &&
        isResultClipRendered &&
        // isBaseSysOverview &&
        isResultPreviewPanelRendered
      )
        appModule.disableLoading()
      appModule.disableInitialLoading()
    }
    const router = useRouter()
    const onSearchResult = async (apiUrl: any) => {
      await router.push(`/result?${apiUrl}`)
    }

    return {
      showPreviewPanel,
      onResultPreviewPanelClose,
      onChildRendered,
      onSearchResult
    }
  }
})
</script>
<style lang="stylus" scoped>
@import '@/assets/stylus/pages/home.styl'
#home-page {
  background-color: #F4F6F6;
  min-height 100vh;
}
</style>
