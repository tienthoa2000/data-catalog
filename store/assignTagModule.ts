import { defineStore } from 'pinia'
import { store as vuexStore } from '@/store'
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

export const useAssignTagsStore = defineStore('assignTags', {
  state: () =>
    ({
      tagSearchList: [],
    } as TagState),
  actions: {
    async fetchTagSearch(tagId: number) {
      const resp = await $axios.$get(
        `http://127.0.0.1:4010/api/v1/tag-search/${tagId}`
      )
      // const resp = await $axios.$get(`/tag-search/${tagId}`)
      if (resp?.values) {
        this.tagSearchList = resp?.values
      }
    },
  },
})
