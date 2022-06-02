import { defineStore } from 'pinia'
import { store as vuexStore } from '@/store'
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

export const useIndexStore = defineStore('index', {
  state: () =>
    ({
      indexList: [],
      dataFlow: '',
      initialSelectionLocation: {
        systemType: null,
        locationType: null,
        locationId: null,
      },
    } as IndexState),
  actions: {
    async fetchIndexSearch(object: IndexSearchArgument) {
      const { id, label } = object
      const resp = await $axios.$get(`/index-search/${id}?label=${label}`)
      const item = resp?.data?.values?.map((e: RespIndexData) => ({
        id: e.id,
        label: e.label,
        name: e.name,
        logicalName: e.logicalName,
        description: e.description,
        selected: false,
      }))
      if (!item) return
      this.indexList = item
    },
    setInitialSelectionLocation(value: SelectionLocation) {
      this.initialSelectionLocation = value
    },
    setDataFlow(value: string) {
      this.dataFlow = value
    },
  },
})
