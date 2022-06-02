<template lang="pug">
  div#addition-dialog
    v-dialog(
      v-model="isShowModal"
      attach='#tag-page'
      width="calc(100vw - 64px)"
      overlay-color="#5858584D"
      overlay-opacity="1"
      persistent)
      div#tag-dialog-content.tag-dialog-content
        v-toolbar(color="#F4F6F7" elevation='0').dialog-toolbar
          v-toolbar-title.dialog-title 追加データ選択
          v-spacer
          v-btn(
            icon
            color='#43A5C4'
            @click="onClickCloseModal")
            v-icon mdi-close
        BaseSearch(@rendered="onChildRendered('BaseSearch')")
        TagSearchResult(:isShowModalProps="isShowModal" :selectTagIdProps="selectTagId" @onCheckTheCheckbox="onCheckTheCheckbox" @assignmentLimitOver="assignmentLimitOver" @rendered="onChildRendered('TagAdditionList')")
        div#actions-panel.actions-panel.d-flex
          v-spacer
          v-btn.add-btn.mx-2.white--text(color='#43A5C4' elevation='0' @click='onClickAssignTag()') 選択したデータにタグを付与する
      v-dialog(v-model="isShowAlert" attach='#tag-dialog-content' hide-overlay persistent width="500px")
        v-card.alert-card(v-show="isAssignable")
          v-card-text
            div
              p.alert-text {{ selectAssignDataIds ? selectAssignDataIds.length : 0 }}件の選択したデータにタグを付与しますか？
          v-divider
          v-card-actions
            v-spacer
            v-btn(color="primary" @click="onClickCloseAssignTag" outlined) キャンセル
            v-btn(color="primary" @click="onClickConfirmAssign") 付与する
        v-card.alert-card(v-show="isAssignmentLimitOver")
          v-card-text
            div
              p.alert-text 一度に付与可能な上限数({{ $config.TAG_ASSIGN_LIMIT }})を超えるため、チェックできません
          v-divider
          v-card-actions
            v-spacer
            v-btn(color="primary" @click="onClickCloseLimitAlert" outlined) 閉じる
        v-card.alert-card(v-show="isNoSelected")
          v-card-text
            div
              p.alert-text タグを付与するデータを選択してください
          v-divider
          v-card-actions
            v-spacer
            v-btn(color="primary" @click="onClickCloseAssignTag" outlined) 閉じる
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useRouter,
  ref
} from '@nuxtjs/composition-api'
import { useResultStore } from "~/store/resultModule";
import { useAppStore } from "~/store/appModule";
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// import appModule from '~/store/app/app'
// import { ResultState } from '~/store/result/results'
// let resultModule = createNamespacedHelpers<ResultState>('results')

export default defineComponent({
  props: {
    isShowModalProps: { type: Boolean, default: false },
    selectTagIdProps: { type: Number, default: null, required: false }
  },
  setup(props, context) {
    const router = useRouter()

    let isTagAdditionListRendered = false
    let isBaseSearchRendered = false
    const isShowAlert = ref<boolean>(false)
    const selectAssignDataIds = ref<number[]>([])
    const isAssignmentLimitOver = ref<boolean>(false) // タグ付与上限数超過しているかどうかの判定

    const resultModule = useResultStore()
    const appModule = useAppStore()

    // TODO: Vuex to Pinia
    // const { fetchTagSearch, postAssignTag } = resultModule.useActions([
    //   'fetchTagSearch',
    //   'postAssignTag'
    // ])

    const { fetchTagSearch, postAssignTag } = resultModule

    const isShowModal = computed(() => props.isShowModalProps) // モーダルの展開状態
    const selectTagId = computed(() => props.selectTagIdProps) // 左ナビゲーションバーで選択したタグID
    // タグ付与確認アラートの表示/非表示を決めるcomputed
    const isAssignable = computed(() => {
      // 一件以上チェックされており、且つタグ付与数上限を超えていない場合はtrueを返す
      return (
        selectAssignDataIds?.value.length > 0 && !isAssignmentLimitOver.value
      )
    })
    // データを選択してくださいアラートの表示/非表示を決めるcomputed
    const isNoSelected = computed(() => {
      // 一件もチェックされていない（もしくはタグ付与数上限を超えてしまい、チェックされなかった）場合はtrueを返す
      return (
        (!selectAssignDataIds?.value && !isAssignmentLimitOver.value) ||
        (selectAssignDataIds?.value.length === 0 &&
          !isAssignmentLimitOver.value)
      )
    })

    // 子コンポーネントがレンダリング完了したらローディング解除する関数
    const onChildRendered = (componentName: string) => {
      switch (componentName) {
        case 'TagAdditionList':
          isTagAdditionListRendered = true
          break
        case 'BaseSearch':
          isBaseSearchRendered = true
          break
        default:
          break
      }
      if (isTagAdditionListRendered && isBaseSearchRendered)
        appModule.disableLoading()
    }
    // モーダル閉じるボタン押下時(親コンポーネント側でモーダルを閉じる)
    const onClickCloseModal = () => {
      context.emit('onClickCloseModal')
    }
    // 「選択したデータにタグを付与する」ボタン押下時
    const onClickAssignTag = () => {
      isShowAlert.value = true
    }
    // タグ付与確認アラートで「付与する」ボタン押下時
    const onClickConfirmAssign = async () => {
      // 事前に制御は入れているが、万が一、チェックしたデータ数が、上限数を超えていた場合はエラー画面へ飛ばす
      if (
        selectAssignDataIds.value?.length >
        context?.root?.$config?.TAG_ASSIGN_LIMIT
      ) {
        router.push('/error')
        return
      }
      appModule.enableLoading() // ローディングかける
      await postAssignTag({
        tagId: selectTagId.value,
        selectDataIds: selectAssignDataIds.value
      })
      await fetchTagSearch(selectTagId.value) // タグ付与後、再度タグ検索実行
      context.emit('onClickCloseModal')
      appModule.disableLoading() // ローディング解除
      isShowAlert.value = false
    }
    // タグ付与確認アラートの「キャンセル」、もしくはデータ選択してくださいアラートの「閉じる」ボタン押下時
    const onClickCloseAssignTag = () => {
      isShowAlert.value = false
    }
    // タグ付与上限数を超えたときにアラート表示する
    const assignmentLimitOver = () => {
      isAssignmentLimitOver.value = true
      isShowAlert.value = true
    }
    // タグ付与上限数超過アラートを閉じる
    const onClickCloseLimitAlert = async () => {
      isShowAlert.value = false
      await new Promise((resolve) => setTimeout(resolve, 200)) // アラートを閉じるときのアニメーションで0.2秒の遅延があるので、0.2秒待つ
      isAssignmentLimitOver.value = false
    }
    // 子コンポーネントでチェック操作行った時に、チェックされたデータを受け取る
    const onCheckTheCheckbox = (selectDataIds: number[]) => {
      selectAssignDataIds.value = [...selectDataIds]
    }

    return {
      isShowAlert,
      selectAssignDataIds,
      isShowModal,
      selectTagId,
      isAssignable,
      isAssignmentLimitOver,
      isNoSelected,
      onChildRendered,
      onClickCloseModal,
      onClickAssignTag,
      onClickConfirmAssign,
      assignmentLimitOver,
      onClickCloseAssignTag,
      onClickCloseLimitAlert,
      onCheckTheCheckbox
    }
  }
})
</script>
<style lang="stylus" scoped>
#addition-dialog
  height 100%
  overflow hidden
>>>.v-dialog
  background #F4F6F7
  overflow hidden
  position relative
  .dialog-toolbar
    .dialog-title
      font-size 16px
      font-weight bold
      color #777
      padding-left 32px
  .tag-dialog-content
    height calc(100vh - 48px)
    .v-dialog__content
      align-items start !important
  .actions-panel
    width 100%
    position absolute
    bottom 0
    right 0
    padding 8px
    height 56px
    background #FFF
    box-shadow 0px -2px 4px #00000029
/* v-dialogのfullscreenプロパティを指定していない場合、max-height: 90%;が自動的に付いてしまうので100%で上書き */
>>>.v-dialog:not(.v-dialog--fullscreen)
    max-height 100% !important
.alert-card
  .alert-text
    padding 24px 20px
    font-weight bold
    margin-bottom: 0 !important;
/* v-card__text要素にpadding: 0 24px 20px;が自動的に付いてしまうので上書き */
.v-dialog > .v-card > .v-card__text
  padding 0 !important
</style>
