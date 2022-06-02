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

export type SearchState = {
  _systems: any[] | null
  _locations: any | null
  _owners: any[] | null
  _tags: any[] | null
  inputWords: string[]
  systemOverView: any[] | null
}

@Module({
  name: 'searches',
  stateFactory: true,
  namespaced: true,
  dynamic: true,
  store
})
class Search extends VuexModule implements SearchState {
  _systems: any[] | null = null // nullの場合はAPI未実行。空配列の場合はAPI実行済みだがデータなし。
  _locations: any | null = null // nullの場合はAPI未実行。空オブジェクトの場合はAPI実行済みだがデータなし。
  _owners: any[] | null = null // nullの場合はAPI未実行。空配列の場合はAPI実行済みだがデータなし。
  _tags: any[] | null = null // nullの場合はAPI未実行。空配列の場合はAPI実行済みだがデータなし。
  inputWords: string[] = []
  systemOverView: any[] | null = null // nullの場合はAPI未実行。空配列の場合はAPI実行済みだがデータなし。

  @Mutation
  private SET_SYSTEMS(items: any) {
    this._systems = items
  }
  @Mutation
  private SET_LOCATIONS(items: any) {
    this._locations = items
  }
  @Mutation
  private SET_OWNERS(items: any) {
    this._owners = items
  }
  @Mutation
  private SET_TAGS(items: any) {
    this._tags = items
  }
  @Mutation
  private SET_INPUT_WORDS(word: string) {
    if (!word || !word.trim()) {
      return
    }
    if (this.inputWords.includes(word)) {
      return
    }
    if (this.inputWords?.length >= 5) {
      this.inputWords?.pop()
    }
    this.inputWords?.unshift(word)
  }
  @Mutation
  private SET_SYSTEM_OVERVIEW(items: any) {
    this.systemOverView = items
  }

  // システム取得API実行メソッド
  @Action
  public async fetchSystems() {
    const resp = await $axios.$get('/systems')
    if (Object.keys(resp?.data?.values)?.length === 0) this.SET_SYSTEMS([])
    else this.SET_SYSTEMS(resp?.data?.values)
  }
  // ロケーション取得API実行メソッド
  @Action
  public async fetchLocations() {
    const resp = await $axios.$get('/locations')
    if (Object.keys(resp?.data)?.length === 0) this.SET_LOCATIONS({})
    else this.SET_LOCATIONS(resp?.data)
  }
  // オーナー取得API実行メソッド
  @Action
  public async fetchOwners() {
    const resp = await $axios.$get('/owners')
    if (Object.keys(resp?.data?.values)?.length === 0) this.SET_OWNERS([])
    else this.SET_OWNERS(resp?.data?.values)
  }
  // タグ取得API実行メソッド
  @Action
  public async fetchTags() {
    const resp = await $axios.$get('/tags')
    if (Object.keys(resp?.data?.values)?.length === 0) this.SET_TAGS([])
    else this.SET_TAGS(resp?.data?.values)
  }
  // システムオーバービュー取得API実行メソッド
  @Action
  public async fetchSystemOverview() {
    const resp = await $axios.$get('/system-overview')
    if (Object.keys(resp?.systems)?.length === 0) this.SET_SYSTEM_OVERVIEW([])
    else this.SET_SYSTEM_OVERVIEW(resp?.systems)
  }
}

export default getModule(Search)
*/
