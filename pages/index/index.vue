<template lang="pug">
  div#index-list
    BaseScreenToolbarTitle(screenTitle="インデックス一覧 ")
    div.index-content
      div.expand-nav(@click="drawer = !drawer")
        img(:src="require('@/assets/icons/expand-nav.svg')" height="36px")
      div#leftNavIndex.left-nav-index(v-show='drawer')
        BaseTreeList(
          :drawer="drawer"
          :selectOptions='true'
          :dottedLine='true'
          @selectTreeItem='onSelectTreeItem'
          @dataRendered="onTreeListRendered"
        )
        div.shrink-nav(@click="drawer = !drawer")
          img(:src="require('@/assets/icons/shrink-nav.svg')" height="36px")
      div#indexDocument.article
        IndexTable(:isFetchData="isFetchData" @onSelectRow='onSelectRow')
      ResultPreviewPanel(
        :open="showPreviewPanel"
        :class="`${showPreviewPanel || 'hide'}`"
        :clickItem="clickItem"
        parentClass=".index-content"
        @onItemClick="onSelectRow"
        @close="onResultPreviewPanelClose"
      )
      div(v-show="!showPreviewPanel && showItemsLength > 0" @click="openDetailDrawer" class="detail-drawer-tab")
        img(:src="require('@/assets/icons/detail_drawer_arrow.svg')")
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  nextTick,
  watch, computed
} from '@nuxtjs/composition-api'
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// import appModule from '~/store/app/app'
// import _resultModule, { ResultState, ResultItem } from '~/store/result/results'
// let resultModule = createNamespacedHelpers<ResultState>('results')
import { useAppStore } from "~/store/appModule";
import {ResultItem, useResultStore} from "~/store/resultModule";
import {Category} from "~/constants/Category";
import {useClipStore} from "~/store/clipModule";

export default defineComponent({
  name: 'index',
  setup() {
    const resultModule = useResultStore()
    const appModule = useAppStore()
    const clipModule = useClipStore()
    const isFetchData = ref(false)
    const showPreviewPanel = ref(false)
    const clickItem = ref(false)
    const drawer = ref(true)

    // TODO: Vuex to Pinia
    // const { showItemsLength } = resultModule.useGetters(['showItemsLength'])
    const showItemsLength = computed(() => resultModule.showItemsLength)

    watch(drawer, (val) => {
      let indexDocument: HTMLElement | null = document.getElementById(
        'indexDocument'
      )
      if (val) {
        nextTick(() => {
          initResizeElement()
        })
      } else if (indexDocument !== null) {
        indexDocument.style.width = '100%'
        indexDocument.style.marginLeft = '0'
      }
    })
    watch(showPreviewPanel, (val) => {
      drawer.value = !val
    })
    onMounted(() => {
      nextTick(() => {
        initResizeElement()
        appModule.disableLoading()
        appModule.disableInitialLoading()
      })
    })
    const onSelectTreeItem = () => {
      isFetchData.value = true
    }
    const fetchDetailHandling = async (item: ResultItem) => {
      console.log('ksdbhkj',item)
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
    const onSelectRow = async (item: ResultItem) => {
      showPreviewPanel.value = true

      await fetchDetailHandling(item)
      clickItem.value = true
    }
    const onResultPreviewPanelClose = () => {
      showPreviewPanel.value = false
      clickItem.value = false
      nextTick(() => {
        initResizeElement()
      })
    }
    const openDetailDrawer = () => {
      showPreviewPanel.value = true
    }
    function maxNavItemWidth() {
      let navigationData = Array.from(
        document.querySelectorAll('#mainNavIndex li .title-li p')
      )
      let arrWidth = navigationData.map((data) => data.scrollWidth)
      return Math.max(...arrWidth)
    }
    function initResizeElement() {
      let popups: HTMLCollectionOf<Element> = document.getElementsByClassName(
        'left-nav-index'
      )
      let element: any = null
      let startX: any, startY: any, startWidth: number | null, startHeight: any
      let leftNavIndex:
        | HTMLElement
        | null
        | undefined = document.getElementById('leftNavIndex')
      let mainNavIndex: HTMLElement | null = document.getElementById(
        'mainNavIndex'
      )
      let indexDocument: HTMLElement | null = document.getElementById(
        'indexDocument'
      )
      let right: any
      if (
        indexDocument === null ||
        mainNavIndex === null ||
        leftNavIndex == null
      )
        return
      // fit content width in left navigation
      leftNavIndex.style.width = maxNavItemWidth() + 40 + 24 + 'px'
      mainNavIndex.style.width = maxNavItemWidth() + 40 + 'px'

      let leftNavWidth = leftNavIndex.clientWidth

      // ドロワー展開要素があればその分もwidthから引く
      if (!showPreviewPanel.value && showItemsLength.value > 0) {
        indexDocument.style.width = 'calc(100% - ' + (leftNavWidth + 22) + 'px)'
      } else {
        indexDocument.style.width = 'calc(100% - ' + leftNavWidth + 'px)'
      }
      indexDocument.style.marginLeft = leftNavWidth + 'px'
      mainNavIndex.style.width = leftNavWidth - 24 + 'px'
      for (var i = 0; i < popups.length; i++) {
        let p = popups[i]
        right = document.getElementsByClassName('resizer-right')[0]
        right.addEventListener('mousedown', initDrag, false)
        right.parentPopup = p
      }

      function initDrag(e: any) {
        element = right.parentPopup

        startX = e.clientX
        startY = e.clientY
        const defaultViewWidth:
          | string
          | undefined = document?.defaultView?.getComputedStyle(element)?.width
        const defaultViewHeight:
          | string
          | undefined = document?.defaultView?.getComputedStyle(element).height
        if (defaultViewWidth === undefined) return
        startWidth = parseInt(defaultViewWidth, 10)
        if (defaultViewHeight === undefined) return
        startHeight = parseInt(defaultViewHeight, 10)
        document.documentElement.addEventListener('mousemove', doDrag, false)
        document.documentElement.addEventListener('mouseup', stopDrag, false)
      }

      function doDrag(e: any) {
        element.style.width = startWidth + e.clientX - startX + 'px'
        let leftNavWidth = document.getElementById('leftNavIndex')?.clientWidth
        if (
          leftNavWidth === null ||
          leftNavWidth === undefined ||
          mainNavIndex === null
        )
          return
        mainNavIndex.style.width = leftNavWidth - 24 + 'px'
        if (indexDocument) {
          indexDocument.style.width = 'calc(100% - ' + leftNavWidth + 'px)'
          indexDocument.style.marginLeft = leftNavWidth + 'px'
        }
      }

      function stopDrag() {
        document.documentElement.removeEventListener('mousemove', doDrag, false)
        document.documentElement.removeEventListener('mouseup', stopDrag, false)
        let leftNavWidth = document.getElementById('leftNavIndex')?.clientWidth
        if (
          leftNavWidth === null ||
          leftNavWidth === undefined ||
          mainNavIndex === null
        )
          return
        mainNavIndex.style.width = leftNavWidth - 24 + 'px'
        if (indexDocument) {
          indexDocument.style.width = 'calc(100% - ' + leftNavWidth + 'px)'
          indexDocument.style.marginLeft = leftNavWidth + 'px'
        }
      }
    }

    const onTreeListRendered = () => {
      let leftNavIndex:
        | HTMLElement
        | null
        | undefined = document.getElementById('leftNavIndex')
      let mainNavIndex: HTMLElement | null = document.getElementById(
        'mainNavIndex'
      )
      if (mainNavIndex === null || leftNavIndex == null) return

      leftNavIndex.style.width = maxNavItemWidth() + 40 + 24 + 'px'
      mainNavIndex.style.width = maxNavItemWidth() + 40 + 'px'
    }

    return {
      isFetchData,
      drawer,
      showItemsLength,
      showPreviewPanel,
      clickItem,
      onSelectTreeItem,
      onSelectRow,
      onResultPreviewPanelClose,
      openDetailDrawer,
      onTreeListRendered
    }
  }
})
</script>
<style lang="stylus">
html main.v-main
  height 100% !important
#index-list
  height 100%
  background #FCFCFC 0 0 no-repeat padding-box
  overflow hidden
  .index-content
    margin-top 53px
    height calc(100% - 53px)
    .left-nav-index
      position relative
      float left
      width 204px
      min-width 204px
      max-width calc(100% - 616px)
      z-index 11
      overflow hidden
      padding 0
      user-select none
      height 100%
      min-height 768px
      background transparent
      top 0
      transition display 1s ease-out
    .expand-nav
      z-index 10
      position absolute
      top 53px
      left 0
      cursor pointer
    .shrink-nav
      width 24px
      background transparent
      z-index 13
      cursor pointer
      position absolute
      top 0
      right 0
    .article
      padding 8px
      width calc(100% - 204px)
      min-width 616px
      margin-left 204px
      min-height 768px
      height 100%
.detail-drawer-tab
  position absolute
  z-index 90
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
