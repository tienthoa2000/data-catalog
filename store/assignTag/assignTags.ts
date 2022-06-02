/*
// TODO: ここのストアが認識されないため調査必要(暫定でresults内で代用)
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import { store } from '~/store'
import { $axios } from '~/utils/api'

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

export type TagState = {
  tagSearchList: TagSearchData[]
}

@Module({
  name: 'assignTags',
  stateFactory: true,
  namespaced: true,
  dynamic: true,
  store
})
class Tag extends VuexModule implements TagState {
  tagSearchList: TagSearchData[] = []

  @Mutation
  private SET_TAG_SEARCH_LIST(items: TagSearchData[]) {
    this.tagSearchList = items
  }

  // タグ検索API実行メソッド
  @Action
  public async fetchTagSearch(tagId: number) {
    const resp = await $axios.$get(
      `http://127.0.0.1:4010/api/v1/tag-search/${tagId}`
    )
    // const resp = await $axios.$get(`/tag-search/${tagId}`)
    if (resp?.values) {
      this.SET_TAG_SEARCH_LIST(resp?.values)
    }
  }
}
export default getModule(Tag)
*/
