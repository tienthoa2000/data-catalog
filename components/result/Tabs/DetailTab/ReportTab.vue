<template lang="pug">
  div(v-if="selectedItem && selectedItem.values" class="detail-tab-content")
    v-row
      v-col(cols="12" sm="6" md="3" class="min-width-120")
        p(class="label text-small") {{ $t('report_tab.REPORT_NAME') }}
        p(v-if="selectedItem.values.report && selectedItem.values.report.reportName" class="value" v-tooltip="selectedItem.values.report.reportName") {{ selectedItem.values.report.reportName }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('report_tab.ALIAS') }}
        p(v-if="selectedItem.values.report && selectedItem.values.report.logicalName" class="value") {{ selectedItem.values.report.logicalName }}
      v-col(cols="12" sm="6" md="4" class="min-width-120")
        p(class="label text-small") {{ $t('report_tab.POWER_BI_URL') }}
        a(v-if="selectedItem.values.report && selectedItem.values.report.powerbiUrl" :href="selectedItem.values.report.powerbiUrl" target="_blank" rel="noopener noreferrer" style="text-decoration:none; display:flex; align-items:center;")
          p(class="value" style="color:#43A5C4; text-decoration:none; cursor:pointer;") Power BI画面へ&nbsp;
          img(:src="require('@/assets/icons/url_link.svg')" height="12px")
      v-col(cols="12" sm="6" md="2")
      v-col(cols="12" sm="6" md="1" class="d-flex justify-end")
        //-v-btn(elevation="3" class="edit-btn")
          img(:src="require('@/assets/icons/detail_edit.svg')" height="13px")
    v-row
      v-col(cols="12" sm="6" md="3" class="min-width-120")
        p(class="label text-small") {{ $t('report_tab.LOCATION') }}
        p(v-if="selectedItem.values.locationName" class="value") {{ selectedItem.values.locationName }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('report_tab.WORKSPACE') }}
        p(v-if="selectedItem.values.report && selectedItem.values.report.workspace && selectedItem.values.report.workspace.workspaceName" class="value") {{ selectedItem.values.report.workspace.workspaceName }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('report_tab.CATEGORY') }}
        p(v-if="selectedItem.values.category && selectedItem.values.category.name" class="value") {{ Category.getCategoryText(selectedItem.values.category.name) }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('report_tab.DATA_OWNER') }}
        AppLink(v-if="selectedItem.values.owner && selectedItem.values.owner.name && selectedItem.values.owner.mailAddress" class="value" :to="selectedItem.values.owner.mailAddress")
          span {{ selectedItem.values.owner.name }}
          img(class="ml-3" :src="require('@/assets/icons/detail_mail.svg')" height="13px")
    v-row
      v-col(cols="12" sm="6" md="12")
        p(class="label text-small") {{ $t('report_tab.TAG') }}
        div.tags-list(v-if="selectedItem.values.tags && selectedItem.values.tags.length > 0")
          div.tag-item(v-for="tag in selectedItem.values.tags")
            div {{tag.name}}
    v-row
      v-col(cols="12")
        p(class="label text-small") {{ $t('report_tab.DATASET_LIST') }}
        div.table-container
          div.table-content
            v-data-table(
              :headers="headers"
              :items="selectedItem.values.datasets"
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
              //-       //- th(style="width: 20%")
              //-       //-   span {{ $t('report_tab.DATASET_ID') }}
              //-       th(style="width:25%")
              //-         span {{ $t('report_tab.DATASET_NAME') }}
              //-       th(style="width:25%")
              //-         span {{ $t('report_tab.WORKSPACE_NAME') }}
              //-       th(style="width:50%")
              //-         span {{ $t('report_tab.POWER_BI_URL') }}
              //-       //- th(style="width: 20%")
              //-       //-   span {{ $t('report_tab.DESCRIPTION') }}
              template(v-slot:body="{ items }")
                tbody(v-for="(item, index) in items")
                  tr(:key="index")
                    //- td(style="width:20%; word-break:break-all; font-size:12px;")
                    //-   p {{ item.datasetId }}
                    td(style="width:50%; word-break:break-all; font-size:12px;")
                      a(:href="false" target="_blank" @click="$emit('onChildClick', {...item, label:'dataset'})" rel="noopener noreferrer" style="text-decoration:none; display:flex; align-items:center;")
                        p {{ item.datasetName }}
                    td(style="width:50%; word-break:break-all; font-size:12px;")
                      p {{ item.workspace.workspaceName }}
                    //- td(style="width: 20%; word-break:break-all; font-size:12px;")
                    //-   p {{ item.description }}
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
      {
        text: 'データセット名',
        value: 'datasetName',
        width: '50%'
      },
      {
        text: 'ワークスペース名',
        value: 'workspace.workspaceName',
        width: '50%'
      }
      // { text: '説明', value: 'description', width: '20%' }
    ]
    const itemsPerPage = -1 // -1 指定で全てのデータ表示
    const sortBy = 'datasetName' // ソート対象のカラム名
    const sortDesc = false // ソート判定(falseが昇順、trueが降順)

    return {
      Category,
      selectedItem,
      headers,
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
