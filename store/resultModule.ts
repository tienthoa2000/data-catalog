import { defineStore } from 'pinia'
import { store as vuexStore } from '@/store'
import { $axios } from '~/utils/api'
import { Catalog } from '~/store/types'
import { Category } from '~/constants/Category'
type Tag = {
  id: number
  name: string
}

export type SelectedItem = {
  id: number
  label: string
  name: string
  values: {
    columns: {
      description: string
      id: number
      logicalName: string
      maxLength: string
      name: string
      typeName: string
    }[]
    location: {
      id: number
      name: string
    }
    owner: {
      id: number
      mailAddress: string
      name: string
    }
    schema: {
      id: number
      name: string
    }
    table: {
      id: number
      logicalName: string
      name: string
    }
    tags: Tag[]
  }
}

export type ResultItem = {
  tags: Tag[]
  id: number
  label: string
  name: string
  logicalName: string
  modifyDate: string
  typeDesc: string
  owner: string
  location: string
}

type TagType = {
  id: number
  name: string
}

type TagSearchData = {
  id: number
  label: string
  name: string
  logicalName: string
  location: string
  tags: TagType[]
}
export interface ResultState {
  catalogs: Catalog[]
  resultList: ResultItem[]
  // selectedItem: SelectedItem
  selectedItem: any
  tabId: number
  lineageData: any
  pipelineList: any
  // showItems: SelectedItem[]
  showItems: any[]
  showPipelineList: any[]
  isSearched: boolean
  isSrchLimit: boolean
  detailedInformation: boolean
  tagSearchList: TagSearchData[]
}

export const useResultStore = defineStore('results', {
  state: () =>
    ({
      catalogs: [],
      resultList: [],
      selectedItem: {},
      tabId: 0,
      lineageData: {},
      pipelineList: {},
      showItems: [],
      showPipelineList: [],
      isSearched: false,
      isSrchLimit: false,
      detailedInformation: false,
      tagSearchList: [],
    } as ResultState),
  getters: {
    selectedItemType(state) {
      return state.selectedItem?.label || null
    },
    selectedItemId(state) {
      if (!this.selectedItemType) return ''
      if (this.selectedItemType === Category.TABLE)
        return state.selectedItem?.values?.table?.id || null
      if (this.selectedItemType === Category.VIEW)
        return state.selectedItem?.values?.view?.id || null
      if (this.selectedItemType === Category.DASHBOARD)
        return state.selectedItem?.values?.dashboard?.id || null
      if (this.selectedItemType === Category.REPORT)
        return state.selectedItem?.values?.report?.id || null
      if (this.selectedItemType === Category.DATASET)
        return state.selectedItem?.values?.dataset?.id || null
    },
    selectedItemName(state) {
      if (!this.selectedItemType) return ''
      if (this.selectedItemType === Category.TABLE)
        return state.selectedItem?.values?.table?.name || ''
      if (this.selectedItemType === Category.VIEW)
        return state.selectedItem?.values?.view?.name || ''
    },
    columns(state) {
      if (
        !state.selectedItem ||
        !state.selectedItem.values ||
        !state.selectedItem.values.columns
      )
        return []
      return state.selectedItem.values.columns
    },
    location(state) {
      if (
        !state.selectedItem ||
        !state.selectedItem.values ||
        !state.selectedItem.values.location
      )
        return []
      return state.selectedItem.values.location
    },
    owner(state) {
      if (
        !state.selectedItem ||
        !state.selectedItem.values ||
        !state.selectedItem.values.owner
      )
        return []
      return state.selectedItem.values.owner
    },
    tags(state) {
      if (
        !state.selectedItem ||
        !state.selectedItem.values ||
        !state.selectedItem.values.tags
      )
        return []
      return state.selectedItem.values.tags
    },
    table(state) {
      if (
        !state.selectedItem ||
        !state.selectedItem.values ||
        !state.selectedItem.values.table
      )
        return []
      return state.selectedItem.values.table
    },
    view(state) {
      if (
        !state.selectedItem ||
        !state.selectedItem.values ||
        !state.selectedItem.values.view
      )
        return []
      return state.selectedItem.values.view
    },
    schema(state) {
      if (
        !state.selectedItem ||
        !state.selectedItem.values ||
        !state.selectedItem.values.schema
      )
        return []
      return state.selectedItem.values.schema
    },
    showItemsLength(state) {
      return state.showItems?.length
    },
    list(state) {
      if (!state.resultList || state.resultList.length === 0) return []
      return state.resultList
    },
    pipelines(state) {
      if (
        !state.pipelineList.pipelines ||
        state.pipelineList.pipelines.length === 0
      ) {
        return []
      }
      return state.pipelineList
    },
    lineage(state) {
      if (!state.lineageData || state.lineageData.length === 0) return []
      return state.lineageData
    },
    limit(state) {
      return state.isSrchLimit
    },
  },
  actions: {
    async fetchUsers() {
      const catalogs = await $axios.$get('/catalogs')
      this.catalogs = catalogs
    },
    addShowItems(item: any) {
      if (!this.showItems) return
      if (
        this.showItems.some(
          (_item: any) => _item.label === item.label && _item.id === item.id
        )
      )
        return
      // itemとtab(詳細情報: 0, リネージ: 1)情報を配列に追加。tabの初期値は0で決め打ち。
      this.showItems.push({ ...item, tab: 0 })
    },
    async fetchSearch(url: any) {
      const resp = await $axios.$get(url)
      if (resp.data?.hasOwnProperty('values')) {
        this.isSrchLimit = false
        this.resultList = resp.data.values
        this.isSearched = true
      } else {
        // 検索結果が上限値超えたら、valuesプロパティを返却しない
        this.isSrchLimit = true
        this.resultList = []
        this.isSearched = true
      }
    },
    async setSelectedItem(item: any) {
      this.selectedItem = item
    },
    async fetchTableDetail(id: number) {
      const detail = await $axios.$get(`/tables/${id}`)
      if (detail?.data) {
        console.log(detail)
        // TODO: for data mock
        const item = detail.data
        item.label = Category.TABLE
        item.name = item.values?.table?.name || ''
        //TODO: for data mock
        item.id = id
        this.addShowItems(item)
        this.setSelectedItem(item)
      }
    },
    async fetchViewDetail(id: number) {
      const detail = await $axios.$get(`/views/${id}`)
      if (detail?.data) {
        // TODO: for data mock
        const item = detail.data
        item.label = Category.VIEW
        item.name = item.values?.view?.name || ''
        // TODO: for data mock
        item.id = id
        this.addShowItems(item)
        this.setSelectedItem(item)
      }
    },
    async fetchDashboardDetail(id: number) {
      const resp = await $axios.$get(`/dashboards/${id}`)
      if (resp?.data) {
        const item = resp?.data
        item.label = Category.DASHBOARD
        item.name = item.values?.dashboard?.dashboardName || ''
        item.id = id
        this.addShowItems(item)
        this.setSelectedItem(item)
      }
    },
    async fetchReportDetail(id: number) {
      const resp = await $axios.$get(`/reports/${id}`)
      if (resp?.data) {
        const item = resp?.data
        item.label = Category.REPORT
        item.name = item.values?.report?.reportName || ''
        item.id = id
        this.addShowItems(item)
        this.setSelectedItem(item)
      }
    },
    async fetchDatasetDetail(id: number) {
      const resp = await $axios.$get(`/datasets/${id}`)
      if (resp?.data) {
        const item = resp?.data
        item.label = Category.DATASET
        item.name = item.values?.dataset?.datasetName || ''
        item.id = id
        this.addShowItems(item)
      }
    },
    async fetchPipelines(id: number) {
      if (!id) return
      let resp = await $axios.$get(`/lineages/pipeline-list?id=${id}`)
      if (resp && resp.data) {
        let item = resp.data
        this.pipelineList = item
        item.id = id
        if (this.showPipelineList.length === 0) return
        if (this.showPipelineList.some((_item: any) => _item.id === item.id))
          return
        this.showPipelineList.push(item)
      }
    },
    async fetchLineage(value: any) {
      if (!value || !value.vertexId) return
      const resp = await $axios.$get(`/lineages?vertexId=${value.vertexId}`)
      if (resp && resp.data) {
        const item = resp.data
        item.vertexId = value.vertexId
        this.lineageData = item
      }
      return resp
    },
    async fetchTagSearch(tagId: number | null) {
      if (!tagId) return
      const resp = await $axios.$get(`/tag-search/${tagId}`)
      if (resp?.values) {
        this.tagSearchList = resp?.values
      }
    },
    async postAssignTag(requestParam: {
      tagId: number
      selectDataIds: number[]
    }) {
      if (!requestParam?.tagId || !requestParam?.selectDataIds) return
      await $axios.$post(`/tags/${requestParam.tagId}/tagging`, {
        ids: requestParam.selectDataIds,
        mode: 1,
      })
    },
    async postUnassignTag(requestParam: {
      tagId: number | null
      selectDataIds: number[]
    }) {
      if (!requestParam?.tagId || !requestParam?.selectDataIds) return
      await $axios.$post(`/tags/${requestParam.tagId}/tagging`, {
        ids: requestParam.selectDataIds,
        mode: 0,
      })
    },
    setTabId(value: number) {
      this.tabId = value
    },
    setDetailedInformation(value: boolean) {
      this.detailedInformation = value
    },
    setShowItems(value: any[]) {
      this.showItems = value
    },
    removeShowItems(itemId: number) {
      if (!this.showItems) return
      this.showItems.splice(
        this.showItems.findIndex((item: any) => item.id === itemId),
        1
      )
    },
    setResultList(value: ResultItem[]) {
      this.resultList = value
    },
    resetSearch() {
      this.isSearched = false
    },
  },
})
