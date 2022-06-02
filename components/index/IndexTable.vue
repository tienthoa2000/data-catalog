<template lang="pug">
  #index-table-component(v-if='indexList && indexList.length > 0 && isFetchData')
    .filter-block
      .filter-character(v-for='char in alphabet' @click="onClickAlphabet(char)" :class="matchAlphabet.includes(char) ? 'pointer' : ''")
        .character {{ char }}
      .last-character
        .character ...
    v-card.card-table(min-width='600')
      //- 説明がある場合のレイアウト
      v-toolbar.white--text.table-toolbar(v-if="indexList && indexList.description" color='#43A5C4' height='53' extended)
        div(slot='extension')
          .extension-wrapper
            .extension-text 説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明説明
        v-toolbar-title.group-name-title {{ dataFlow }}
          span.number-of-data 総件数：{{ indexList.length }}
        v-spacer
        div(class="filter-box")
          v-img(:src="require('@/assets/icons/search_search_blue.svg')" class="search-icon")
          input(v-model="filter" class="mr-1 ml-1" placeholder="Filtering")
          span.filtering-span {{ filteringItemLength }}件
          img(:src="require('@/assets/icons/result_search_clear.svg')" class="clear-icon" width="18px" @click="onKeywordClear")
      //- 説明無しの場合のレイアウト
      v-toolbar.white--text.table-toolbar(v-else color='#43A5C4' height='53')
        v-toolbar-title.group-name-title {{ dataFlow }}
          span.number-of-data 総件数：{{ indexList.length }}
        v-spacer
        div(class="filter-box")
          v-img(:src="require('@/assets/icons/search_search_blue.svg')" class="search-icon")
          input(v-model="filter" class="mr-1 ml-1" placeholder="Filtering")
          span.filtering-span {{ filteringItemLength }}件
          img(:src="require('@/assets/icons/result_search_clear.svg')" class="clear-icon" width="18px" @click="onKeywordClear")
      v-card-text(v-if='true' :class="indexList && indexList.description ? 'v-card-description' : 'v-card-non-description'")
        v-data-table.no-border(
          :height="indexList && indexList.description ? 'calc(100vh - 174px)': 'calc(100vh - 128px)'"
          :headers='headers'
          :items='indexList'
          :search="filter"
          disable-pagination
          hide-default-footer
          disable-sort
          dense
          fixed-header
          no-data-text="データがありません"
          @click:row="onSelectRow"
          @current-items="onUpdateItems"
          )
            template(v-slot:body="{ items }")
              tbody(id="t-body")
                tr(v-for="(item, index) in items" :class="`${item.selected ? 'table-tr-selected' : 'table-tr'}`" @click="onSelectRow(item)")
                  td()
                    span(:id="`${item.name.slice(0, 1).toLowerCase()}-name`" class="table-span") {{ item && item.name ? item.name : '' }}
                  td()
                    span(class="table-span") {{ item && item.logicalName ? item.logicalName : '' }}
                  //- td()
                  //-   span(class="table-span") {{ item && item.description ? item.description : '' }}
  CommonError(v-else-if="isFetchData" height='calc(100vh - 61px)' errType='error' mainErrText='データオブジェクトを取得できませんでした' secondaryErrText='再度お試しください')
  CommonError(v-else height='calc(100vh - 61px)' errType='index' mainErrText='左のメニューからカテゴリを選択することで' secondaryErrText='データオブジェクトの一覧を確認することができます')
</template>
<script>
import {computed, defineComponent, ref, watch} from '@nuxtjs/composition-api'
import { Category } from '~/constants/Category'
import {useIndexStore} from "~/store/indexModule";

// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// import _indexModule from '~/store/index/index'
// let indexModule = createNamespacedHelpers('index')

export default defineComponent({
  props: {
    isFetchData: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const headers = [
      {
        text: '物理名',
        value: 'name',
        align: 'start',
        width: '50%'
      },
      {
        text: '論理名',
        value: 'logicalName',
        align: 'start',
        width: '50%'
      }
      // {
      //   text: '説明',
      //   value: 'description',
      //   align: 'start',
      //   width: '40%'
      // }
    ]
    const filter = ref('')
    const filteringItemLength = ref(0)
    const alphabet = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '#'
    ]
    const matchAlphabet = ref([]) // アルファベットと一致している、物理名の先頭文字を格納する配列（重複無し）

    const indexModule = useIndexStore()

    // TODO: Vuex to Pinia
    // const { indexList, dataFlow } = indexModule.useState([
    //   'indexList',
    //   'dataFlow'
    // ])

    const indexList = computed(() => indexModule.indexList)
    const dataFlow = computed(() => indexModule.dataFlow)

    watch(indexList, (val) => {
      switch (val[0]?.label) {
        case Category.DASHBOARD:
          headers[0].text = 'ダッシュボード名'
          headers[1].text = '別名'
          break
        case Category.REPORT:
          headers[0].text = 'レポート名'
          headers[1].text = '別名'
          break
        case Category.DATASET:
          headers[0].text = 'データセット名'
          headers[1].text = '別名'
          break
        case Category.TABLE:
        case Category.VIEW:
          headers[0].text = '物理名'
          headers[1].text = '論理名'
          break
      }
      let firstAlphabets = [] // アルファベットと一致している、物理名の先頭文字を格納する配列（重複無し）
      let firstSlice = ''
      filter.value = ''
      val?.forEach((e) => {
        firstSlice = e?.name?.slice(0, 1)?.toUpperCase() // 物理名の先頭文字を取得し、大文字へ変換
        // 先頭文字が数字の場合は"#"に一致とする
        if (
          ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(
            firstSlice
          )
        ) {
          // '#'が重複しないように、2つ以上データがあればreturnする
          if (firstAlphabets?.includes('#')) return
          // ↓↓ 初期リリース時には数字の一致は起きない想定のため必ず非活性にさせたいので、一時的にコメントアウト
          // firstAlphabets?.push('#')
          return
        }
        // アルファベットが重複しないように、2つ以上先頭文字が同じデータがあれば、2つ目以上はreturnする
        if (firstAlphabets?.includes(firstSlice)) return
        firstAlphabets?.push(firstSlice)
      })
      matchAlphabet.value = firstAlphabets
    })
    headers[1].text = '別名'
    const onKeywordClear = () => {
      filter.value = ''
    }
    // データクリック時
    const onSelectRow = async (item) => {
      if (!item) return
      clearSelection(indexList.value)
      item.selected = true
      emit('onSelectRow', item)
    }
    // 全データ選択されていない状態にする
    const clearSelection = (items) => {
      if (!items) return
      items?.forEach((item) => {
        if (item.selected) item.selected = false
      })
    }
    const onClickAlphabet = (alphabet) => {
      if (matchAlphabet.value?.includes(alphabet)) {
        // 該当データのElement取得
        const dataElement = document.getElementById(
          alphabet.toLowerCase() + '-name'
        )
        // 該当データの"現在"の位置情報取得
        const dataElementRect = dataElement.getBoundingClientRect()
        // 該当データの現在位置(Top)から210px引いた位置取得
        const dataTop = dataElementRect.top - 210
        // テーブル要素のElement取得
        const tableElement = document.getElementsByClassName(
          'v-data-table__wrapper'
        )
        // テーブル要素の"現在"のスクロール位置取得
        const tableScrollTop = tableElement[0].scrollTop
        // テーブル要素の現在スクロール位置から、該当データのスクロール位置まで、スクロールさせる
        tableElement[0].scrollTop = tableScrollTop + dataTop
      }
    }
    const onUpdateItems = (item) => {
      filteringItemLength.value = item?.length
    }

    return {
      headers,
      filter,
      filteringItemLength,
      indexList,
      dataFlow,
      alphabet,
      matchAlphabet,
      onSelectRow,
      onKeywordClear,
      onClickAlphabet,
      onUpdateItems
    }
  }
})
</script>
<style lang="stylus">
#index-table-component
  position relative
  background #FCFCFC 0 0 no-repeat padding-box
  overflow-y hidden
  display flex
  .card-table
    width 100%
    box-shadow none !important
    .table-toolbar
      border-radius 4px
      box-shadow none
      .explanation-label
        width 100%
      .group-name-title
        font normal normal bold 14px/19px Yu Gothic UI
        .number-of-data
          font normal normal normal 12px/16px Yu Gothic UI
          font-size 12px
          margin-left 20px
      .filter-box
        position relative
        align-items center
        background #F7F7F7
        border-radius 4px
        width 240px
        height 28px
        padding-left 30px
        .search-icon
          position absolute
          top 6px
          left 8px
        .filtering-span
          color #909090
          font normal normal normal 12px/18px Yu Gothic UI
          display inline-block
          text-align right
          width 50px
        .clear-icon
          position absolute
          top 5px
          right 8px
          &:hover
            opacity 0.8
        input
          font normal normal normal 12px/18px Yu Gothic UI
          width 120px
          caret-color #000
          &:focus
            outline none
      .v-toolbar__extension
        padding 0 16px 12px 16px
        div
          width 100%
          .extension-wrapper
            background #FFFFFF33 0 0 no-repeat padding-box
            width 100%
            padding 8px 10px
            .extension-text
                font normal normal normal 12px/18px Yu Gothic UI
                max-width 100%
                padding 0
    .v-card__text
      padding 0 !important
      .v-data-table.no-border
        margin-top 8px
        background #FCFCFC 0 0 no-repeat padding-box
        th.text-start
          font normal normal normal 12px/16px Yu Gothic UI
          letter-spacing 0
          color #909090 !important
          padding 0 0 0 16px !important
        td.text-start
          text-align left
          font normal normal normal 12px/18px Yu Gothic UI
          letter-spacing 0
          color #41434E
          padding 0 0 0 16px !important
        tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper)
          background #E6F6FA
    .v-card-description
      height calc(100vh - 174px)
    .v-card-non-description
      height calc(100vh - 128px)
  .filter-block
    display flex
    flex-direction column
    align-items center
    user-select none
    margin-top 45px
    padding-right 15px
    max-height calc(100vh - 105px)
    overflow hidden auto
    padding-bottom 20px
    .filter-character
      position relative
      padding 4px
      &.pointer
        cursor pointer
        .character
          color #43A5C4 !important
          font normal normal bold 14px/19px Yu Gothic UI !important
      &::after
        position absolute
        top 9px
        left 36%
        content '.'
        font-size 18px
        color #555
      .character
        font normal normal bold 14px/19px Yu Gothic UI
        font-size 12px
        color #c0c0c0
    .last-character
      position relative
      background #D5D5D5
      border-radius 50%
      text-align center
      margin-top 8px
      // ↓↓ 初期リリースでは日本語の機能は実装しないため、一時的にコメントアウト
      // cursor pointer
      .character
        color #fff
        line-height 4px
        width 14px
        height 14px
.table-tr-selected
  background rgba(84, 172, 200, .2)
.table-span
  font-size 12px
// ↓↓ 一部環境でスタイルが適応されない現象が発生したため、スタイルを強制適応
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row), .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row) {
    border-bottom thin solid rgba(0, 0, 0, 0.12) !important
}
</style>
