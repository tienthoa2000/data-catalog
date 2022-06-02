<template lang="pug">
div(id="home-page" class="result-content")
  BaseSearch(@rendered="onChildRendered('BaseSearch')" @onSearchRedirect='onSearchResult')
  ResultList(@onItemClick="resultItemClick" @rendered="onChildRendered('ResultClip')")
  ResultPreviewPanel(
    :open="showPreviewPanel"
    :class="`${showPreviewPanel || 'hide'}`"
    :clickItem="clickItem"
    parentClass=".result-content"
    @onItemClick="resultItemClick"
    @close="onResultPreviewPanelClose"
    @rendered="onChildRendered('ResultPreviewPanel')"
  )
  div(v-show="!showPreviewPanel && showItemsLength > 0" @click="openDetailDrawer" class="detail-drawer-tab")
    img(:src="require('@/assets/icons/detail_drawer_arrow.svg')")
</template>

<script lang="ts">
import { mdiPaperclip, mdiClose } from '@mdi/js'
import {
  mdiArrowCollapseAll,
  mdiArrowExpandAll,
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight
} from '@mdi/js'
import {computed, defineComponent, ref, useRouter} from '@nuxtjs/composition-api'
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// import _resultModule, { ResultState, ResultItem } from '~/store/result/results'
// let resultModule = createNamespacedHelpers<ResultState>('results')
// import appModule from '~/store/app/app'
import {ResultItem, useResultStore} from "~/store/resultModule";
import {useAppStore} from "~/store/appModule";
import {Category} from "~/constants/Category";
import { useClipStore } from "~/store/clipModule";

export default defineComponent({
  name: 'result',
  setup() {
    const appModule = useAppStore()
    const resultModule = useResultStore()
    const clipModule = useClipStore()

    let isBaseSearchRendered = false
    let isResultClipRendered = false
    let isResultPreviewPanelRendered = false
    const showPreviewPanel = ref(false)
    const clickItem = ref(false)

    // TODO: Vuex to Pinia
    // const { showItemsLength } = resultModule.useGetters(['showItemsLength'])

    const showItemsLength = computed(() => resultModule.showItemsLength)

    const fetchDetailHandling = async (item: ResultItem) => {
      if (!item) return
      switch (item?.label) {
        case Category.TABLE:
          await resultModule.fetchTableDetail(item.id)
          break
        case Category.VIEW:
          await resultModule.fetchViewDetail(item.id)
          break
        case Category.DASHBOARD:
          await resultModule.fetchDashboardDetail(item.id)
          break
        case Category.REPORT:
          await resultModule.fetchReportDetail(item.id)
          break
        case Category.DATASET:
          await resultModule.fetchDatasetDetail(item.id)
          break
      }
    }

    const resultItemClick = async (item: ResultItem) => {
      if (!item) return
      showPreviewPanel.value = true
      clickItem.value = false
      await fetchDetailHandling(item)
      clickItem.value = true
    }
    const onResultPreviewPanelClose = () => {
      showPreviewPanel.value = false
      clickItem.value = false
    }
    const openDetailDrawer = () => {
      showPreviewPanel.value = true
    }
    const router = useRouter()
    const onSearchResult = async (apiUrl: any) => {
      await router.push(`/result?${apiUrl}`)
    }
    const onChildRendered = (componentName: string) => {
      switch (componentName) {
        case 'BaseSearch':
          isBaseSearchRendered = true
          break
        case 'ResultClip':
          isResultClipRendered = true
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
        isResultPreviewPanelRendered
      ) {
        appModule.disableLoading()
        appModule.disableInitialLoading()
      }
    }

    return {
      mdiPaperclip,
      mdiArrowCollapseAll,
      mdiArrowExpandAll,
      mdiChevronDoubleLeft,
      mdiChevronDoubleRight,
      mdiClose,
      showPreviewPanel,
      clickItem,
      showItemsLength,
      resultItemClick,
      openDetailDrawer,
      onResultPreviewPanelClose,
      onChildRendered,
      onSearchResult
    }
  }
})
</script>
<style lang="stylus" scoped>
  @import '@/assets/stylus/pages/home.styl'

.result-content
  background-color #F4F6F7
  overflow-x: scroll
  height 100%
.bg-color
  background-color whitesmoke
.v-sheet
  top 0.5em !important
.tab-color
  border-top-left-radius 10px
  border-top-right-radius 10px
  max-height 1.8em
.icon-place
  bottom 1em
.link-color
  color #43a5c4 !important
.detail-drawer-tab
  position absolute
  right 0
  top 0
  height 100%
  width 22px
  background-color #FFFFFF
  display flex
  justify-content center
  align-items center
.detail-drawer-tab:hover
  background-color #ededed
</style>
