import { defineStore } from 'pinia'
import { store as vuexStore } from '@/store'
import { $axios } from '~/utils/api'

export type SearchState = {
  _systems: any[] | null
  _locations: any | null
  _owners: any[] | null
  _tags: any[] | null
  inputWords: string[]
  systemOverView: any[] | null
}

export const useSearchStore = defineStore('searches', {
  state: () =>
    ({
      _systems: [],
      _locations: [],
      _owners: [],
      _tags: [],
      inputWords: [],
      systemOverView: [],
    } as SearchState),
  actions: {
    async fetchSystems() {
      const resp = await $axios.$get('/systems')
      if (Object.keys(resp?.data?.values)?.length === 0) this._systems = []
      else this._systems = resp?.data?.values
    },
    async fetchLocations() {
      const resp = await $axios.$get('/locations')
      if (Object.keys(resp?.data)?.length === 0) this._locations = {}
      else this._locations = resp?.data
    },
    async fetchOwners() {
      const resp = await $axios.$get('/owners')
      if (Object.keys(resp?.data?.values)?.length === 0) this._owners = []
      else this._owners = resp?.data?.values
    },
    async fetchTags() {
      const resp = await $axios.$get('/tags')
      if (Object.keys(resp?.data?.values)?.length === 0) this._tags = []
      else this._tags = resp?.data?.values
    },
    async fetchSystemOverview() {
      const resp = await $axios.$get('/system-overview')
      if (Object.keys(resp?.systems)?.length === 0) this.systemOverView = []
      else this.systemOverView = resp?.systems
    },
    setInputWords(payload: string[]) {
      this.inputWords = payload
    },
  },
})
