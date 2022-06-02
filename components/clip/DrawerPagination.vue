<template lang="pug">
  div.clip-pagination
    div.first(@click="() => onPageChange(1)")
      v-icon(:class="{ disabled: value === 1 }") mdi-page-first
    div.prev(@click="() => onPageChange(value - 1)")
      v-icon(:class="{ disabled: value === 1 }") mdi-chevron-left
    ul.pages
      li(v-for="(item) in prevPages" :key="item" :class="`${value === item ? 'active' : ''}`" @click="() => $emit('input', item)") {{item}}
      li(v-if="isTruncatePage" class="more-page") ...
      li(v-for="(item) in nextPages" :key="item" :class="`${value === item ? 'active' : ''}`" @click="() => $emit('input', item)") {{item}}
    div.next(@click="() => onPageChange(value + 1)")
      v-icon(:class="{ disabled: value === totalPage }") mdi-chevron-right
    div.last(@click="() => onPageChange(totalPage || 1)")
      v-icon(:class="{ disabled: value === totalPage }") mdi-page-last
</template>
<script>
import {computed, defineComponent, onBeforeMount, ref, watch} from '@nuxtjs/composition-api'


export default defineComponent({
  props: {
    value: {type: Number, default: 1},
    totalPage: {type: Number, default: 1},
  },
  setup(props, {emit}) {
    const totalVisible = 5
    const prevPages = ref(Array.from({length: props.totalPage}, (_, i) => i + 1))
    const nextPages = ref([])
    const totalPage = computed(() => props.totalPage)
    const isTruncatePage = ref(props.totalPage > totalVisible)
    const calcPage = (val) => {
      isTruncatePage.value = props.totalPage > totalVisible
      if (isTruncatePage.value) {
        if(val > 3 &&  val <= props.totalPage - 2) {
          prevPages.value = [val - 2,val - 1,val]
        } else {
          prevPages.value = [1,2,3]
        }
        nextPages.value = Array.from({length: 2}, (_, i) => Math.floor(props.totalPage + i - 1))
      }
    }
    watch(totalPage, (val) => {
      calcPage(props.value)
    })
    onBeforeMount(() => {
      calcPage(props.value)
    })

    const onPageChange = (val) => {
      if(val < 1 || val > totalPage.value) return
      emit('input', val)
      calcPage(val)
    }

    return {
      prevPages,
      nextPages,
      isTruncatePage,
      onPageChange
    }
  }
})
</script>
<style lang="stylus" scoped>
.clip-pagination
  width 100%
  margin 18px 0
  display inline-flex
  justify-content center
  bottom 0

  .disabled
    color #D5D5D5

  .first, .prev, .next, .last
    cursor: pointer;

  ul.pages
    display inline-flex
    align-items center
    justify-content space-around
    padding 0

    li
      list-style-type none
      width 20px
      height 20px
      cursor pointer
      border-radius 2px
      text-align center
      font-size 13px
      margin 0 2px
      &.more-page
        width 18px
      &.active
        background #43A5C4
        color #FFFFF2
  .v-icon
    font-size 21px

</style>
