<template lang="pug">
  div(v-show="loading")
    .loading-wrapper(:style="`background: rgba(255,255,255, ${opacity || 0.8})`")
      //- div.loading
      //-   v-progress-circular(indeterminate='', :color='color', :size='size', :width='width')
      div.loading(:style="`width:${width}`")
        img(:src="require('@/assets/icons/logo2.svg')")
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {}
  },
  props: {
    loading: { type: Boolean, default: false },
    color: { type: String, default: 'primary' },
    size: { type: String, default: '60' },
    // width: { type: String, default: '5' },
    width: { type: String, default: '400px' },
    opacity: { type: Number, default: 0.8 }
  }
})
</script>

<style lang="stylus" scoped>
.loading-wrapper
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  z-index 999
  display flex
  align-items center
  justify-content center
  transition: all 1.5s linear;
  .loading
    z-index: 100
    position: relative;
    img
      width 100%
    &:after
      content ""
      width 100%
      height 100%
      position absolute
      top 0
      left 0
      z-index 1
      background linear-gradient(-45deg, rgba(255,255,255,.8) 33%, rgba(255,255,255,0) 33%, rgba(255,255,255,0) 66%, rgba(255,255,255,.8) 66%)
      background-size 330% 100%
      background-repeat no-repeat
      animation scan 3s infinite linear
      -webkit-animation scan 3s infinite linear
      -moz-animation scan 3s infinite linear
      animation-direction reverse
@-webkit-keyframes scan {
  100% { background-position: 100% center; }
}
</style>
