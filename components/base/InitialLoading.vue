<template lang="pug">
div(v-show="loading")
  .loading-wrapper(:style="`background: rgba(255,255,255, ${opacity || 0.8})`" :class="`${loadingCustom ? 'visible': 'hidden'}`")
    div.loading(:class="`${logoLoading ? 'visible': 'hidden'}`")
      img(:src="require('@/assets/icons/logo2.svg')" :width="width")
</template>

<script>
import {
  computed,
  defineComponent,
  onMounted,
  ref
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    loading: { type: Boolean, default: false },
    width: { type: String, default: '720px' },
    opacity: { type: Number, default: 0.8 }
  },
  setup(props) {
    const loadingCustom = ref(true)
    const logoLoading = ref(false)
    const wait = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds))
    }
    const loading = computed(() => {
      return props.loading
    })
    const waitLoading = async (milliseconds) => {
      await wait(milliseconds)
      if (!loading.value) {
        loadingCustom.value = false
      } else await waitLoading(1000)
    }

    onMounted(async () => {
      logoLoading.value = true
      await waitLoading(1500) // フェードインの秒数に加算する（ここの秒数からフェードイン秒数を引いたものが維持時間となる）
    })

    return { loadingCustom, logoLoading }
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
  .loading
    z-index: 100
.visible
  visibility visible
  opacity 1
  transition opacity 1s ease-in
.hidden
  visibility hidden
  opacity 0
  transition visibility 0s .5s, opacity .5s linear
</style>
