<template lang="pug">
  .before-search
    .center-vertical.my-4
      img(:src='imgSrc')
      p.my-1
        | {{ mainText }}
      p
        | {{ secondaryText }}
</template>

<script>
import { defineComponent, nextTick, ref, watch } from '@nuxtjs/composition-api'
const types = {
  //   ERROR: 'error',
  INDEX: 'index',
  //   SEARCH: 'search',
  TAG: 'tag'
}
export default defineComponent({
  props: {
    type: { type: String, default: 'index' },
    mainText: {
      type: String,
      default: '左のメニューからカテゴリを選択することで'
    },
    secondaryText: {
      type: String,
      default: 'データオブジェクトの一覧を確認することができます'
    }
    // color: { type: String, default: '#555' },
    // height: { type: String, default: '100vh' }
  },
  setup(props) {
    const imgSrc = ref('')
    const defineType = (type) => {
      switch (type) {
        case types.INDEX:
          imgSrc.value = require('icon/book-open-solid.svg')
          break
        case types.TAG:
          imgSrc.value = require('icon/tag_gray.svg')
          break
        default:
          imgSrc.value = require('icon/book-open-solid.svg')
          break
      }
    }
    defineType(props.type)
    nextTick(() => {
      watch(
        () => props.type,
        (val) => {
          defineType(val)
        }
      )
    })
    return {
      imgSrc
    }
  }
})
</script>
<style lang="stylus" scoped>
.before-search
  height 100%
  display flex
  align-items center
  justify-content center
  position relative
  .center-vertical
    width 100%
    text-align center
    p
      font normal normal bold 16px/27px Hiragino Sans
      text-align center
</style>
