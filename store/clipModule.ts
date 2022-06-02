import { defineStore } from 'pinia'
import { store as vuexStore } from '@/store'
import { $axios } from '~/utils/api'
import { uniqueIdAssign } from '~/functions/clip/uniqueIdAssign'
import { useAppStore } from '~/store/appModule'
import { Label } from '~/types/base'

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
  ownClip: (ClipFolder | Clip)[]
}

export interface ClipState {
  clipModel: ClipModel | null
}

type FetchClipQuery = {
  userId: number
  verbose: number
}

type DeleteClipData = {
  userId: number
  ids: number[]
}

export type UpdateClipData = {
  userId: number
  clipInfo: (ClipFolder | Clip)[]
}

export const useClipStore = defineStore('clips', {
  state: () =>
    ({
      clipModel: null,
    } as ClipState),
  getters: {
    ownClipWithUniqueId(state): (ClipFolder | Clip)[] {
      if (!state.clipModel?.ownClip) return []
      const copyOwnClip: (ClipFolder | Clip)[] = JSON.parse(
        JSON.stringify(state.clipModel?.ownClip)
      ) // ネストされたオブジェクトのため、JSON文字列に変更後に再度オブジェクトに戻すことで、コピーする
      return uniqueIdAssign(copyOwnClip, '')
    },
  },
  actions: {
    async fetchClips() {
      const appModule = useAppStore()
      const resp = await $axios.$post('/clips', {
        userId: appModule.userId ?? null, // ローカル環境で動作確認したい時は、一時的にnullの部分をユーザーID(number)に変える
      })
      this.clipModel = resp.data
    },
    async updateClips(data?: (ClipFolder | Clip)[]) {
      const appModule = useAppStore()
      await $axios.$put('/clips', {
        clipInfo: data,
        userId: appModule.userId ?? null,
      }) // ローカル環境で動作確認したい時は、一時的にnullの部分をユーザーID(number)に変える
      await this.fetchClips()
    },
    async deleteFolders(data: DeleteClipData) {
      return await $axios.$delete('/clips', { data: data })
    },
    async deleteClips(data: DeleteClipData) {
      return await $axios.$delete('/clips', { data: data })
    },
  },
})
