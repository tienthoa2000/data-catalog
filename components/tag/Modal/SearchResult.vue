<template lang="pug">
  v-container.px-12(fluid style="height: calc(100% - 338px);")
    v-data-table#tag-modal-data-table.elevation-0(
      v-if='resultList && resultList.length !== 0'
      v-model="selectDataList"
      item-key="id"
      show-select
      :headers="headers"
      no-data-text='データがありません。'
      :items='resultList'
      style='background-color:#F4F6F7; width:100%; height:100%; overflow-y:scroll'
      :sort-by.sync='sortBy'
      :sort-desc.sync='sortDesc'
      :items-per-page='10'
      :page.sync='page')
      template(v-slot:top='{}')
        p.mx-4.mb-4(style='font-size: 12px; font-weight: regular; color: #777777;')
          | 検索結果 : {{ resultList && resultList.length !== 0 ? resultList.length : 0 }} 件
      template(#item.data-table-select="{ item, isSelected, select }")
        v-checkbox(
          v-if="isMatchingTag(item.tags)"
          class="ma-0 pa-0"
          v-model="isSelected"
          @change="select($event)")
      template(v-slot:item.name="{item}")
        img(
          v-if="item.label === 'table'"
          :src="require('@/assets/icons/table.svg')"
          style="margin-right: 5px; height: 14px;")
        img(
          v-if="item.label === 'view'"
          :src="require('@/assets/icons/view.svg')"
          style="margin-right: 5px; height: 14px;")
        img(
          v-if="item.label === 'dataset'"
          :src="require('@/assets/icons/dataset.svg')"
          style="margin-right: 5px; height: 14px;")
        img(
          v-if="item.label === 'report'"
          :src="require('@/assets/icons/report.svg')"
          style="margin-right: 5px; height: 14px;")
        img(
          v-if="item.label === 'dashboard'"
          :src="require('@/assets/icons/dashboard.svg')"
          style="margin-right: 5px; height: 14px;")
        span {{ item.name }}
      template(v-slot:item.location="{item}")
        span {{ `${item.system.systemName} ${item.product.productName} ( ${item.product.envName} )` }}
      template(v-slot:item.tags="{ item }")
        div(v-if="item.tags && item.tags.length" style="display: inline-block;")
          v-chip(v-for="tag in item.tags" :key="tag.id" small color='#CFE9C6' style='margin-right: 5px;')
            span(style='font-weight: regular; font-size: 12px; color: #41434E;')
              | {{ tag.name }}
    CommonError(v-else-if='!isSearched' errType='search' mainErrText='ここに検索結果が表示されます' secondaryErrText='キーワードか検索条件を一つ以上設定して検索してください' height="100%")
    CommonError(v-else-if='isSrchLimit' errType='error' mainErrText='検索結果が2000件を超えました。' secondaryErrText='キーワードか検索条件を変更してお試しください' height="100%")
    CommonError(v-else errType='error' mainErrText='検索結果が見つかりませんでした' secondaryErrText='キーワードか検索条件を変更してお試しください' height="100%")

</template>

<script>
import { defineComponent, ref, computed, watch } from '@nuxtjs/composition-api'
import {useResultStore} from "~/store/resultModule";
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// let resultModule = createNamespacedHelpers('results')

export default defineComponent({
  props: {
    isShowModalProps: { type: Boolean, default: false },
    selectTagIdProps: { type: Number, default: null, required: false }
  },
  setup(props, context) {
    const sortBy = ref('name') // ソート対象のカラム名
    const sortDesc = ref(false) // ソート判定(falseが昇順、trueが降順)
    const sortCount = ref(0)
    const sortNomalFlg = ref(false) // ソートしていない状態かどうかのフラグ(trueならソートしていない状態)
    const selectDataList = ref([]) // チェックボックにチェックしたデータ一覧を格納
    const page = ref(1)
    const headers = [
      { text: 'データ名', value: 'name', width: '24%' },
      { text: '論理名', value: 'logicalName', width: '20%' },
      { text: 'ロケーション', value: 'location', width: '20%' },
      { text: 'タグ', value: 'tags', width: '36%' }
    ]

    const resultModule = useResultStore()

    // TODO: Vuex to Pinia
    // const { isSearched, isSrchLimit } = resultModule.useState([
    //   'isSearched',
    //   'isSrchLimit'
    // ])
    // const resultList = resultModule.useGetters(['list']).list

    const isSearched = computed(() => resultModule.isSearched)
    const isSrchLimit = computed(() => resultModule.isSrchLimit)
    const resultList = computed(() => resultModule.list.list)

    const isShowModal = computed(() => props.isShowModalProps) // モーダルの展開状態
    // チェックしたデータのIDのみ抽出して返却 (同時に、チェックボックス非表示のデータが配列に含まれていたら削除)
    const selectDataIds = computed(() => {
      const requestAssignDataList = [...selectDataList.value] // 配列のコピー
      selectDataList.value?.forEach((e, i) => {
        if (e.tags?.some((j) => j.id === props.selectTagIdProps)) {
          // すでに同じタグが付与されているデータは、タグ付与APIのリクエストパラメータから除外する為、配列から削除
          requestAssignDataList.splice(i, 1)
        }
      })
      return requestAssignDataList?.map((e) => e.id) // データのIDのみ抽出した配列
    })

    watch(selectDataList, async (newVal, oldVal) => {
      // タグ付与数上限値を超えてチェックした場合は、直近でチェックしたデータをチェック解除させる(一括チェック時も、一括解除させる)
      if (newVal?.length > context?.root?.$config?.TAG_ASSIGN_LIMIT) {
        selectDataList.value = await [...oldVal]
        context.emit('assignmentLimitOver')
      }
      context.emit('onCheckTheCheckbox', selectDataIds.value) // 親コンポーネントにチェックしたデータを渡す
    })
    watch(resultList, (val) => {
      // 再検索実行時、ページネーションをトップに持ってくる
      page.value = 1
      // 再検索実行時、チェックしたデータを初期化する
      selectDataList.value = []
    })
    watch(isShowModal, (val) => {
      if (!val) {
        // モーダルが閉じた時に、チェックしたデータを初期化する
        selectDataList.value = []
      }
    })

    // すでに同じタグが付与されていればfalse(チェックボックスを非表示)、なければtrue(チェックボックス表示)にする関数
    const isMatchingTag = (tags) => {
      if (!tags) return true
      return !tags?.some((e) => e.id === props.selectTagIdProps)
    }

    // TODO: ソートのデザインを、XDに合わせる対応を行う。その際、以下の関数を使用する
    // データ名カラムのソートボタンクリック時
    const clickNameSort = () => {
      if (sortBy.value !== 'name') {
        sortBy.value = 'name'
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else if (sortDesc.value) {
        sortDesc.value = false
        sortCount.value = 1
        sortNomalFlg.value = true
      } else if (!sortDesc.value && sortCount.value === 1) {
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else {
        sortDesc.value = true
        sortNomalFlg.value = false
      }
    }
    // 論理名カラムのソートボタンクリック時
    const clickTableLogicalNameSort = () => {
      if (sortBy.value !== 'logicalName') {
        sortBy.value = 'logicalName'
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else if (sortDesc.value) {
        sortDesc.value = false
        sortCount.value = 1
        sortNomalFlg.value = true
      } else if (!sortDesc.value && sortCount.value === 1) {
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else {
        sortDesc.value = true
        sortNomalFlg.value = false
      }
    }
    // ロケーションカラムのソートボタンクリック時
    const clickLocationNameSort = () => {
      if (sortBy.value !== 'location') {
        sortBy.value = 'location'
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else if (sortDesc.value) {
        sortDesc.value = false
        sortCount.value = 1
        sortNomalFlg.value = true
      } else if (!sortDesc.value && sortCount.value === 1) {
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else {
        sortDesc.value = true
        sortNomalFlg.value = false
      }
    }
    // タグカラムのソートボタンクリック時
    const clickTagsSort = () => {
      if (sortBy.value !== 'tags') {
        sortBy.value = 'tags'
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else if (sortDesc.value) {
        sortDesc.value = false
        sortCount.value = 1
        sortNomalFlg.value = true
      } else if (!sortDesc.value && sortCount.value === 1) {
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else {
        sortDesc.value = true
        sortNomalFlg.value = false
      }
    }

    const selectRow = () => {}

    return {
      sortBy,
      sortDesc,
      sortCount,
      sortNomalFlg,
      page,
      selectDataList,
      headers,
      isSearched,
      isSrchLimit,
      resultList,
      isMatchingTag,
      clickNameSort,
      clickTableLogicalNameSort,
      clickLocationNameSort,
      clickTagsSort,
      selectRow
    }
  }
})
</script>

<style lang="scss">
// TODO: border-bottom: noneが効いていないので修正。IndexTableと競合している。
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:not(:last-child)
  > td:not(.v-data-table__mobile-row) {
  border-bottom: none;
}
#tag-modal-data-table {
  table {
    border-spacing: 0px 8px;
    tbody {
      tr {
        background-color: #fff;
        filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.2));
        td {
          padding: 12px 16px;
          .v-messages {
            display: none !important;
          }
          .v-input__slot {
            margin-bottom: 0 !important;
          }
        }
      }
    }
  }
}
</style>
