<template lang="pug">
  div(v-if="selectedItem && selectedItem.values" class="detail-tab-content")
    v-row
      v-col(cols="12" sm="6" md="3" class="min-width-120")
        p(class="label text-small") {{ $t('dataset_tab.DATASET_NAME') }}
        p(v-if="selectedItem.values.dataset && selectedItem.values.dataset.datasetName" class="value" v-tooltip="selectedItem.values.dataset.datasetName") {{ selectedItem.values.dataset.datasetName }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('dataset_tab.ALIAS') }}
        p(v-if="selectedItem.values.dataset && selectedItem.values.dataset.logicalName" class="value") {{ selectedItem.values.dataset.logicalName }}
      v-col(cols="12" sm="6" md="2")
      v-col(cols="12" sm="6" md="1" class="d-flex justify-end")
        //-v-btn(elevation="3" class="edit-btn")
          img(:src="require('@/assets/icons/detail_edit.svg')" height="13px")
    v-row
      v-col(cols="12" sm="6" md="3" class="min-width-120")
        p(class="label text-small") {{ $t('dataset_tab.LOCATION') }}
        p(v-if="selectedItem.values.locationName" class="value") {{ selectedItem.values.locationName }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('dataset_tab.WORKSPACE') }}
        p(v-if="selectedItem.values.dataset && selectedItem.values.dataset.workspace && selectedItem.values.dataset.workspace.workspaceName" class="value") {{ selectedItem.values.dataset.workspace.workspaceName }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('dataset_tab.CATEGORY') }}
        p(v-if="selectedItem.values.category && selectedItem.values.category.name" class="value") {{ Category.getCategoryText(selectedItem.values.category.name) }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('dataset_tab.DATA_OWNER') }}
        AppLink(v-if="selectedItem.values.owner && selectedItem.values.owner.name && selectedItem.values.owner.mailAddress" class="value" :to="selectedItem.values.owner.mailAddress")
          span {{ selectedItem.values.owner.name }}
          img(class="ml-3" :src="require('@/assets/icons/detail_mail.svg')" height="13px")
    v-row
      v-col(cols="12" sm="6" md="12")
        p(class="label text-small") {{ $t('dataset_tab.TAG') }}
        div.tags-list(v-if="selectedItem.values.tags && selectedItem.values.tags.length > 0")
          div.tag-item(v-for="tag in selectedItem.values.tags")
            div {{tag.name}}
    v-row
      v-col(cols="12")
        p(class="label text-small") {{ $t('dataset_tab.FIELD_LIST') }}
        div.table-container
          div.table-content
            v-data-table(
              :headers="headers"
              :items="selectedItem.values.columns"
              hide-default-footer
              no-data-text="データがありません。"
              fixed-header
              height="calc(100vh - 420px)"
              :items-per-page="itemsPerPage"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
            )
              //- template(v-slot:header="{}")
              //-   thead
              //-     tr
              //-       th(style="width:22%")
              //-         span {{ $t('dataset_tab.TABLE_NAME') }}
              //-       th(style="width:16%")
              //-         span {{ $t('dataset_tab.PHYSICAL_NAME') }}
              //-       th(style="width:16%")
              //-         span {{ $t('dataset_tab.LOGICAL_NAME') }}
              //-       th(style="width:10%")
              //-         span {{ $t('dataset_tab.DATA_FORMAT') }}
              //-       th(style="width:8%")
              //-         span {{ $t('dataset_tab.LENGTH') }}
              //-       th(style="width:28%")
              //-         span {{ $t('dataset_tab.DATASOURCE_VIEW_COLUMN') }}
              //-       //- th(style="width:22%")
              //-       //-   span {{ $t('dataset_tab.DESCRIPTION') }}
              //- template(v-slot:body="{ items }")
              //-   tbody(v-for="(item, index) in items")
              //-     tr(:key="index")
              //-       td(style="width:25%; word-break:break-all; font-size:12px;")
              //-         p {{ item.tableName }}
              //-       td(style="width:20%; word-break:break-all; font-size:12px;")
              //-         p {{ item.columnName }}
              //-       td(style="width:20%; word-break:break-all; font-size:12px;")
              //-         p {{ item.logicalName }}
              //-       td(style="width:10%; word-break:break-all; font-size:12px;")
              //-         p {{ item.format }}
              //-       td(style="width:25%; word-break:break-all; font-size:12px;")
              //-         p {{ item.length }}
              //-       //- td(style="width: 28%; word-break:break-all; font-size:12px;")
              //-       //-   p {{ item.datasourceViewColumn }}
              //-       //- td(style="width: 22%; word-break:break-all; font-size:12px;")
              //-       //-   p {{ item.description }}
  CommonError(v-else height="calc(100vh - 90px)" errType='error' mainErrText='データオブジェクトを取得できませんでした' secondaryErrText='再度お試しください')
</template>
<script>

import {computed, defineComponent} from '@nuxtjs/composition-api'
import { Category } from '~/constants/Category'
import { useResultStore } from "~/store/resultModule";

// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// let resultModule = createNamespacedHelpers('results')

export default defineComponent({
  setup() {
    const resultModule = useResultStore()
    // TODO: Vuex to Pinia
    // const { selectedItem } = resultModule.useState(['selectedItem'])
    const selectedItem = computed(() => resultModule.selectedItem)
    const headers = [
      { text: 'テーブル名', value: 'tableName', width: '20%' },
      { text: '項目名（物理名）', value: 'columnName', width: '16%' },
      { text: '項目名（論理名）', value: 'logicalName', width: '16%' },
      { text: '書式', value: 'format', width: '10%' },
      { text: '長さ', value: 'maxLength', width: '96px', align: 'right' },
      { text: '', value: '', sortable: false }
      // {
      //   text: 'データソース / 画面 / 項目名',
      //   value: 'datasourceViewColumn',
      //   width: '28%'
      // }
      // { text: '説明', value: 'colExtProperty.desc' }
    ]
    const itemsPerPage = -1 // -1 指定で全てのデータ表示
    const sortBy = 'tableName' // ソート対象のカラム名
    const sortDesc = false // ソート判定(falseが昇順、trueが降順)

    return {
      Category,
      headers,
      selectedItem,
      itemsPerPage,
      sortBy,
      sortDesc
    }
  }
})
</script>
<style lang="stylus" scoped>
@import '@/assets/stylus/components/result/Tabs/DetailTab.styl'
.table-content .v-table-table .v-data-table-header {
  background-color: #EAF0F2;
}
</style>
