<template lang="pug">
  #system-overview
    div.title-toolbar
      div.dashed
        div.dotted-line
        div.dotted-line
        div.dotted-line
      div.label-title Systems Overview
      div.dashed
        div.dotted-line
        div.dotted-line
        div.dotted-line
    v-tabs.system-options(
      next-icon="mdi-menu-right"
      prev-icon="mdi-menu-left"
      v-model='tabSystem'
      hide-slider
      )
      v-tab.system-block(
        v-for="system in systems"
        :key='system.id'
        )
        img(v-if='system.icon' :src='system.icon' class='sys-icon')
        | {{ system.name }}
    v-tabs-items(v-model='tabSystem')
      // Power BI用表示
      v-tab-item(key='1')
        div.system-overview-card(v-show="powerbiData && powerbiData.locations")
          v-card.card-table(v-for='(location, locationIndex) in powerbiData.locations' :key='locationIndex' width='100%')
            v-toolbar.white--text.table-toolbar(color='#43A5C4' height='53')
              v-toolbar-title.group-name-title {{ location.locationType }}
                //- データ件数が取得できるようになったら表示する
                //- span.number-of-data レポート数：1206件
              v-spacer
            v-card-text
              div(class='row row-dbo no-gutters' v-for='(item) in location.values' :key='item.id' @click="onClickItem(powerbiData.systemType, location.locationType, item.id)")
                div.dbo-name.col.col-3.inline-flex()
                  span {{ item.name }}
                  v-spacer
                  //- データ件数が取得できるようになったら表示する
                  //- span.extension レポート数：99件
                div.dbo-describe.col-9 データベース・スキーマの説明文がここに表示されます。データベース・スキーマの説明文がここに表示されます。データベース・スキーマの説明文がここに表示されます。
      // GMX用表示
      v-tab-item(key='2')
        div.system-overview-card(v-show="gmxData && gmxData.locations")
          v-card.card-table(v-for='(location, locationIndex) in gmxData.locations' :key='locationIndex' width='100%')
            v-toolbar.white--text.table-toolbar(color='#43A5C4' height='53' extended @click='onClickPulldown(location.locationType)')
              div(slot='extension')
                .extension-wrapper
                  .extension-text SQL Databaseはどこからデータを持ってきて何用にデータを加工、保存している場所です。
                v-btn(color='#fff' icon).expand-btn
                  v-icon(size='34' :id="`down-icon-${location.locationType}`" style="display:flex") {{ 'mdi-chevron-down' }}
                  v-icon(size='34' :id="`up-icon-${location.locationType}`" style="display:none") {{ 'mdi-chevron-up' }}
              v-toolbar-title.group-name-title {{ location.locationType }}
                span.number-of-data スキーマ数：{{ location.values.length || 0 }}件
              v-spacer
            v-expand-transition
              v-card-text(:id="`pulldown-content-${location.locationType}`" style="display:none")
                div(class='row row-dbo no-gutters' v-for='(item) in location.values' :key='item.id' @click="onClickItem(gmxData.systemType, location.locationType, item.id)")
                  div.dbo-name.col.col-3.flex
                    span {{ item.name }}
                    v-spacer
                    span
                  div.dbo-describe.col-9 データベース・スキーマの説明文がここに表示されます。データベース・スキーマの説明文がここに表示されます。データベース・スキーマの説明文がここに表示されます。
      // SAP用表示
      v-tab-item(key='3')
        div.system-overview-card(v-show="sapData && sapData.locations")
          v-card.card-table(v-for='(location, locationIndex) in sapData.locations' :key='locationIndex' width='100%')
            v-toolbar.white--text.table-toolbar(color='#43A5C4' height='53')
              v-toolbar-title.group-name-title {{ location.locationType }}
                //- データ件数が取得できるようになったら表示する
                //- span.number-of-data レポート数：1206件
              v-spacer
            v-card-text
              div(class='row row-dbo no-gutters' v-for='(item) in location.values' :key='item.id' @click="onClickItem(sapData.systemType, location.locationType, item.id)")
                div.dbo-name.col.col-3.inline-flex()
                  span {{ item.name }}
                  v-spacer
                  //- データ件数が取得できるようになったら表示する
                  //- span.extension レポート数：99件
                div.dbo-describe.col-9 データベース・スキーマの説明文がここに表示されます。データベース・スキーマの説明文がここに表示されます。データベース・スキーマの説明文がここに表示されます。
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import {
  defineComponent,
  ref,
  computed,
  useRouter
} from '@nuxtjs/composition-api'
import { useSearchStore } from "~/store/searchModule";
import { useIndexStore } from "~/store/indexModule";
// TODO: Vuex to Pinia
// let searchModule = createNamespacedHelpers('searches')
// let indexModule = createNamespacedHelpers('index')

export default defineComponent({
  setup() {
    const searchModule = useSearchStore()
    const indexModule = useIndexStore()

    const router = useRouter()
    const tabSystem = ref(null)
    const selectedSysName = ref('Power BI') // 選択中のシステム名
    // システム一覧
    const systems = [
      {
        id: 1,
        name: 'Power BI',
        icon: require('icon/powerbi.svg')
      },
      {
        id: 2,
        name: 'GMX',
        icon: ''
      },
      {
        id: 3,
        name: 'SAP',
        icon: ''
      }
      // {
      //   id: 4,
      //   name: 'Outsystems',
      //   icon: require('icon/outsystems.svg')
      // }
    ]
    // TODO: Vuex to Pinia
    // const { systemOverView } = searchModule.useState(['systemOverView']) // システムオーバービューのグローバルステート
    // // システムオーバービュー取得API実行メソッド参照
    // const { fetchSystemOverview } = searchModule.useActions([
    //   'fetchSystemOverview'
    // ])
    // // インデックス画面の左ツリー展開要素をセットするメソッド参照
    // const { SET_INITIAL_SELECTION_LOCATION } = indexModule.useMutations([
    //   'SET_INITIAL_SELECTION_LOCATION'
    // ])
    const systemOverView = computed(() => searchModule.systemOverView)
    const { setInitialSelectionLocation, fetchSystemOverview } = indexModule

    const locations = computed(() => {
      return systemOverView.value
    })
    // Power BI表示用データ
    const powerbiData = computed(() => {
      if (!systemOverView.value || systemOverView.value?.length === 0)
        return systemOverView.value
      return locations.value?.find((e) => e?.systemType === 'PowerBI') || {}
    })
    // GMX表示用データ
    const gmxData = computed(() => {
      if (!systemOverView.value || systemOverView.value?.length === 0)
        return systemOverView.value
      return locations.value?.find((e) => e?.systemType === 'GMX') || {}
    })
    // SAP表示用データ
    const sapData = computed(() => {
      if (!systemOverView.value || systemOverView.value?.length === 0)
        return systemOverView.value
      return locations.value?.find((e) => e?.systemType === 'SAP') || {}
    })

    // システムオーバービュー取得API実行
    const fetchSystemOverviewData = async () => {
      await fetchSystemOverview()
    }
    // Systems選択時
    const onSelectSystem = (sysName) => {
      selectedSysName.value = systems.find((item) => item.name === sysName).name
    }
    // SystemOverviewのプルダウンクリック時
    const onClickPulldown = (locationType) => {
      const pulldownContentElement = document.getElementById(
        `pulldown-content-${locationType}`
      )
      const downIconElement = document.getElementById(
        `down-icon-${locationType}`
      )
      const upIconElement = document.getElementById(`up-icon-${locationType}`)
      if (pulldownContentElement?.style?.display === 'none') {
        // プルダウンコンテンツ表示
        pulldownContentElement.style.display = 'block'
        if (!downIconElement?.style?.display || !upIconElement?.style?.display)
          return
        // ダウンアイコン非表示
        downIconElement.style.display = 'none'
        // アップアイコン表示
        upIconElement.style.display = 'flex'
      } else if (pulldownContentElement?.style?.display === 'block') {
        // プルダウンコンテンツ非表示
        pulldownContentElement.style.display = 'none'
        if (!downIconElement?.style?.display || !upIconElement?.style?.display)
          return
        // ダウンアイコン表示
        downIconElement.style.display = 'flex'
        // アップアイコン非表示
        upIconElement.style.display = 'none'
      }
    }
    // SystemOverviw内のロケーションデータクリック時
    const onClickItem = (systemType, locationType, locationId) => {
      // インデックス画面遷移時に左ツリーを展開させる要素をセット
      setInitialSelectionLocation({ systemType, locationType, locationId })
      // インデックス画面へ遷移
      router.push('/index')
    }

    fetchSystemOverviewData()

    return {
      tabSystem,
      systems,
      selectedSysName,
      powerbiData,
      gmxData,
      sapData,
      onSelectSystem,
      onClickPulldown,
      onClickItem
    }
  }
})
</script>
<style lang="stylus" scoped>
#system-overview
  background #F4F6F6
  /* equal to search's width */
  width calc(100vw - 64px - 48px * 2)
  min-width calc(190px + 810px)
  margin 0 auto
  padding-bottom 30px
  .v-window
    background #F4F6F7 0% 0% no-repeat padding-box
    border-bottom-left-radius  8px
    border-bottom-right-radius 8px
    border-top-right-radius 8px
  .title-toolbar
    display flex
    flex-basis 1
    height 35px
    margin-bottom 1rem
    .label-title
      color #777777
      font-size 16px
      line-height 2rem
      font-weight 500
      overflow: hidden;
      text-align center
      width 10%
      margin-left 20px
      margin-right 20px
    .dashed
      width 45%
      display: flex;
      justify-content center
      flex-direction column
      .dotted-line
        border:none
        border-top 2px dotted #D0D0D0
        background-color transparent
        height 6px
        width 100%

  .system-options.v-tabs
    >>>.v-tabs-bar
      background transparent
    >>>.v-slide-group__prev
      position absolute
      z-index 100
      left -35px
      top 10px
      &:after
        content ""
        width 49px
        height 48px
        position absolute
        right -25px
        top -10px
        background: transparent linear-gradient(-90deg, #FFFFFF00 0%, #F4F6F7 100%) 0% 0% no-repeat padding-box
    >>>.v-slide-group__prev--disabled
      &:after
        display none
    >>>.v-slide-group__next
      position absolute
      z-index 100
      right -35px
      top 10px
      &:before
        content ""
        width 49px
        height 48px
        position absolute
        left -25px
        top -10px
        background: transparent linear-gradient(90deg, #FFFFFF00 0%, #F4F6F7 100%) 0% 0% no-repeat padding-box
    >>>.v-slide-group__next--disabled
      &:before
        display none
    .system-block.v-tab
      cursor pointer
      width auto
      height 100%
      background rgba(178,178,178,.13)
      border-radius 8px 8px 0 0
      margin-right 8px
      font-size 14px
      font-weight 500
      color #41434E
      padding-top 12px
      padding-bottom 12px
      padding-left 20px
      padding-right 31px
      line-height 16px
      text-transform none
      &.v-tab--active
        background #F9FBFC 0% 0% no-repeat padding-box
        box-shadow: 1px 1px 2px #00000029
        &::before
          opacity 0
      .sys-icon
        margin-right 8px
        float left
  .system-overview-card
    position relative
    background #F9FBFC 0 0 no-repeat padding-box
    overflow-y auto
    box-shadow 1px 1px 2px #00000029
    border-bottom-left-radius  8px
    border-bottom-right-radius 8px
    border-top-right-radius 8px
    padding 0 16px
    .card-table
      width 100%
      box-shadow 1px 1px 2px #00000033
      border-radius 8px
      margin 16px 0
      .table-toolbar
        border-radius 8px 8px 0 0
        cursor pointer
        .explanation-label
          width 100%
        .group-name-title
          font normal normal bold 14px/19px Yu Gothic UI
          .number-of-data
            font normal normal normal 12px/16px Yu Gothic UI
            font-size 12px
            margin-left 20px
        .v-toolbar__extension
          padding 0 16px 12px 16px
          div
            width 100%
            .extension-wrapper
              background #FFFFFF33 0 0 no-repeat padding-box
              width 96%
              padding 8px 10px
              .extension-text
                font normal normal normal 12px/18px Yu Gothic UI
                max-width 100%
                padding 0
            .expand-btn
              position absolute
              top -4px
              right 0.5%
        .v-btn
          .v-icon
            justify-content center
      .v-card__text
        background #E9EEF0
        padding 10px
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
        .row-dbo
          border-radius 7px
          border 1px solid #BCD2D8
          box-shadow 1px 1px 2px #00000033
          font-size 12px
          background #fff
          margin 8px 16px
          cursor pointer
          .dbo-name
            display inline-flex
            border-radius 7px 0 0 7px
            background #ffffff
            color #43A5C4
            padding 12px 16px
            .extension
              color #777777
          .dbo-describe
            border-radius 0 7px 7px 0
            background #F4F7F8
            padding 12px 16px
</style>
