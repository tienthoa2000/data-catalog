<template lang="pug">
  div(v-if="selectedItem && selectedItem.values" class="detail-tab-content")
    v-row
      v-col(cols="12" sm="6" md="3" class="min-width-120")
        p(class="label text-small") {{ $t('dashboard_tab.DASHBOARD_NAME') }}
        p(v-if="selectedItem.values.dashboard && selectedItem.values.dashboard.dashboardName" class="value" v-tooltip="selectedItem.values.dashboard.dashboardName") {{ selectedItem.values.dashboard.dashboardName }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('dashboard_tab.ALIAS') }}
        p(v-if="selectedItem.values.dashboard && selectedItem.values.dashboard.logicalName" class="value") {{ selectedItem.values.dashboard.logicalName }}
      v-col(cols="12" sm="6" md="4" class="min-width-120")
        p(class="label text-small") {{ $t('dashboard_tab.POWER_BI_URL') }}
        a(v-if="selectedItem.values.dashboard && selectedItem.values.dashboard.powerbiUrl" :href="selectedItem.values.dashboard.powerbiUrl" target="_blank" rel="noopener noreferrer" style="text-decoration:none; display:flex; align-items:center;")
          p(class="value" style="color:#43A5C4; text-decoration:none; cursor:pointer;") Power BI画面へ&nbsp;
          img(:src="require('@/assets/icons/url_link.svg')" height="12px")
      v-col(cols="12" sm="6" md="2")
      v-col(cols="12" sm="6" md="1" class="d-flex justify-end")
        //-v-btn(elevation="3" class="edit-btn")
          img(:src="require('@/assets/icons/detail_edit.svg')" height="13px")
    v-row
      v-col(cols="12" sm="6" md="3" class="min-width-120")
        p(class="label text-small") {{ $t('dashboard_tab.LOCATION') }}
        p(v-if="selectedItem.values.locationName" class="value") {{ selectedItem.values.locationName }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('dashboard_tab.WORKSPACE') }}
        p(v-if="selectedItem.values.dashboard && selectedItem.values.dashboard.workspace && selectedItem.values.dashboard.workspace.workspaceName" class="value") {{ selectedItem.values.dashboard.workspace.workspaceName }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('dashboard_tab.CATEGORY') }}
        p(v-if="selectedItem.values.category && selectedItem.values.category.name" class="value") {{ Category.getCategoryText(selectedItem.values.category.name) }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('dashboard_tab.DATA_OWNER') }}
        AppLink(v-if="selectedItem.values.owner && selectedItem.values.owner.name && selectedItem.values.owner.mailAddress" class="value" :to="selectedItem.values.owner.mailAddress")
          span {{ selectedItem.values.owner.name }}
          img(class="ml-3" :src="require('@/assets/icons/detail_mail.svg')" height="13px")
    v-row
      v-col(cols="12" sm="6" md="12")
        p(class="label text-small") {{ $t('dashboard_tab.TAG') }}
        div.tags-list(v-if="selectedItem.values.tags && selectedItem.values.tags.length > 0")
          div.tag-item(v-for="tag in selectedItem.values.tags")
            div {{tag.name}}
    v-row
      v-col(cols="12")
        p(class="label text-small") {{ $t('dashboard_tab.REPORT_LIST') }}
        div.table-container
          div.table-content
            v-data-table(
              :headers="headers"
              :items="selectedItem.values.reports"
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
              //-       //-   span {{ $t('dashboard_tab.REPORT_ID') }}
              //-       th(style="width:25%")
              //-         span {{ $t('dashboard_tab.REPORT_NAME') }}
              //-       th(style="width:25%")
              //-         span {{ $t('dashboard_tab.WORKSPACE_NAME') }}
              //-       th(style="width:50%")
              //-         span {{ $t('dashboard_tab.POWER_BI_URL') }}
              //-       //- th(style="width: 20%")
              //-       //-   span {{ $t('dashboard_tab.DESCRIPTION') }}
              template(v-slot:body="{ items }")
                tbody(v-for="(item, index) in items")
                  tr(:key="index")
                    //- td(style="width:20%; word-break:break-all; font-size:12px;")
                    //-   p {{ item.reportId }}
                    td(style="width:25%; word-break:break-all; font-size:12px;")
                      a(:href="false" target="_blank" @click="$emit('onChildClick', {...item, label:'report'})" rel="noopener noreferrer" style="text-decoration:none; display:flex; align-items:center;")
                        p {{ item.reportName }}
                    td(style="width:25%; word-break:break-all; font-size:12px;")
                      p {{ item.workspace.workspaceName }}
                    td(style="width:50%; word-break:break-all;")
                      a(:href="item.powerbiUrl" target="_blank" rel="noopener noreferrer" style="text-decoration:none; display:flex; align-items:center;")
                        p(style="font-size:12px; max-width:190px; color:#43A5C4; text-decoration:none; cursor:pointer; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;") Power BI画面へ&nbsp;
                        img(:src="require('@/assets/icons/url_link.svg')" height="12px")
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
      { text: 'レポート名', value: 'reportName', width: '25%' },
      {
        text: 'ワークスペース名',
        value: 'workspace.workspaceName',
        width: '25%'
      },
      { text: 'Power BI URL', value: 'powerbiUrl', width: '50%' }
      // { text: '説明', value: 'colExtProperty.desc' }
    ]
    const itemsPerPage = -1 // -1 指定で全てのデータ表示
    const sortBy = 'reportName' // ソート対象のカラム名
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
