<template lang="pug">
  div#clip-index
    .screen-toolbar
      .btn-toolbar
        v-btn(color="primary" @click="createDialogActive = true") 新規フォルダ作成
        v-btn(color="primary" outlined @click="moveToDialogActive = true") 移動
        v-btn(color="#C44343" :disabled="!hasClipItemSelected && !hasFolderItemSelected" outlined @click="onDelete") クリップ解除
    .list-wrapper
      ClipList(:data-list="dataListDisplay" @rendered="onChildRendered('ClipList')" @changeDataList="onChangeDataList")
    //Modal
    transition(name='bounce')
      div.clip-dialog(v-if='createDialogActive')
        v-card#create-form(width="286")
          v-card-text
            span.label フォルダ名
            div#clip-new-folder
              v-text-field(
                v-model='newFolder'
                solo
                background-color='#F2F2F2'
                hide-details
                dense
                class="v-input-folder"
              )
            div.mt-3
          v-divider
          v-card-actions
            v-spacer
            v-btn(outlined color='#43A5C4' @click='onCloseCreateDialog') キャンセル
            v-btn(dark color='#43A5C4' @click='onCreateFolder') 保存
    transition(name='bounce')
      div.clip-dialog(v-if='moveToDialogActive')
        v-card#move-to-form(width="286")
          v-card-text
            span.label フォルダ名
            div
              v-select(
                :items='folderList'
                item-value="name"
                item-text="name"
                v-model='destinationFolder'
                solo
                background-color='#F2F2F2'
                hide-details
                dense
                class="v-select-folder"
              )
            div.mt-3
          v-divider
          v-card-actions
            v-spacer
            v-btn(outlined color='#43A5C4' @click='onCloseMoveDialog') キャンセル
            v-btn(dark color='#43A5C4' @click='onMoveToFolder') 保存
    transition(name='bounce')
      div.clip-dialog(v-if='deleteClipDialogActive')
        v-card#delete-clip-form(width="500")
          v-card-text
            span.confirm-message {{itemSelectedNum}}件のクリップが解除されますがよろしいですか？
          v-divider
          v-card-actions
            v-spacer
            v-btn(outlined color='#43A5C4' @click='onCloseDeleteClipDialog') キャンセル
            v-btn(dark color='#C44343' @click='doDeleteClip') 解除する
    transition(name='bounce')
      div.clip-dialog(v-if='deleteFolderDialogActive')
        v-card#delete-folder-form(width="500")
          v-card-text
            span.confirm-message フォルダ内のクリップがすべて解除され、フォルダが削除されますがよろしいですか？
          v-divider
          v-card-actions
            v-spacer
            v-btn(outlined color='#43A5C4' @click='onCloseDeleteFolderDialog') キャンセル
            v-btn(dark color='#C44343' @click='doDeleteFolder') 解除する
</template>
<script lang="ts">
import {
  defineComponent,
  useFetch,
  useContext,
  ref,
  onMounted,
  nextTick,
  onBeforeMount,
  watch,
  computed
} from '@nuxtjs/composition-api'

import {Clip, ClipFolder, UpdateClipData, useClipStore} from "~/store/clipModule";
import {useAppStore} from "~/store/appModule";


interface ClipFolderDisplay extends ClipFolder {
  type: 'folder'
  id: number | null | undefined
  selected: boolean
}

interface ClipDisplay extends Clip {
  type: 'data'
  selected: boolean
}

export default defineComponent({
  name: 'clipPage',
  setup(_, { root }) {
    const clipStore = useClipStore()
    const appModule = useAppStore()

    const clipModel = computed(() => clipStore.clipModel)
    const ownClipWithUniqueId = computed(() => clipStore.ownClipWithUniqueId)
    const {
      fetchClips,
      updateClips,
      // deleteFolders,
      // deleteClips
    } = clipStore

    let isClipListRendered = false
    let createDialogActive = ref(false)
    let moveToDialogActive = ref(false)
    let deleteClipDialogActive = ref(false)
    let deleteFolderDialogActive = ref(false)
    let destinationFolder = ref(null)
    let newFolder = ref(null)
    let clipDescription = ref(null)
    const dataListDisplay = ref<(ClipFolderDisplay | ClipDisplay)[]>([])

    const folderList = computed(() => {
      dataListDisplay.value.filter((item) => item.type === 'folder')
    })

    const hasClipItemSelected = computed(
      () =>
        dataListDisplay.value &&
        dataListDisplay.value.some(
          (item: ClipDisplay | ClipFolderDisplay) =>
            item?.selected && item?.type === 'data'
        )
    )

    const hasFolderItemSelected = computed(
      () =>
        dataListDisplay.value &&
        dataListDisplay.value.some(
          (item: ClipDisplay | ClipFolderDisplay) =>
            item?.selected && item?.type === 'folder'
        )
    )

    const itemSelectedNum = computed(() => {
      if (!dataListDisplay.value) return 0
      return dataListDisplay.value.filter(
        (item: ClipDisplay | ClipFolderDisplay) =>
          item?.selected && item?.type === 'data'
      ).length
    })

    watch(ownClipWithUniqueId, (val) => {
      if (!val) return
      dataListDisplay.value = val?.map((item: (ClipFolder | Clip)) => {
        const newItem = Object.assign({}, item) as (ClipFolderDisplay | ClipDisplay)
        newItem.selected = false
        return newItem
      })
      console.log(dataListDisplay)
      console.log(val)
    })

    const reloadDataList = async () => {
      // const queryData = {
      //   userId: 1,
      //   verbose: 0
      // }
      await fetchClips()
    }

    onBeforeMount(() => {
      reloadDataList()
    })

    onMounted(() => {
      nextTick(() => {
        appModule.disableLoading()
        appModule.disableInitialLoading()
      })
    })
    const onChildRendered = (componentName: string) => {
      switch (componentName) {
        case 'ClipList':
          isClipListRendered = true
          break
        default:
          break
      }
      if (isClipListRendered) appModule.disableLoading()
    }
    const onCloseCreateDialog = () => {
      createDialogActive.value = false
    }
    const onCreateFolder = () => {
      createDialogActive.value = false
    }
    const onCloseMoveDialog = () => {
      moveToDialogActive.value = false
    }
    const onMoveToFolder = () => {
      moveToDialogActive.value = false
    }
    const onDelete = () => {
      if (hasFolderItemSelected.value) {
        deleteFolderDialogActive.value = true
      } else {
        deleteClipDialogActive.value = true
      }
    }
    const onCloseDeleteClipDialog = () => {
      deleteClipDialogActive.value = false
    }
    const doDeleteClip = async () => {
      if (!dataListDisplay.value) return
      const dataListData = {
        userId: 1,
        ids: dataListDisplay.value
          .filter(
            (item: ClipDisplay | ClipFolderDisplay) =>
              item?.selected && item?.type === 'folder'
          )
          .map((item: ClipDisplay | ClipFolderDisplay) => item.id || 0)
      }
      // await deleteClips(dataListData)
      deleteClipDialogActive.value = false
      await reloadDataList()
    }
    const onCloseDeleteFolderDialog = () => {
      deleteFolderDialogActive.value = false
    }
    const doDeleteFolder = async () => {
      if (!dataListDisplay.value) return
      if (hasFolderItemSelected.value) {
        const ids = dataListDisplay.value
          .filter(
            (item: ClipDisplay | ClipFolderDisplay) =>
              item?.selected && item?.type === 'folder'
          )
          .map((item: ClipDisplay | ClipFolderDisplay) => item.id || 0)
        const dataListData = {
          userId: 1,
          ids
        }
        // await deleteFolders(dataListData)
        deleteFolderDialogActive.value = false
      }
      if (hasFolderItemSelected.value) {
        deleteClipDialogActive.value = true
        return
      }
      await reloadDataList()
    }
    const onChangeDataList = (list: any[]) => {
      if (!list || !clipModel.value) return
      dataListDisplay.value = list
      const rootClip = Object.assign([], ownClipWithUniqueId.value)
      // rootClip.children = list
      // const updateData: UpdateClipData = {
      //   userId: 1,
      //   clipInfo: rootClip
      // }
      updateClips(rootClip)
    }
    return {
      onChildRendered,
      createDialogActive,
      folderList,
      moveToDialogActive,
      deleteClipDialogActive,
      deleteFolderDialogActive,
      destinationFolder,
      newFolder,
      clipDescription,
      onCloseCreateDialog,
      onCreateFolder,
      onCloseMoveDialog,
      onMoveToFolder,
      onCloseDeleteClipDialog,
      doDeleteClip,
      onCloseDeleteFolderDialog,
      doDeleteFolder,
      onDelete,
      dataListDisplay,
      hasClipItemSelected,
      hasFolderItemSelected,
      itemSelectedNum,
      onChangeDataList
    }
  }
})
</script>
<style lang="stylus" scoped>
@import '@/assets/stylus/components/clip/bounce-modal.styl'
#clip-index
  min-height 100vh
  background #F4F6F7 padding-box
  -webkit-overflow-scrolling touch
  .screen-toolbar
    box-shadow 1px 1px 2px #00000033 !important
    z-index 100
    background-color white
    display flex
    align-items center
    height 64px
    width 100%
    position fixed
    top 0
    .btn-toolbar
      margin-left 32px
      .v-btn
        margin-right 16px
  .list-wrapper
    margin-top 64px
</style>
