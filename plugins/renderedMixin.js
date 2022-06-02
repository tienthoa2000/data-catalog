import Vue from 'vue'
if (!Vue.renderedMixinFlg) {
  Vue.renderedMixinFlg = true
  Vue.mixin({
    mounted() {
      this.$nextTick(() => {
        this.$emit('rendered', true)
      })
    }
  })
}
