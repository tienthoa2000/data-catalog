<template lang="pug">
  .no-data-display(:style='`height: ${height}`')
    .center-vertical.my-4(style='text-align: center;')
      img(:src='imgSrc')
      p.my-1(:style='{color: color}')
        | {{ mainErrText }}
      p(:style='{color: color}')
        | {{ secondaryErrText }}
</template>

<script>
import { defineComponent, nextTick, ref, watch } from '@nuxtjs/composition-api'
const types = {
  ERROR: 'error',
  INDEX: 'index',
  SEARCH: 'search',
  TAG: 'tag'
}
export default defineComponent({
  props: {
    mainErrText: {
      type: String,
      default: 'データオブジェクトを取得できませんでした'
    },
    secondaryErrText: { type: String, default: '再度お試しください' },
    errType: { type: String, default: 'error' },
    color: { type: String, default: '#555' },
    height: { type: String, default: '100vh' }
  },
  setup(props) {
    const imgSrc = ref('')
    const defineType = (type) => {
      switch (type) {
        case types.ERROR:
          imgSrc.value = require('icon/no_data.svg')
          break
        case types.INDEX:
          imgSrc.value = require('icon/book-open-solid.svg')
          break
        case types.SEARCH:
          imgSrc.value = require('icon/icon_search.svg')
          break
        case types.TAG:
          imgSrc.value = require('icon/tag_gray.svg')
          break
        default:
          imgSrc.value = require('icon/no_data.svg')
          break
      }
    }
    defineType(props.errType)
    nextTick(() => {
      watch(
        () => props.errType,
        (val) => {
          defineType(val)
        }
      )
    })
    return {
      props,
      imgSrc
    }
  }
})
</script>
<style lang="stylus">
.no-data-display
  display flex
  align-items center
  justify-content center
  position relative
  min-height 300px
  .center-vertical
    width 100%
    p
      font normal normal bold 16px/27px Hiragino Sans
      text-align center
</style>
