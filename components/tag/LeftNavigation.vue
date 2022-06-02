<template lang="pug">
  div(v-if="drawer").left-pain
    div(v-show="true" style="height: calc(100vh - 110px); overflow-y: auto; overflow-x: hidden;")
      div(class="drawer-tag search" style="padding-right: 4px")
        img(:src="require('@/assets/icons/result_search.svg')" class="search-icon" width="18px")
        div.w-100(class="input-box")
          input(v-model="filterWord" class="mr-1" placeholder="タグ名")
      template(v-for="(tag) in showTags")
        div.pb-2.pl-4.w-100
          v-chip(@click='onClickTag(tag)' color="#CFEAC7" text-color="#41434E" style='font-size: 12px; line-height: 16px') {{tag.name}}
</template>
<script lang="ts">
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'
import { useResultStore } from "~/store/resultModule";
import { useSearchStore } from "~/store/searchModule";
// TODO: Vuex to Pinia
// import _tagModule, { TagState } from '~/store/assignTag/assignTags'
// let tagModule = createNamespacedHelpers<TagState>('assignTags')
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// import _searchModule, { SearchState } from '~/store/search/searches'
// let searchModule = createNamespacedHelpers<SearchState>('searches')
// import _resultModule, { ResultState, ResultItem } from '~/store/result/results'
// let resultModule = createNamespacedHelpers<ResultState>('results')

export default defineComponent({
  props: {
    drawer: { type: Boolean, default: true }
  },
  setup(_, { emit }) {
    const filterWord = ref('')
    const resultModule = useResultStore()
    const searchModule = useSearchStore()
    // TODO: Vuex to Pinia
    // const { _tags } = searchModule.useState(['_tags'])
    // const { fetchTags } = searchModule.useActions(['fetchTags'])
    // // const { fetchTagSearch } = tagModule.useActions(['fetchTagSearch'])
    // const { fetchTagSearch } = resultModule.useActions(['fetchTagSearch'])
    const _tags = computed(() => searchModule._tags)
    const { fetchTags } = searchModule
    const { fetchTagSearch } = resultModule
    const showTags = computed(() => {
      if (!_tags.value || _tags.value?.length === 0) return _tags.value
      // フィルターキーワード未入力の場合は全てのタグ表示
      if (filterWord.value === '') return _tags.value
      // フィルターキーワードに部分一致するタグを表示
      return _tags.value?.filter(
        (e: any) => e?.name?.indexOf(filterWord.value) > -1
      )
    })
    const onClickTag = async (tag: { id: number; name: string }) => {
      await fetchTagSearch(tag.id)
      emit('onClickTag', tag)
    }
    fetchTags()
    return { filterWord, showTags, onClickTag }
  }
})
</script>
<style lang="stylus" scoped>
.left-pain
  color #41434E
  position relative
  width 180px
  height 100%
  background #fff
  overflow hidden
  box-shadow 1px 1px 2px #00000033 !important
  user-select none
.drawer-tag
  margin 8px
  display flex
  align-items center
  background #FFFFFF
  border 1px solid #EAEAEA
  border-radius 4px
  height 36px
  color #909090
  &.filter
    padding 3px 12px 3px 9px
  &.search
    padding 3px 12px
  .search-icon
    margin-right 8px
  label
    font-size 12px
  .input-box
    display flex
    align-items center
    background #FFFFFF
    width 180px
    padding 4px 4px
    height 28px
    input
      font-size 14px
      width 85%
      &:focus
        outline none
    ::placeholder
      font-weight bold
  .v-input
    margin-top 0
    padding-top 0
</style>
