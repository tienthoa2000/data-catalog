<template lang="pug">
  div(class="text-center ma-2 custom-snackbar")
    v-snackbar(v-model="open" :color="color" top :timeout="10000") {{ message }}
      template(v-slot:action="{ attrs }")
        v-btn(text v-bind="attrs" @click="open = false" class="pl-0 pr-0")
          v-icon(aria-label="range" role="img" aria-hidden="false") {{ mdiClose }}
</template>

<script>
import {computed, defineComponent} from '@nuxtjs/composition-api'
import { mdiClose } from '@mdi/js';

export default defineComponent({
  setup(props, { emit }) {
    const onClose = () => emit('close')
    const color = computed(() => {
      switch (props.type) {
        case 'info':
          return '#43A5C4'
        case 'success':
          return '#7AC668'
        case 'warning':
          return '#E3C410'
        case 'error':
          return '#C44343'
        default:
          return '#43A5C4'
      }
    })
    return {
      props,
      onClose,
      mdiClose,
      color
    }
  },
  props: {
    type: { type: String, default: 'info' },
    value: { type: Boolean, default: false },
    message: { type: String, default: null }
  },
  computed: {
    open: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
})
</script>
<style lang="stylus" scoped>
.custom-snackbar
  >>>.v-snack__action
    margin-right 0
    .v-btn
      height 48px
</style>

