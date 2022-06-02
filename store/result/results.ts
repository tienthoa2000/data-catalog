/*
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import { Catalog } from '~/store/types'
import { store } from '~/store'
import { $axios } from '~/utils/api'
import { Category } from '~/constants/Category'
import { Label } from '@/types/base'

type Tag = {
  id: number
  name: string
}

export type SelectedItem = {
  id: number
  label: Label
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
  label: Label
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
  label: Label
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
  tagSearchList: TagSearchData[]
}

@Module({
  name: 'results',
  stateFactory: true,
  namespaced: true,
  dynamic: true,
  store
})
export class Result extends VuexModule implements ResultState {
  catalogs: Catalog[] = []
  resultList: any = []
  selectedItem: any = {}
  tabId: number = 0
  lineageData: any = {}
  pipelineList: any = {}
  showItems: any[] = []
  showPipelineList: any[] = []
  isSearched: boolean = false
  isSrchLimit: boolean = false
  tagSearchList: TagSearchData[] = []

  get selectedItemType() {
    return this.selectedItem?.label || null
  }
  get selectedItemId() {
    if (!this.selectedItemType) return ''
    if (this.selectedItemType === Category.TABLE)
      return this.selectedItem?.values?.table?.id || null
    if (this.selectedItemType === Category.VIEW)
      return this.selectedItem?.values?.view?.id || null
    if (this.selectedItemType === Category.DASHBOARD)
      return this.selectedItem?.values?.dashboard?.id || null
    if (this.selectedItemType === Category.REPORT)
      return this.selectedItem?.values?.report?.id || null
    if (this.selectedItemType === Category.DATASET)
      return this.selectedItem?.values?.dataset?.id || null
  }
  get selectedItemName() {
    if (!this.selectedItemType) return ''
    if (this.selectedItemType === Category.TABLE)
      return this.selectedItem?.values?.table?.name || ''
    if (this.selectedItemType === Category.VIEW)
      return this.selectedItem?.values?.view?.name || ''
  }
  get columns() {
    if (
      !this.selectedItem ||
      !this.selectedItem.values ||
      !this.selectedItem.values.columns
    )
      return []
    return this.selectedItem.values.columns
  }
  get location() {
    if (
      !this.selectedItem ||
      !this.selectedItem.values ||
      !this.selectedItem.values.location
    )
      return {}
    return this.selectedItem.values.location
  }
  get owner() {
    if (
      !this.selectedItem ||
      !this.selectedItem.values ||
      !this.selectedItem.values.owner
    )
      return {}
    return this.selectedItem.values.owner
  }
  get tags() {
    if (
      !this.selectedItem ||
      !this.selectedItem.values ||
      !this.selectedItem.values.tags
    )
      return []
    return this.selectedItem.values.tags
  }
  get table() {
    if (
      !this.selectedItem ||
      !this.selectedItem.values ||
      !this.selectedItem.values.table
    )
      return {}
    return this.selectedItem.values.table
  }
  get view() {
    if (
      !this.selectedItem ||
      !this.selectedItem.values ||
      !this.selectedItem.values.view
    )
      return {}
    return this.selectedItem.values.view
  }
  get schema() {
    if (
      !this.selectedItem ||
      !this.selectedItem.values ||
      !this.selectedItem.values.schema
    )
      return {}
    return this.selectedItem.values.schema
  }
  get showItemsLength() {
    return this.showItems?.length
  }
  get list() {
    if (!this.resultList || this.resultList.length === 0) return []
    return this.resultList
  }
  get pipelines() {
    if (
      !this.pipelineList.pipelines ||
      this.pipelineList.pipelines.length === 0
    ) {
      return []
    }
    return this.pipelineList
  }
  get lineage() {
    if (!this.lineageData || this.lineageData.length === 0) return []
    return this.lineageData
  }
  get limit() {
    return this.isSrchLimit
  }

  @Mutation
  SET_CATALOGS(catalogs: Catalog[]) {
    this.catalogs = catalogs
  }
  @Mutation
  private SET_RESULT_LIST(value: any) {
    this.resultList = value
  }
  @Mutation
  SET_SELECTED_ITEM(item: any) {
    this.selectedItem = item
  }
  @Mutation
  SET_TABID(tabId: number) {
    this.tabId = tabId
  }
  @Mutation
  private SET_PIPELINES(data: any) {
    this.pipelineList = data
  }
  @Mutation
  private SET_LINEAGE(data: any) {
    this.lineageData = data
  }
  @Mutation
  ADD_SHOW_ITEMS(item: any) {
    if (!this.showItems) return
    if (
      this.showItems.some(
        (_item: any) => _item.label === item.label && _item.id === item.id
      )
    )
      return
    // itemとtab(詳細情報: 0, リネージ: 1)情報を配列に追加。tabの初期値は0で決め打ち。
    this.showItems.push({ ...item, tab: 0 })
  }
  @Mutation
  REMOVE_SHOW_ITEMS(itemId: number) {
    if (!this.showItems) return
    this.showItems.splice(
      this.showItems.findIndex((item: any) => item.id === itemId),
      1
    )
  }
  @Mutation
  CLEAR_SHOW_ITEMS() {
    if (!this.showItems) return
    this.showItems = []
  }
  @Mutation
  ADD_SHOW_PIPELINE_LIST(item: any) {
    if (this.showPipelineList.length === 0) return
    if (this.showPipelineList.some((_item: any) => _item.id === item.id)) return
    this.showPipelineList.push(item)
  }
  @Mutation
  REMOVE_SHOW_PIPELINE_LIST(itemId: number) {
    if (this.showPipelineList.length === 0) return
    this.showPipelineList.splice(
      this.showPipelineList.findIndex((item: any) => item.id === itemId),
      1
    )
  }
  @Mutation
  CLEAR_SHOW_PIPELINE_LIST() {
    if (this.showPipelineList.length === 0) return
    this.showPipelineList = []
  }
  @Mutation
  MADE_SEARCH() {
    this.isSearched = true
  }
  @Mutation
  RESET_SEARCH() {
    this.isSearched = false
  }
  @Mutation
  SRCH_LIMIT(bool: boolean) {
    this.isSrchLimit = bool
  }
  @Mutation
  private SET_TAG_SEARCH_LIST(items: TagSearchData[]) {
    this.tagSearchList = items
  }

  @Action
  public async fetchUsers() {
    const catalogs = await $axios.$get('/catalogs')
    this.SET_CATALOGS(catalogs)
  }
  @Action
  async fetchSearch(url: any) {
    const resp = await $axios.$get(url)
    if (resp.data?.hasOwnProperty('values')) {
      this.SRCH_LIMIT(false)
      this.SET_RESULT_LIST(resp.data.values)
      this.MADE_SEARCH()
    } else {
      // 検索結果が上限値超えたら、valuesプロパティを返却しない
      this.SRCH_LIMIT(true)
      this.SET_RESULT_LIST([])
      this.MADE_SEARCH()
    }
  }
  @Action
  async fetchTableDetail(id: number) {
    const detail = await $axios.$get(`/tables/${id}`)
    if (detail?.data) {
      // TODO: for data mock
      const item = detail.data
      item.label = Category.TABLE
      item.name = item.values?.table?.name || ''
      //TODO: for data mock
      item.id = id
      this.ADD_SHOW_ITEMS(item)
      this.setSelectedItem(item)
      // return item
    }
    // return null
  }
  @Action
  async fetchViewDetail(id: number) {
    const detail = await $axios.$get(`/views/${id}`)
    if (detail?.data) {
      // TODO: for data mock
      const item = detail.data
      item.label = Category.VIEW
      item.name = item.values?.view?.name || ''
      // TODO: for data mock
      item.id = id
      this.ADD_SHOW_ITEMS(item)
      this.setSelectedItem(item)
      // return item
    }
    // return null
  }
  @Action
  async fetchDashboardDetail(id: number) {
    const resp = await $axios.$get(`/dashboards/${id}`)
    if (resp?.data) {
      const item = resp?.data
      item.label = Category.DASHBOARD
      item.name = item.values?.dashboard?.dashboardName || ''
      item.id = id
      this.ADD_SHOW_ITEMS(item)
      this.setSelectedItem(item)
      // return item
    }
    // return null
  }
  @Action
  async fetchReportDetail(id: number) {
    const resp = await $axios.$get(`/reports/${id}`)
    if (resp?.data) {
      const item = resp?.data
      item.label = Category.REPORT
      item.name = item.values?.report?.reportName || ''
      item.id = id
      this.ADD_SHOW_ITEMS(item)
      this.setSelectedItem(item)
      // return item
    }

    // return null
  }
  @Action
  async fetchDatasetDetail(id: number) {
    const resp = await $axios.$get(`/datasets/${id}`)
    if (resp?.data) {
      const item = resp?.data
      item.label = Category.DATASET
      item.name = item.values?.dataset?.datasetName || ''
      item.id = id
      this.ADD_SHOW_ITEMS(item)
      // return item
    }

    // return null
  }
  @Action
  public async fetchPipelines(id: number) {
    if (!id) return
    let resp = await $axios.$get(`/lineages/pipeline-list?id=${id}`)
    if (resp && resp.data) {
      let item = resp.data
      this.SET_PIPELINES(item)
      item.id = id
      this.ADD_SHOW_PIPELINE_LIST(item)
    }
  }
  @Action
  public async fetchLineage(value: any) {
    if (!value || !value.vertexId) return
    const resp = await $axios.$get(`/lineages?vertexId=${value.vertexId}`)
    if (resp && resp.data) {
      const item = resp.data
      item.vertexId = value.vertexId
      this.SET_LINEAGE(item)
    }
    return resp
  }
  @Action
  public async setSelectedItem(item: any) {
    this.SET_SELECTED_ITEM(item)
  }
  // タグ検索API実行メソッド
  @Action
  async fetchTagSearch(tagId: number) {
    const resp = await $axios.$get(`/tag-search/${tagId}`)
    if (resp?.values) {
      this.SET_TAG_SEARCH_LIST(resp?.values)
    }
  }
  // タグ付与API実行メソッド
  @Action
  async postAssignTag(requestParam: {
    tagId: number
    selectDataIds: number[]
  }) {
    if (!requestParam?.tagId || !requestParam?.selectDataIds) return
    await $axios.$post(`/tags/${requestParam.tagId}/tagging`, {
      ids: requestParam.selectDataIds,
      mode: 1
    })
  }
  // タグ解除API実行メソッド
  @Action
  async postUnassignTag(requestParam: {
    tagId: number
    selectDataIds: number[]
  }) {
    if (!requestParam?.tagId || !requestParam?.selectDataIds) return
    await $axios.$post(`/tags/${requestParam.tagId}/tagging`, {
      ids: requestParam.selectDataIds,
      mode: 0
    })
  }
}

export default getModule(Result)
*/
