<template lang="pug">
  div(v-if="selectedItem && selectedItem.values" class="detail-tab-content")
    v-row
      v-col(cols="12" sm="6" :md="`${nameColsMd}`" class="min-width-120")
        p(class="label text-small") {{ $t('detail_tab.PHYSICAL_NAME') }}
        p(v-if="table.name" ref="nameRef" class="value" v-tooltip="table.name") {{ table.name }}
      v-col(cols="12" sm="6" :md="`${logicalNameColsMd}`" class="min-width-120")
        p(class="label text-small") {{ $t('detail_tab.LOGICAL_NAME') }}
        p(v-if="table.logicalName" ref="logicalNameRef" class="value") {{ table.logicalName }}
      v-col(cols="12" sm="6" :md="`${spaceColsMd}`")
      v-col(cols="12" sm="6" md="2" class="d-flex justify-end")
        //-v-btn(elevation="3" class="edit-btn")
          img(:src="require('@/assets/icons/detail_edit.svg')" height="13px")
    v-row
    v-row
      v-col(cols="12" sm="6" :md="`${nameColsMd}`" class="min-width-120")
        p(class="label text-small") {{ $t('detail_tab.LOCATION') }}
        p(v-if="location.name" class="value") {{ location.name }}
      v-col(cols="12" sm="6" :md="`${logicalNameColsMd}`" class="min-width-120")
        p(class="label text-small") {{ $t('detail_tab.SCHEMA') }}
        p(v-if="schema.name" class="value") {{ schema.name }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('detail_tab.CATEGORY') }}
        p(v-if="table.category" class="value") {{ Category.getCategoryText(table.category) }}
      v-col(cols="12" sm="6" md="2" class="min-width-120")
        p(class="label text-small") {{ $t('detail_tab.DATA_OWNER') }}
        p(v-if="owner.name" class="value") {{ owner.name }}
    v-row
      v-col(cols="12" sm="6" md="6")
        p(class="label text-small") {{ $t('detail_tab.TAG') }}
        div.tags-list
          div.tag-item(v-for="item in tags")
            div {{item.name}}
    v-row
      v-col(cols="12")
        p(class="label text-small") {{ $t('detail_tab.COLUMN') }}
        div.table-container
          div.table-content
            v-data-table(
              :headers="headers"
              :items="columns"
              hide-default-footer
              no-data-text="データがありません。"
              fixed-header
              height="calc(100vh - 420px)"
              :items-per-page.sync="itemsPerPage"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
            )
              //- template(v-slot:item.columnId="{ item }")
              //-   span {{item && item.columnId ? item.columnId : ''}}
              //- template(v-slot:item.name="{ item }")
              //-   span {{item && item.name ? item.name : ''}}
              //- template(v-slot:item.logicalName="{ item }")
              //-   span {{item && item.logicalName ? item.logicalName : ''}}
              //- template(v-slot:item.typeName="{ item }")
              //-   span {{item && item.typeName ? item.typeName : ''}}
              //- template(v-slot:item.maxLength="{ item }")
              //-   span {{ item.typeName !== 'int' ? item.maxLength : '' }}
  CommonError(v-else height="calc(100vh - 90px)" errType='error' mainErrText='データオブジェクトを取得できませんでした' secondaryErrText='再度お試しください')
</template>
<script>
import {defineComponent, ref, onMounted, computed} from '@nuxtjs/composition-api'
import { Category } from '~/constants/Category'
import { useResultStore } from "~/store/resultModule";
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// let resultModule = createNamespacedHelpers('results')

export default defineComponent({
  setup() {
    const resultModule = useResultStore()
    // TODO: Vuex to Pinia
    // const {
    //   columns,
    //   location,
    //   owner,
    //   tags,
    //   table,
    //   schema,
    //   selectedItemType
    // } = resultModule.useGetters([
    //   'columns',
    //   'location',
    //   'owner',
    //   'tags',
    //   'table',
    //   'schema',
    //   'selectedItemType'
    // ])
    // const { selectedItem } = resultModule.useState(['selectedItem'])

    const columns = computed(()=> resultModule.columns)
    const location = computed(()=> resultModule.location)
    const owner = computed(()=> resultModule.owner)
    const tags = computed(()=> resultModule.tags)
    const table = computed(()=> resultModule.table)
    const schema = computed(()=> resultModule.schema)
    const selectedItemType = computed(()=> resultModule.selectedItemType)
    const selectedItem = computed(()=> resultModule.selectedItem)

    const headers = [
      { text: 'カラムID', value: 'columnId', width: '96px', align: 'right' },
      { text: 'カラム名', value: 'name', width: '20%' },
      { text: '論理名', value: 'logicalName', width: '20%' },
      { text: 'データ型', value: 'typeName', width: '100px' },
      { text: '長さ', value: 'maxLength', width: '96px', align: 'right' },
      { text: '', value: '', sortable: false }
      // { text: 'データソース / 画面 / 項目名', value: '' },
      // { text: '説明', value: 'colExtProperty.desc' }
    ]
    const itemsPerPage = -1 // -1 指定で全てのデータ表示
    const sortBy = 'columnId' // ソート対象のカラム名
    const sortDesc = false // ソート判定(falseが昇順、trueが降順)

    const nameRef = ref(null)
    const nameWidthDiff = ref(null)
    const nameColsMd = ref(2)
    const spaceColsMd = ref(6)

    const logicalNameRef = ref(null)
    const logicalNameWidthDiff = ref(null)
    const logicalNameColsMd = ref(2)

    onMounted(() => {
      if (nameRef.value) {
        nameWidthDiff.value =
          nameRef.value.scrollWidth / nameRef.value.offsetWidth
      }
      if (logicalNameRef.value) {
        logicalNameWidthDiff.value =
          logicalNameRef.value.scrollWidth / logicalNameRef.value.offsetWidth
      }

      if (1.0 >= nameWidthDiff.value) {
        nameColsMd.value = 2
      } else if (1.0 < nameWidthDiff.value && 1.5 >= nameWidthDiff.value) {
        nameColsMd.value = 3
      } else if (1.5 < nameWidthDiff.value && 2.0 >= nameWidthDiff.value) {
        nameColsMd.value = 4
      } else if (2.0 < nameWidthDiff.value && 2.5 >= nameWidthDiff.value) {
        nameColsMd.value = 5
      } else {
        nameColsMd.value = 6
      }

      if (1.0 >= logicalNameWidthDiff.value) {
        logicalNameColsMd.value = 2
        spaceColsMd.value = 8 - nameColsMd.value
      } else if (
        1.0 < logicalNameWidthDiff.value &&
        1.5 >= logicalNameWidthDiff.value
      ) {
        if (nameColsMd.value <= 5) {
          logicalNameColsMd.value = 3
          spaceColsMd.value = 7 - nameColsMd.value
        } else {
          logicalNameColsMd.value = 2
          spaceColsMd.value = 8 - nameColsMd.value
        }
      } else if (
        1.5 < logicalNameWidthDiff.value &&
        2.0 >= logicalNameWidthDiff.value
      ) {
        if (nameColsMd.value <= 4) {
          logicalNameColsMd.value = 4
          spaceColsMd.value = 6 - nameColsMd.value
        } else if ((nameColsMd.value = 5)) {
          logicalNameColsMd.value = 3
          spaceColsMd.value = 2
        } else {
          logicalNameColsMd.value = 2
          spaceColsMd.value = 8 - nameColsMd.value
        }
      } else if (
        2.0 < logicalNameWidthDiff.value &&
        2.5 >= logicalNameWidthDiff.value
      ) {
        if (nameColsMd.value <= 3) {
          logicalNameColsMd.value = 5
          spaceColsMd.value = 5 - nameColsMd.value
        } else if ((nameColsMd.value = 4)) {
          logicalNameColsMd.value = 4
          spaceColsMd.value = 2
        } else if ((nameColsMd.value = 5)) {
          logicalNameColsMd.value = 3
          spaceColsMd.value = 2
        } else {
          logicalNameColsMd.value = 2
          spaceColsMd.value = 8 - nameColsMd.value
        }
      }
    })

    return {
      Category,
      selectedItem,
      headers,
      itemsPerPage,
      sortBy,
      sortDesc,
      columns,
      location,
      owner,
      tags,
      table,
      schema,
      selectedItemType,
      nameRef,
      nameWidthDiff,
      nameColsMd,
      spaceColsMd,
      logicalNameRef,
      logicalNameWidthDiff,
      logicalNameColsMd
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
