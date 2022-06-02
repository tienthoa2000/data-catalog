<template lang="pug">
div.clip-drawer
  v-navigation-drawer(
    :value="isClipDrawerOpen"
    @input="toggleClipDrawer"
    absolute
    class="clip-drawer"
    hide-overlay
  )
    v-card(width="260px" flat min-height="100vh" )
      div.drawer-toolbar
        .go-to-clip-management
          nuxt-link(to="/clip")
            span クリップ管理画面へ
        div.breadcrumbs
          span.root-folder(@click="onClickRootBreadcrumbs") クリップ一覧
          span.children-folder(v-for="(folder, index) in breadcrumbs" @click="onClickBreadcrumbs(folder,index)" :key="folder.uniqueId") &nbsp;>&nbsp;{{ folder && folder.name ? folder.name : '' }}
      div.clip-list-wrapper
        div.clip-item(v-for="clip in dataList" @click="onClickClip(clip)")
          img(v-if="clip.type === 'folder'" :src="require('@/assets/icons/clip_folder.svg')")
          img(v-if="clip.label === Category.TABLE" :src="require('@/assets/icons/table.svg')")
          img(v-if="clip.label === Category.VIEW" :src="require('@/assets/icons/view.svg')")
          img(v-if="clip.label === Category.DASHBOARD" :src="require('@/assets/icons/dashboard.svg')")
          img(v-if="clip.label === Category.REPORT" :src="require('@/assets/icons/report.svg')")
          img(v-if="clip.label === Category.DATASET" :src="require('@/assets/icons/dataset.svg')")
          span.text-truncate.d-inline-block(v-tooltip="clip.name") {{ clip.name }}
        //- ClipDrawerPagination(v-model="currentPage" :total-page="totalPage")
  ResultPreviewPanel(
    :open="showPreviewPanel"
    :class="`${showPreviewPanel || 'hide'}`"
    :clickItem="clickItem"
    parentClass=".clip-drawer"
    @onItemClick="resultItemClick"
    @close="onResultPreviewPanelClose"
  )
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  watch,
  onMounted,
  nextTick,
  onBeforeUnmount
} from '@nuxtjs/composition-api'
import { Category } from "~/constants/Category";
import { useAppStore } from "~/store/appModule";
import { Label } from '@/types/base'
import {Clip, ClipFolder, useClipStore} from "~/store/clipModule";
import {ResultItem, useResultStore} from "~/store/resultModule";

// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// let appModule = createNamespacedHelpers('app')

export default defineComponent({
  setup() {
    type BreadCrumbs = Omit<ClipFolder, 'type' | 'children'> // パンくずリストの型
    const appModule = useAppStore()
    const clipModule = useClipStore()
    const resultModule = useResultStore()
    // TODO: Vuex to Pinia
    // const { isClipDrawerOpen } = appModule.useState(['isClipDrawerOpen'])
    // const { toggleClipDrawer } = appModule.useActions(['toggleClipDrawer'])
    // const { ownClipWithUniqueId } = clipModule.useGetters([
    //   'ownClipWithUniqueId'
    // ])
    // const { fetchClips } = clipModule.useActions(['fetchClips'])
    // const {
    //   fetchTableDetail,
    //   fetchViewDetail,
    //   fetchDashboardDetail,
    //   fetchReportDetail,
    //   fetchDatasetDetail
    // } = resultModule.useActions([
    //   'fetchTableDetail',
    //   'fetchViewDetail',
    //   'fetchDashboardDetail',
    //   'fetchReportDetail',
    //   'fetchDatasetDetail'
    // ])

    const isClipDrawerOpen = computed(() => appModule.isClipDrawerOpen)
    const ownClipWithUniqueId = computed(() => clipModule.ownClipWithUniqueId)
    const { fetchClips } = clipModule
    const { toggleClipDrawer } = appModule
    const {
      fetchTableDetail,
      fetchViewDetail,
      fetchDashboardDetail,
      fetchReportDetail,
      fetchDatasetDetail
    } = resultModule

    const dataList = ref<(ClipFolder | Clip)[]>([])
    const breadcrumbs = ref<BreadCrumbs[]>([])
    const showPreviewPanel = ref<Boolean>(false)
    const clickItem = ref<Boolean>(false)

    watch(isClipDrawerOpen, async (val) => {
      if (val) {
        await fetchClips()
        dataList.value = ownClipWithUniqueId.value
      } else {
        breadcrumbs.value = []
      }
    })

    // ユニークIDをクリップ情報に付与する関数
    const uniqueIdAssign = (
      clips: (ClipFolder | Clip)[],
      beforeLastIndex: string
    ) => {
      if (!clips || clips?.length === 0) return []
      const processedClips: (ClipFolder | Clip)[] = clips?.map(
        (e: ClipFolder | Clip, index: number) => {
          const clipsLengthDigits = String(clips.length)?.length // indexの最大値(clips.lenghで取得)の桁数取得
          const uniqueId =
            beforeLastIndex +
            String(index + 1)?.padStart(clipsLengthDigits, '0') // ユニークID生成, padStartで桁数分ゼロパディングさせる
          if (e.type === 'folder') {
            return {
              uniqueId: uniqueId,
              name: e.name,
              type: e.type,
              children: uniqueIdAssign(e.children, uniqueId) // 再帰呼び出しする
            }
          } else {
            return {
              uniqueId: uniqueId,
              id: e.id,
              name: e.name,
              type: e.type,
              label: e.label,
              logicalName: e.logicalName,
              location: e.location,
              wsOrDbScm: e.wsOrDbScm,
              clipDesc: e.clipDesc
            }
          }
        }
      )
      return processedClips
    }
    // ユニークIDが一致するオブジェクトを探索する関数
    const searchFolderMatchingId: (
      clips: (ClipFolder | Clip)[],
      uniqueId: string
    ) => (ClipFolder | Clip)[] = (
      clips: (ClipFolder | Clip)[],
      uniqueId: string
    ) => {
      let matchFolderObj: ClipFolder | Clip | undefined = clips?.find(
        (e) => e.uniqueId === uniqueId && e.type === 'folder'
      ) // ユニークIDが一致するオブジェクトがあるか探索
      if (
        matchFolderObj &&
        matchFolderObj !== undefined &&
        matchFolderObj.type === 'folder'
      ) {
        return matchFolderObj.children
      } else {
        let val: (ClipFolder | Clip)[] = []
        clips?.forEach((e: ClipFolder | Clip) => {
          if (e.type === 'folder' && e.children?.length > 0) {
            val = searchFolderMatchingId(e.children, uniqueId) // 再帰呼び出し
          }
        })
        return val
      }
    }
    // TODO: functionsディレクトリ配下に置いて汎用的にしたいが、以下のエラーが出るため、一旦暫定でここに直書き
    // must call Vue.use(Vuex) before creating a store instance.
    const fetchDetailHandlingOmit = async (id: number, label: Label) => {
      if (!id) return
      switch (label) {
        case Category.TABLE:
          await fetchTableDetail(id)
          break
        case Category.VIEW:
          await fetchViewDetail(id)
          break
        case Category.DASHBOARD:
          await fetchDashboardDetail(id)
          break
        case Category.REPORT:
          await fetchReportDetail(id)
          break
        case Category.DATASET:
          await fetchDatasetDetail(id)
          break
      }
    }
    const onClickClip = (clip: ClipFolder | Clip) => {
      if (clip?.type === 'folder') {
        breadcrumbs.value?.push({ uniqueId: clip.uniqueId, name: clip.name })
        dataList.value = clip.children
      } else if (clip?.type === 'data') {
        fetchDetailHandlingOmit(clip?.id, clip?.label)
        showPreviewPanel.value = true
      }
    }
    const onClickRootBreadcrumbs = async () => {
      breadcrumbs.value = []
      dataList.value = await ownClipWithUniqueId.value
    }
    const onClickBreadcrumbs = async (folder: BreadCrumbs, index: number) => {
      breadcrumbs.value?.splice(index + 1, breadcrumbs.value?.length ?? 0)
      if (!folder.uniqueId) return
      dataList.value = await searchFolderMatchingId(
        ownClipWithUniqueId.value,
        folder.uniqueId
      )
    }
    const resultItemClick = async (item: ResultItem) => {
      showPreviewPanel.value = true
      clickItem.value = false
      await fetchDetailHandlingOmit(item?.id, item?.label as Label)
      clickItem.value = true
    }
    const onResultPreviewPanelClose = () => {
      showPreviewPanel.value = false
    }
    // クリップドロワーと詳細ドロワー以外の要素をクリックしたときに、クリップドロワーを閉じる
    const handleWindowClick = (e: any) => {
      if (!isClipDrawerOpen.value) return
      const panelElm = document.querySelector('.result-preview-panel .content') // 詳細ドロワーの要素
      const clipDrawerElm = document.querySelector('.clip-drawer') // クリップドロワーの要素
      if (
        panelElm &&
        clipDrawerElm &&
        e.target !== panelElm &&
        e.target !== clipDrawerElm &&
        !panelElm.contains(e.target) &&
        !clipDrawerElm.contains(e.target)
      ) {
        toggleClipDrawer(false) // クリップドロワーを閉じる
      }
    }

    onMounted(() => {
      nextTick(() => {
        window.addEventListener('click', handleWindowClick, true)
      })
    })
    onBeforeUnmount(() => {
      window.removeEventListener('click', handleWindowClick, true)
    })

    // const itemPerPage = 15
    // const currentPage = ref(1)
    // const totalPage = ref(Math.ceil(dataList.length / itemPerPage))

    // const dataListDisplay = computed(() => {
    //   return dataList.slice(
    //     (currentPage.value - 1) * itemPerPage,
    //     currentPage.value * itemPerPage
    //   )
    // })
    return {
      // currentPage,
      // totalPage,
      // dataListDisplay,
      dataList,
      breadcrumbs,
      isClipDrawerOpen,
      toggleClipDrawer,
      Category,
      showPreviewPanel,
      clickItem,
      onClickClip,
      onClickRootBreadcrumbs,
      onClickBreadcrumbs,
      resultItemClick,
      onResultPreviewPanelClose
    }
  }
})
</script>
<style lang="stylus" scoped>
.clip-drawer
  z-index 101
  left 64px
  box-shadow 0 3px 6px #00000029
  background #F4F6F7
  .v-card
    height 100%
    padding 19px
    background inherit
    .drawer-toolbar
      display flex
      flex-wrap wrap
      width 100%
      justify-content space-between
      .breadcrumbs
        font-size 16px
        color #777777
        font-weight bold
        width 100%
        white-space nowrap
        overflow-x scroll
        padding-bottom 12px
        .root-folder
          cursor pointer
        .children-folder
          cursor pointer
      .go-to-clip-management
        margin-bottom 1rem
        color #43A5C4
        width 100%
        font-size 12px
        display flex
        align-self center
        a
          text-decoration none
    .clip-list-wrapper
      padding 0
      margin 0
      display flex
      flex-direction column
      justify-content space-around
      .clip-item
        width 100%
        height 44px
        background #FFFFFFF2
        box-shadow 1px 1px 2px #00000029
        border-radius 8px
        margin-bottom 6px
        display inline-flex
        justify-self center
        padding 12px 16px
        cursor: pointer;
        img
          margin-right 8px
        span
          font-weight bold
          font-size 14px
          color #41434E
</style>
