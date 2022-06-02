<template lang="pug">
  div#tag-page
    BaseScreenToolbarTitle(screenTitle="タグ一括付与")
    div#tag-content.tag-content
      div#leftNavigation.left-nav-tag(v-show='drawer')
        TagLeftNavigation(
          :drawer="drawer"
          @onClickTag="onClickTag"
          @rendered="onChildRendered('TagLeftNavigation')")
      div.article(v-if='isFetchTagSearch && tagSearchList && tagSearchList.length > 0')
        TagList(:selectTagIdProps="selectTagId" :selectTagNameProps="selectTagName" :isTagUnassignActionProps="isTagUnassignAction" @onCheckTheCheckbox="onCheckTheCheckbox" @resetIsTagUnassignAction="resetIsTagUnassignAction" @unassignmentLimitOver="unassignmentLimitOver")
        div#actions-panel.actions-panel.d-flex
          v-btn.delete-btn.mx-2.red--text(color='#C44343' elevation='0' outlined :disabled='false' @click='onClickUnassignTag') タグを解除する
          v-spacer
          v-btn.add-btn.mx-2.white--text(color='#43A5C4' elevation='0' @click='onClickOpenModal') タグを付与するデータを追加する
      div(v-else-if="isFetchTagSearch")
        CommonError(height='calc(100vh - 61px)' errType='error' mainErrText='データオブジェクトを取得できませんでした' secondaryErrText='再度お試しください')
        div#actions-panel.actions-panel.d-flex
          v-spacer
          v-btn.add-btn.mx-2.white--text(color='#43A5C4' elevation='0' @click='onClickOpenModal') タグを付与するデータを追加する
      HelpBeforeSearchList(v-else type='tag' mainText='左のメニューからタグを選択することで' secondaryText='タグが付与されているデータオブジェクトの一覧を確認することができます' @rendered="onChildRendered('BeforeSearchList')")
    TagSearchModal(:isShowModalProps='isShowModal' :selectTagIdProps="selectTagId" @onClickCloseModal='onClickCloseModal')
    v-dialog(v-model="isShowAlert" attach='#tag-content' hide-overlay persistent width="500px")
      v-card.alert-card(v-show="isUnassignable")
        v-card-text
          div
            p.alert-text {{ selectUnassignDataIds ? selectUnassignDataIds.length : 0 }}件の選択したデータからタグを解除しますか？
        v-divider
        v-card-actions
          v-spacer
          v-btn(color="primary" @click="onClickCloseUnassignTag" outlined) キャンセル
          v-btn.white--text(color="#C44343" @click="onClickConfirmUnassign") 解除する
      v-card.alert-card(v-show="isUnassignmentLimitOver")
        v-card-text
          div
            p.alert-text 一度に解除可能な上限数({{ $config.TAG_ASSIGN_LIMIT }})を超えるため、チェックできません
        v-divider
        v-card-actions
          v-spacer
          v-btn(color="primary" @click="onClickCloseLimitAlert" outlined) 閉じる
      v-card.alert-card(v-show="isNoSelected")
        v-card-text
          div
            p.alert-text タグを解除するデータを選択してください
        v-divider
        v-card-actions
          v-spacer
          v-btn(color="primary" @click="onClickCloseUnassignTag" outlined) 閉じる
</template>
<script lang="ts">
import {
  defineComponent,
  useRouter,
  ref,
  computed,
  onBeforeMount
} from '@nuxtjs/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import {useResultStore} from "~/store/resultModule";
import {useAppStore} from "~/store/appModule";
// TODO: Vuex to Pinia
// import appModule from '~/store/app/app'
// import { ResultState } from '~/store/result/results'
// let resultModule = createNamespacedHelpers<ResultState>('results')

export default defineComponent({
  name: 'tag',
  setup(_, context) {
    const router = useRouter()

    let isTagLeftNavigationRendered = false
    let isBeforeSearchListRendered = false
    let drawer = ref(true)
    const isFetchTagSearch = ref<boolean>(false)
    const selectTagName = ref<string | null>(null)
    const selectTagId = ref<number | null>(null)
    const isShowModal = ref<boolean>(false)
    const isShowAlert = ref<boolean>(false)
    const selectUnassignDataIds = ref<number[]>([])
    const isTagUnassignAction = ref<boolean>(false) // タグ解除を実行したかどうかの判定 (子コンポーネント側で判定するのに使用)
    const isUnassignmentLimitOver = ref<boolean>(false) // タグ解除上限数超過しているかどうかの判定
    const resultModule = useResultStore()
    const appModule = useAppStore()
    // TODO: Vuex to Pinia
    // const { tagSearchList } = resultModule.useState(['tagSearchList'])
    // const { SET_RESULT_LIST, RESET_SEARCH } = resultModule.useMutations([
    //   'SET_RESULT_LIST',
    //   'RESET_SEARCH'
    // ])
    // const { fetchTagSearch, postUnassignTag } = resultModule.useActions([
    //   'fetchTagSearch',
    //   'postUnassignTag'
    // ])

    const tagSearchList = computed(() => resultModule.tagSearchList)
    const { setResultList, resetSearch, fetchTagSearch, postUnassignTag } = resultModule

    // タグ解除確認アラートの表示/非表示を決めるcomputed
    const isUnassignable = computed(() => {
      // 一件以上チェックされており、且つタグ解除数上限を超えていない場合はtrueを返す
      return (
        selectUnassignDataIds?.value.length > 0 &&
        !isUnassignmentLimitOver.value
      )
    })
    // データを選択してくださいアラートの表示/非表示を決めるcomputed
    const isNoSelected = computed(() => {
      // 一件もチェックされていない（もしくはタグ解除数上限を超えてしまい、チェックされなかった）場合はtrueを返す
      return (
        (!selectUnassignDataIds?.value && !isUnassignmentLimitOver.value) ||
        (selectUnassignDataIds?.value.length === 0 &&
          !isUnassignmentLimitOver.value)
      )
    })

    onBeforeMount(async () => {
      // タグ一括付与ページアクセス時に検索状態と検索結果データをクリア
      await resetSearch()
      await setResultList([])
    })

    // 子コンポーネントがレンダリング完了したらローディング解除する関数
    const onChildRendered = (componentName: string) => {
      switch (componentName) {
        case 'TagLeftNavigation':
          isTagLeftNavigationRendered = true
          break
        case 'BeforeSearchList':
          isBeforeSearchListRendered = true
          break
        default:
          break
      }
      if (isBeforeSearchListRendered && isTagLeftNavigationRendered) {
        appModule.disableLoading()
        appModule.disableInitialLoading()
      }
    }
    // 左ナビゲーションバーでタグをクリック時
    const onClickTag = (tag: { id: number; name: string }) => {
      selectTagName.value = tag.name
      selectTagId.value = tag.id
      isFetchTagSearch.value = true
    }
    // 「タグを付与するデータを追加する」ボタン押下時(モーダル展開)
    const onClickOpenModal = () => {
      isShowModal.value = true
    }
    // モーダル閉じるボタン押下時(モーダルを閉じる)
    const onClickCloseModal = async () => {
      isShowModal.value = false
      await resetSearch()
      await setResultList([])
    }
    // 「タグを解除する」ボタン押下時
    const onClickUnassignTag = () => {
      isShowAlert.value = true
    }
    // タグ解除確認アラートで「解除する」ボタン押下時
    const onClickConfirmUnassign = async () => {
      // 事前に制御は入れているが、万が一、チェックしたデータ数が、上限数を超えていた場合はエラー画面へ飛ばす
      if (
        selectUnassignDataIds.value?.length >
        context?.root?.$config?.TAG_ASSIGN_LIMIT
      ) {
        router.push('/error')
        return
      }
      appModule.enableLoading() // ローディングかける
      await postUnassignTag({
        tagId: selectTagId.value,
        selectDataIds: selectUnassignDataIds.value
      })
      await fetchTagSearch(selectTagId.value) // タグ解除後、再度タグ検索実行
      appModule.disableLoading() // ローディング解除
      isTagUnassignAction.value = true
      isShowAlert.value = false
    }
    // タグ解除確認アラートの「キャンセル」、もしくはデータ選択してくださいアラートの「閉じる」ボタン押下時
    const onClickCloseUnassignTag = () => {
      isShowAlert.value = false
    }
    // タグ解除上限数を超えたときにアラート表示する
    const unassignmentLimitOver = () => {
      isUnassignmentLimitOver.value = true
      isShowAlert.value = true
    }
    // タグ解除上限数超過アラートを閉じる
    const onClickCloseLimitAlert = async () => {
      isShowAlert.value = false
      await new Promise((resolve) => setTimeout(resolve, 200)) // アラートを閉じるときのアニメーションで0.2秒の遅延があるので、0.2秒待つ
      isUnassignmentLimitOver.value = false
    }
    // 子コンポーネントでチェック操作行った時に、チェックされたデータを受け取る
    const onCheckTheCheckbox = (selectDataIds: number[]) => {
      selectUnassignDataIds.value = selectDataIds
    }

    const resetIsTagUnassignAction = () => {
      isTagUnassignAction.value = false // 解除処理が終わったら、タグ解除実行判定の変数を初期化
    }

    return {
      drawer,
      isFetchTagSearch,
      selectTagName,
      selectTagId,
      isShowModal,
      isShowAlert,
      selectUnassignDataIds,
      isTagUnassignAction,
      tagSearchList,
      isUnassignable,
      isUnassignmentLimitOver,
      isNoSelected,
      onChildRendered,
      onClickTag,
      onClickOpenModal,
      onClickCloseModal,
      onClickUnassignTag,
      onClickConfirmUnassign,
      unassignmentLimitOver,
      onClickCloseUnassignTag,
      onClickCloseLimitAlert,
      onCheckTheCheckbox,
      resetIsTagUnassignAction
    }
  }
})
</script>
<style lang="stylus" scoped>
#tag-page
  height 100%
  background #F4F6F7 0 0 no-repeat padding-box
  overflow hidden
  .tag-content
    margin-top 53px
    height calc(100% - 53px)
    .left-nav-tag
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
      top 0
    .article
      padding 8px
      width calc(100% - 180px)
      min-width 616px
      margin-left 180px
      min-height 768px
      height 100%
    .actions-panel
      width calc(100% - 244px)
      position fixed
      bottom 0
      right 0
      padding 8px
      height 56px
      background #FFF
      box-shadow 0px -2px 4px #00000029
    >>>.v-dialog
      margin 0 !important
  >>>.v-input--selection-controls.v-input.selectAll
    margin-top 0 !important
  .v-dialog__content
    align-items start !important
.alert-card
  .alert-text
    padding 24px 20px
    font-weight bold
    margin-bottom: 0 !important;
/* v-card__text要素にpadding: 0 24px 20px;が自動的に付いてしまうので上書き */
.v-dialog > .v-card > .v-card__text
  padding 0 !important
</style>
