<template lang="pug">
  #index-component
    v-card.mx-auto.grand-father(min-width='600')
      v-toolbar.white--text(color='#43A5C4' height='35')
        v-toolbar-title.group-name-title SQL Database
        v-spacer
      v-container(fluid='')
        v-card.father(min-width='584')
          v-toolbar.white--text(color='#5C97A8', height='32')
            v-card-title.dbo-name-title(@click='$emit("toggleDbo", 1)') PST_DWH / dbo
          v-card-text(v-if='false')
            v-row(dense='')
              v-col(cols='12')
                v-card.child(min-width='568' max-height='250')
                  v-toolbar.white--text(color='#909B9F', height='32')
                    v-card-title.table-title Tables
                  v-card-text
                    v-data-table(:headers='headers', :items='indexListData', hide-default-footer, disable-sort, dense)
              v-col(cols='12')
                v-card.child(min-width='568' max-height='250')
                  v-toolbar.white--text(color='#909B9F', height='32')
                    v-card-title.table-title Views
                  v-card-text
                    v-data-table.elevation-0(:headers='headers', :items='indexListData', hide-default-footer, disable-sort, dense)
        v-card.father(min-width='584' max-height='556')
          v-toolbar.white--text(color='#5C97A8', height='32')
            v-card-title.dbo-name-title(@click='$emit("toggleDbo", 2)') PST_DWH / dbo
          v-card-text(v-if='true')
            v-row(dense='')
              v-col(cols='12')
                v-card.child(min-width='568' max-height='250')
                  v-toolbar.white--text(color='#909B9F', height='32')
                    v-card-title.table-title Tables
                  v-card-text
                    v-data-table(:headers='headers', :items='indexListData', hide-default-footer, disable-sort, dense)
              v-col(cols='12')
                v-card.child(min-width='568' max-height='250')
                  v-toolbar.white--text(color='#909B9F', height='32')
                    v-card-title.table-title Views
                  v-card-text
                    v-data-table.elevation-0(:headers='headers', :items='indexListData', hide-default-footer, disable-sort, dense)
        v-card.father(min-width='584' max-height='556')
          v-toolbar.white--text(color='#5C97A8', height='32')
            v-card-title.dbo-name-title(@click='$emit("toggleDbo", 3)') PST_DWH / dbo
          v-card-text(v-if='false')
            v-row(dense='')
              v-col(cols='12')
                v-card.child(min-width='568' max-height='250')
                  v-toolbar.white--text(color='#909B9F', height='32')
                    v-card-title.table-title Tables
                  v-card-text
                    v-data-table(:headers='headers', :items='indexListData', hide-default-footer, disable-sort, dense)
              v-col(cols='12')
                v-card.child(min-width='568' max-height='250')
                  v-toolbar.white--text(color='#909B9F', height='32')
                    v-card-title.table-title Views
                  v-card-text
                    v-data-table.elevation-0(:headers='headers', :items='indexListData', hide-default-footer, disable-sort, dense)
        v-card.father(min-width='584' max-height='556')
          v-toolbar.white--text(color='#5C97A8', height='32')
            v-card-title.dbo-name-title(@click='$emit("toggleDbo", 4)') PST_DWH / dbo
          v-card-text(v-if='false')
            v-row(dense='')
              v-col(cols='12')
                v-card.child(min-width='568' max-height='250')
                  v-toolbar.white--text(color='#909B9F', height='32')
                    v-card-title.table-title Tables
                  v-card-text
                    v-data-table(:headers='headers', :items='indexListData', hide-default-footer, disable-sort, dense)
              v-col(cols='12')
                v-card.child(min-width='568' max-height='250')
                  v-toolbar.white--text(color='#909B9F', height='32')
                    v-card-title.table-title Views
                  v-card-text
                    v-data-table.elevation-0(:headers='headers', :items='indexListData', hide-default-footer, disable-sort, dense)

</template>
<script>
import {
  defineComponent,
  useFetch,
  useContext,
  ref,
  reactive
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    indexListData: { type: Array, default: () => [] }
  },
  setup() {
    const headers = [
      {
        text: '物理名',
        value: 'physicalName',
        align: 'start',
        width: '33.33%'
      },
      {
        text: '論理名',
        value: 'theoryName',
        align: 'start',
        width: '33.33%'
      },
      {
        text: '説明',
        value: 'illustrate',
        align: 'start',
        width: '33.33%'
      }
    ]

    return {
      headers
    }
  }
})
</script>
<style lang="stylus" scoped>
#index-component
  .container
    padding 8px !important
  >>>.v-toolbar__content
    padding 8px 16px !important
  >>>.v-sheet.v-toolbar
    box-shadow 1px 1px 2px #00000033 !important
    border-radius 2px 2px 0 0 !important
  .group-name-title
    text-align left
    font normal normal bold 14px/19px Yu Gothic UI
    letter-spacing 0
    color #F5F5F5
    padding-left 0
  .dbo-name-title
    text-align left
    font normal normal bold 12px/16px Yu Gothic UI
    letter-spacing 0
    color #F5F5F5
    padding-left 0
  .table-title
    text-align left
    font normal normal bold 12px/16px Yu Gothic UI
    letter-spacing 0
    color #F5F5F5
    padding-left 0
  >>>.v-sheet.v-card
    &.grand-father
      background #E9EEF0 0 0 no-repeat padding-box
      box-shadow 1px 1px 2px #00000033
      border-radius 2px
    &.father
      background #F0F4F5 0 0 no-repeat padding-box
      box-shadow none !important
      border-radius 4px
      padding-top 8px
      .v-card__text
        padding 8px !important
    &.child
      background #FAFAFA 0 0 no-repeat padding-box
      box-shadow none !important
      border-radius 4px
      .v-card__text
        overflow-y auto
        max-height 218px
        padding 0 !important
      .v-data-table
        background #FAFAFA 0 0 no-repeat padding-box
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
</style>
