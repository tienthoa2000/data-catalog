/*
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import { store } from '~/store'
import { $axios } from '~/utils/api'

type RespIndexData = {
  id: number
  name: string
  label: string
  logicalName: string
  description: string
}
type IndexData = {
  id: number
  name: string
  label: string
  logicalName: string
  description: string
  selected: boolean
}
type IndexSearchArgument = {
  id: number
  label: string
}
type SelectionLocation = {
  systemType: string | null
  locationType: string | null
  locationId: number | null
}
export type IndexState = {
  indexList: IndexData[]
  dataFlow: string
  initialSelectionLocation: SelectionLocation
}

@Module({
  name: 'index',
  stateFactory: true,
  namespaced: true,
  dynamic: true,
  store
})
class Index extends VuexModule implements IndexState {
  indexList: IndexData[] = []
  dataFlow: string = ''
  initialSelectionLocation: SelectionLocation = {
    systemType: null,
    locationType: null,
    locationId: null
  }

  @Mutation
  private SET_INDEX_LIST(items: IndexData[]) {
    this.indexList = items
  }
  @Mutation
  SET_DATA_FLOW(dataFlow: string) {
    this.dataFlow = dataFlow
  }
  // インデックス画面の左ツリー展開要素をセットするメソッド
  @Mutation
  SET_INITIAL_SELECTION_LOCATION(locationObj: SelectionLocation) {
    this.initialSelectionLocation = locationObj
  }

  // インデックス検索API実行メソッド
  @Action
  public async fetchIndexSearch(object: IndexSearchArgument) {
    const { id, label } = object
    const resp = await $axios.$get(`/index-search/${id}?label=${label}`)
    const item = resp?.data?.values?.map((e: RespIndexData) => ({
      id: e.id,
      label: e.label,
      name: e.name,
      logicalName: e.logicalName,
      description: e.description,
      selected: false
    }))
    if (!item) return
    this.SET_INDEX_LIST(item)
  }
}

export default getModule(Index)
*/
