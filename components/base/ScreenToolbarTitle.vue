<template lang="pug">
  .screen-toolbar
    .screen-title-text {{ screenTitle }}
</template>
<script>
import {
  defineComponent,
  useFetch,
  useContext,
  ref
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    screenTitle: { type: String, default: 'Page Title' }
  },
  setup() {}
})
</script>
<style lang="stylus">
.screen-toolbar
  box-shadow 1px 1px 2px #00000033 !important
  z-index 100
  background-color white
  display flex
  align-items center
  height 53px
  position fixed
  width 100%
  .screen-title-text
    padding 16px !important
    text-align left
    font normal normal bold 16px/21px Yu Gothic UI
    letter-spacing 0
    color #777777
</style>
