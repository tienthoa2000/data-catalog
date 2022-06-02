<template lang="pug">
  v-container.px-12(fluid)
    v-data-table#tag-data-table.elevation-0(
      v-if='tagSearchList && tagSearchList.length !== 0'
      v-model="selectDataList"
      item-key="id"
      show-select
      :headers="headers"
      no-data-text='データがありません。'
      :items='tagSearchList'
      style='background-color:#F4F6F7; width:100%; height:calc(100vh - 232px); overflow-y:scroll'
      :sort-by.sync='sortBy'
      :sort-desc.sync='sortDesc'
      :items-per-page='10'
      :page.sync='page')
      template(v-slot:top='')
        div.pb-4(v-if="selectTagNameProps && selectTagNameProps !== ''")
          v-chip(color="#CFEAC7" text-color="#41434E" style='font-size: 12px; line-height: 16px') {{ selectTagNameProps }}
          span.pa-2(style="font-size: 16px; font-weight: bold; color: #777777;") のタグがついている{{ tagSearchList && tagSearchList.length > 0 ? tagSearchList.length : 0 }}件のデータ
      template(#item.data-table-select="{ item, isSelected, select }")
        v-checkbox(
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
      template(v-slot:item.tags="{ item }")
        div(v-if="item.tags && item.tags.length" style="display: inline-block;")
          v-chip(v-for="tag in item.tags" :key="tag.id" small color='#CFE9C6' style='margin-right: 5px;')
            span(style='font-weight: regular; font-size: 12px; color: #41434E;')
              | {{ tag.name }}
</template>
<script>
import {
  defineComponent,
  ref,
  watch,
  computed,
  nextTick
} from '@nuxtjs/composition-api'
import { useResultStore } from "~/store/resultModule";

// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// let resultModule = createNamespacedHelpers('results')

export default defineComponent({
  props: {
    selectTagIdProps: { type: Number, default: null, required: false },
    selectTagNameProps: { type: String, default: null, required: false },
    isTagUnassignActionProps: { type: Boolean, default: false }
  },
  setup(props, context) {
    const sortBy = ref('name') // ソート対象のカラム名
    const sortDesc = ref(false) // ソート判定(falseが昇順、trueが降順)
    const sortCount = ref(0)
    const sortNomalFlg = ref(false) // ソートしていない状態かどうかのフラグ(trueならソートしていない状態)
    const page = ref(1)
    const selectDataList = ref([]) // チェックボックにチェックしたデータ一覧を格納
    const headers = [
      { text: 'データ名', value: 'name', width: '24%' },
      { text: '論理名', value: 'logicalName', width: '20%' },
      { text: 'ロケーション', value: 'location', width: '20%' },
      { text: 'タグ', value: 'tags', width: '36%' }
    ]
    const resultModule = useResultStore()
    // TODO: Vuex to Pinia
    // const { tagSearchList } = resultModule.useState(['tagSearchList'])
    const tagSearchList = computed(() => resultModule.tagSearchList)

    const selectTagId = computed(() => props.selectTagIdProps) // 左ナビゲーションバーで選択したタグID
    const isTagUnassignAction = computed(() => props.isTagUnassignActionProps) // 左ナビゲーションバーで選択したタグID
    // チェックしたデータのIDのみ抽出して返却
    const selectDataIds = computed(() => {
      return selectDataList.value?.map((e) => e.id)
    })

    watch(selectDataList, async (newVal, oldVal) => {
      // タグ付与数上限値を超えてチェックした場合は、直近でチェックしたデータをチェック解除させる(一括チェック時も、一括解除させる)
      if (newVal?.length > context?.root?.$config?.TAG_ASSIGN_LIMIT) {
        selectDataList.value = await [...oldVal]
        context.emit('unassignmentLimitOver')
      }
      context.emit('onCheckTheCheckbox', selectDataIds.value) // 親コンポーネントにチェックしたデータを渡す
    })
    watch(tagSearchList, (val) => {
      // タグ検索再実行時、ページネーションをトップに持ってくる
      page.value = 1
    })
    watch(selectTagId, (val) => {
      // 左ナビゲーションバーで別のタグをクリック時に、タグ検索結果でチェックしていたデータを初期化する
      selectDataList.value = []
    })
    watch(isTagUnassignAction, (val) => {
      if (val) {
        selectDataList.value = []
        context.emit('resetIsTagUnassignAction')
      }
    })

    const rowClick = (item) => {}

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
    const clickLogicalNameSort = () => {
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

    return {
      sortBy,
      sortDesc,
      sortCount,
      sortNomalFlg,
      page,
      selectDataList,
      headers,
      tagSearchList,
      rowClick,
      clickNameSort,
      clickLogicalNameSort,
      clickLocationNameSort,
      clickTagsSort
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
#tag-data-table {
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
