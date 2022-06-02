<template lang="pug">
    section(class="result-detail")
        //- v-row(class="child-flex")
        transition(name='bounce')
          div.clip-dialog(v-if='isOpenClipDialog & isExistingFolder')
            v-card#clip-form
                v-card-text
                  //- //- TODO:フォルダ名選択できる様にする
                  //- span.label {{ 'フォルダ名' }}
                  //- div#clip-select-destination-folder
                  //-   v-select(
                  //-     id="clipFolderSelect"
                  //-     :items='folders'
                  //-     v-model='selectedFolder'
                  //-     attach=".v-select"
                  //-     solo
                  //-     background-color='#F2F2F2'
                  //-     hide-details
                  //-     dense
                  //-     class="v-select-folder"
                  //-   )
                  //-   span.switch-selection(@click='onSwitchSelectFolder') 新規フォルダ作成
                  //- div.mt-3
                  span.label クリップ説明文
                  v-textarea(
                    v-model='clipDescription'
                    solo
                    background-color='#F2F2F2'
                    height='120px'
                    hide-details
                  )
                v-divider
                v-card-actions
                  v-spacer
                  v-btn(outlined color='#43A5C4' @click='onCloseClipDialog') キャンセル
                  v-btn(dark color='#43A5C4' @click='onSaveClip') 保存
        transition(name='bounce')
          div.clip-dialog(v-if='isOpenClipDialog && !isExistingFolder')
            v-card#clip-form
                v-card-text
                  span.label {{ '保存先フォルダ' }}
                    div#clip-create-new-folder
                      v-text-field(
                        v-model='selectedFolder'
                        solo
                        background-color='#F2F2F2'
                        hide-details
                        dense
                        class="v-input-folder"
                      )
                      span.switch-selection(@click='onSwitchSelectFolder') 既存フォルダ選択
                  div.mt-3
                  span.label クリップ説明文
                  v-textarea(
                    v-model='clipDescription'
                    solo
                    background-color='#F2F2F2'
                    height='120px'
                    hide-details
                  )
                v-divider
                v-card-actions
                  v-spacer
                  v-btn(outlined color='#43A5C4' @click='onCloseClipDialog') キャンセル
                  v-btn(dark color='#43A5C4' @click='onSaveClip') 保存
        div(class="bg-color")
            v-row(no-gutters class="tabs")
                div(class="resize-box")
                    v-btn(icon v-if="!isExpanded" class="hidden-xs-onl" @click="$emit('expand')")
                      img(:src="require('@/assets/icons/detail_expand.svg')" class="resize-btn" width="20px")
                    v-btn(icon v-if="isExpanded" class="hidden-xs-onl" @click="$emit('collapse')")
                      img(:src="require('@/assets/icons/detail_collapse.svg')" class="resize-btn" width="20px")
                div(:class="['d-flex align-center result-item-tab',selectedItem && item.id === selectedItem.id ? 'tab-active': '']" v-for="(item, index) in showItems" )
                  div(class="d-flex align-center content-tab" :key="index" @click="onSelectItemClick(item)")
                    v-img(v-if="item.label === Category.TABLE" :src="require('@/assets/icons/table.svg')" class="icon-size" max-width="16px")
                    v-img(v-if="item.label === Category.VIEW" :src="require('@/assets/icons/view.svg')" class="icon-size" max-width="16px")
                    v-img(v-if="item.label === Category.DASHBOARD" :src="require('@/assets/icons/dashboard.svg')" class="icon-size" max-width="16px")
                    v-img(v-if="item.label === Category.REPORT" :src="require('@/assets/icons/report.svg')" class="icon-size" max-width="16px")
                    v-img(v-if="item.label === Category.DATASET" :src="require('@/assets/icons/dataset.svg')" class="icon-size" max-width="16px")
                    span(v-if="item.name" class="text-small font-weight-bold text-truncate d-inline-block") {{ item.name || '' }}
                    //- span(class="text-small font-weight-bold")
                      //- TextTruncate(:value="selectedItemName" :maxCharNum="16")
                  v-spacer
                  v-icon(@click="onCloseItemClick(item, index)" class="link-color" small) {{ mdiClose }}
                div.close-all-tab.d-flex.align-center(@click='onCloseAllTab')
                  div.d-flex.align-center.content-tab
                    v-icon(class="link-color" small) {{ mdiClose }}
                    span タブをすべて閉じる
                v-spacer
                v-spacer

        //- v-btn(x-small text-center color="white")
        //-   v-icon(color="primary") {{ mdiChevronDoubleRight }}
        v-tabs(v-model="tab" align-with-title fixed-tabs)
            v-tabs-slider
            v-tab {{ $t('table_detail_tab.T0001') }}
            v-tab {{ $t('table_detail_tab.T0002') }}
            v-tab {{ $t('table_detail_tab.T0003') }}
            v-btn(fab x-small text-center color="white" elevation="3" class="icon-margin tab-action" @click='showClipDialog')
              img(:src="require('@/assets/icons/search_clip_blue.svg')")
        v-tabs-items(v-model="tab")
            v-tab-item
                ResultTableTab(v-if="selectedItemType === Category.TABLE")
                ResultViewTab(v-if="selectedItemType === Category.VIEW")
                ResultDashboardTab(v-if="selectedItemType === Category.DASHBOARD" @onChildClick="$emit('onChildClick', $event)")
                ResultReportTab(v-if="selectedItemType === Category.REPORT" @onChildClick="$emit('onChildClick', $event)")
                ResultDatasetTab(v-if="selectedItemType === Category.DATASET")
            v-tab-item
                ResultLineageTab(:isExpanded="isExpanded" :tabIndex="tab" @onShowDetailClick="changeTabDetailed" :loadLineageRandom='loadLineageRandom' :selectedItem='selectedItem')
            v-tab-item
                ResultRelationForceTab
</template>
<script lang="ts">
import {
  mdiPaperclip,
  mdiClose,
  mdiArrowCollapseAll,
  mdiArrowExpandAll,
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight
} from '@mdi/js'
import {
  defineComponent,
  ref,
  watch,
  computed,
  reactive
} from '@nuxtjs/composition-api'
import { Category } from '~/constants/Category'
import {SelectedItem, useResultStore} from "~/store/resultModule";
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// import _resultModule, {
//   ResultState,
//   SelectedItem
// } from '~/store/result/results'
// let resultModule = createNamespacedHelpers<ResultState>('results')
import { insertClipJson } from '~/functions/clip/insertClipJson'
import {useClipStore} from "~/store/clipModule";
export default defineComponent({
  props: {
    isExpanded: { type: Boolean, default: false },
    showPreviewPanel: { type: Boolean, default: false },
    clickItem: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const tab = ref<number>(0)
    const selectedTab = ref(0)
    const tabInDetailed = ref(null)
    const isOpenClipDialog = ref<boolean>(false)
    const selectedFolder = ref(null)
    const clipDescription = ref<string | null>(null)
    const isExistingFolder = ref<boolean>(false)
    const folders = reactive([
      { key: 0, text: 'Folder 1' },
      { key: 1, text: 'Folder 2' },
      { key: 2, text: 'Folder 3' },
      { key: 3, text: 'Folder 4' },
      { key: 4, text: 'Folder 5' },
      { key: 5, text: 'Folder 6' }
    ])
    const resultModule = useResultStore()
    const clipModule = useClipStore()

    // TODO: Vuex to Pinia
    // const {
    //   selectedItemType,
    //   selectedItemId,
    //   selectedItemName
    // } = resultModule.useGetters([
    //   'selectedItemType',
    //   'selectedItemId',
    //   'selectedItemName'
    // ])
    // const { tabId, showItems, selectedItem } = resultModule.useState([
    //   'tabId',
    //   'showItems',
    //   'selectedItem'
    // ])
    // const {
    //   SET_TABID,
    //   SET_DETAILED_INFORMATION,
    //   CLEAR_SHOW_ITEMS,
    //   REMOVE_SHOW_ITEMS,
    //   SET_SELECTED_ITEM
    // } = resultModule.useMutations([
    //   'SET_TABID',
    //   'SET_DETAILED_INFORMATION',
    //   'CLEAR_SHOW_ITEMS',
    //   'REMOVE_SHOW_ITEMS',
    //   'SET_SELECTED_ITEM'
    // ])
    // const { clipModel } = clipModule.useState(['clipModel'])
    // const { fetchClips, updateClips } = clipModule.useActions([
    //   'fetchClips',
    //   'updateClips'
    // ])

    const clipModel = computed(() => clipModule.clipModel)
    const selectedItemType = computed(() => resultModule.selectedItemType)
    const selectedItemId = computed(() => resultModule.selectedItemId)
    const selectedItemName = computed(() => resultModule.selectedItemName)
    const tabId = computed(() => resultModule.tabId)
    const showItems = computed(() => resultModule.showItems.map((item) => Object.assign({}, item)))
    const selectedItem = computed(() => resultModule.selectedItem)


    const { setTabId, setDetailedInformation, setShowItems } = resultModule
    const { fetchClips, updateClips } = clipModule

    const showPreviewPanel = computed(() => {
      return props.showPreviewPanel
    })
    const clickItem = computed(() => {
      return props.clickItem
    })
    const showItemsLength = computed(() => showItems.value.length)

    const showClipDialog = () => {
      isExistingFolder.value = true
      isOpenClipDialog.value = true
      selectedFolder.value = null
      clipDescription.value = null
    }
    const onCloseClipDialog = () => {
      isOpenClipDialog.value = false
      selectedFolder.value = null
      clipDescription.value = null
    }
    const onSaveClip = async () => {
      isOpenClipDialog.value = false
      if (!clipModel.value?.ownClip) await fetchClips() // クリップJSONがなければ取得
      if (clipModel.value?.ownClip !== undefined && selectedItem.value) {
        const afterInsertClipModel = insertClipJson(
          clipModel.value?.ownClip,
          selectedItem.value,
          clipDescription.value
        ) // クリップJSONにデータを追加
        await updateClips(afterInsertClipModel) // クリップJSON更新
      }
      isOpenClipDialog.value = false
      selectedFolder.value = null
      clipDescription.value = null
    }
    const onSwitchSelectFolder = () => {
      isExistingFolder.value = !isExistingFolder.value
      selectedFolder.value = null
    }
    watch(
      () => props.isExpanded,
      () => {
        let sliderWrapper = document.querySelector<HTMLElement>(
          '.result-detail .v-tabs-slider-wrapper'
        )
        let arrayTab = Array.from(
          document.querySelectorAll<HTMLElement>('.v-tab')
        )
        let activeTab = document.querySelector<HTMLElement>(
          '.v-tab.v-tab--active'
        )
        let tabWidth = 100 / arrayTab.length
        let indexOfActiveTab = arrayTab.findIndex((tab) =>
          tab.isEqualNode(activeTab)
        )

        if (sliderWrapper) {
          sliderWrapper.style.width = tabWidth + '%'
          sliderWrapper.style.left = indexOfActiveTab * tabWidth + '%'
        }
      }
    )
    watch(showPreviewPanel, () => {
      tab.value = tabId.value
    })
    watch(clickItem, (newVal, oldVal) => {
      if (newVal && !oldVal) {
        setTabId(0)
      }
      tab.value = tabId.value
    })
    watch(tabId, (val) => {
      // グローバルステート(val)とローカルステート(tab.value)に差分があれば、ローカルステート(tab.value)を更新
      if (val !== tab.value) {
        tab.value = val
      }
    })
    watch(tab, (val) => {
      // ローカルステート(tab)とグローバルステート(tabId.value)に差分があれば、グローバルステート(tabId.value)を更新
      if (val !== tabId.value) {
        setTabId(val)
      }
      if (val === 1) {
        loadLineageRandom.value = +new Date()
      }
      showItems.value.map((item) => {
        if (item.id === selectedItem.value.id) item.tab = val || 0
      })
    })
    watch(showItemsLength, (newLength, oldLength) => {
      // データのタブが増えた時
      if (newLength > oldLength) {
        // 一番最後のデータタブを選択状態にする
        const lastItem = showItems.value.slice(-1).pop()
        onSelectItemClick(lastItem)
      }
    })

    const changeTabDetailed = () => {
      setTabId(0)
    }
    const onSelectTab = (id: number) => {
      selectedTab.value = id
    }
    const closeTabDetailed = () => {
      setDetailedInformation(false)
      setTimeout(() => {
        onSelectTab(0)
      })
    }
    const onCloseAllTab = () => {
      if (!showItems || !showItems.value || !showItems.value.length) return
      setShowItems([])
      if (!showItems.value.length) {
        emit('close', true)
      }
    }
    const onCloseItemClick = async (item: SelectedItem, index: number) => {
      if (!item) return
      if (!showItems || !showItems.value) return
      const oldSelectedItemId = selectedItem.value.id
      resultModule.removeShowItems(item.id) // showItems配列から削除し、タブを消す
      if (!showItems.value.length) {
        emit('close', true)
      }
      // 選択中のタブを消した場合
      if (selectedItem && item.id === oldSelectedItemId) {
        const newSelectedItem = showItems.value[index > 0 ? index - 1 : index]
        if (newSelectedItem) {
          await resultModule.setSelectedItem(newSelectedItem)
          tab.value =
            showItems.value.find((item) => item.id === selectedItem.value.id)
              ?.tab || 0
          if (tab.value === 1) {
            loadLineageRandom.value = +new Date()
          }
        }
      }
    }
    const loadLineageRandom = ref(0)
    const onSelectItemClick = async (item: SelectedItem) => {
      if (!item) return
      if (selectedItem && selectedItem.value.id === item.id) return
      await resultModule.setSelectedItem(item)
      tab.value =
        showItems.value.find((_item) => _item.id === item.id)?.tab || 0
      if (tab.value === 1) {
        loadLineageRandom.value = +new Date()
      }
    }

    return {
      showItems,
      selectedItem,
      selectedItemType,
      selectedItemId,
      selectedItemName,
      Category,
      tab,
      mdiPaperclip,
      mdiArrowCollapseAll,
      mdiArrowExpandAll,
      mdiChevronDoubleLeft,
      mdiChevronDoubleRight,
      mdiClose,
      selectedTab,
      onSelectTab,
      closeTabDetailed,
      tabInDetailed,
      onCloseAllTab,
      onCloseItemClick,
      onSelectItemClick,
      changeTabDetailed,
      loadLineageRandom,
      showClipDialog,
      isOpenClipDialog,
      selectedFolder,
      clipDescription,
      isExistingFolder,
      folders,
      onCloseClipDialog,
      onSaveClip,
      onSwitchSelectFolder
    }
  }
})
</script>
<style lang="stylus" scoped>
@import '@/assets/stylus/components/result/Detail.styl'
@import '@/assets/stylus/components/result/Tabs/DetailTab.styl'
</style>
