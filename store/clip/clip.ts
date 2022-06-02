/*
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { Label } from '@/types/base'
import { uniqueIdAssign } from '~/functions/clip/uniqueIdAssign'

export type Clip = {
  uniqueId?: string
  id: number
  name: string
  type: 'data'
  label: Label
  logicalName: string
  location: string
  wsOrDbScm: string
  clipDesc: string | null
}
export type ClipFolder = {
  uniqueId: string | undefined
  name: string
  type: 'folder'
  children: (ClipFolder | Clip)[]
}
export type ClipModel = {
  ownClip: (ClipFolder | Clip)[] | null
}
export type ClipState = {
  clipModel: ClipModel | null
}
export type UpdateClipData = {
  userId: number
  clipInfo: (ClipFolder | Clip)[]
}

@Module({
  name: 'clips',
  stateFactory: true,
  namespaced: true
})
export class ClipModule extends VuexModule implements ClipState {
  clipModel: ClipModel | null = null

  // ユニークIDを付与したクリップ情報を返却する
  get ownClipWithUniqueId() {
    if (!this.clipModel?.ownClip) return null
    const copyOwnClip: (ClipFolder | Clip)[] = JSON.parse(
      JSON.stringify(this.clipModel?.ownClip)
    ) // ネストされたオブジェクトのため、JSON文字列に変更後に再度オブジェクトに戻すことで、コピーする
    return uniqueIdAssign(copyOwnClip, '')
  }

  @Mutation
  SET_CLIP_MODEL(model: ClipModel) {
    this.clipModel = model
  }

  @Action
  async fetchClips() {
    const resp = await $axios.$post('/clips', {
      userId: this.context?.rootState?.app?.userId ?? null // ローカル環境で動作確認したい時は、一時的にnullの部分をユーザーID(number)に変える
    })
    this.SET_CLIP_MODEL(resp.data)
  }
  @Action
  async updateClips(data?: (ClipFolder | Clip)[]) {
    await $axios.$put('/clips', {
      clipInfo: data,
      userId: this.context?.rootState?.app?.userId ?? null
    }) // ローカル環境で動作確認したい時は、一時的にnullの部分をユーザーID(number)に変える
    await this.fetchClips()
  }
}
*/
