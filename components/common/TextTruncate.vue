<template lang="pug">
  span(v-tooltip="tooltipValue" style="white-space: nowrap;overflow: hidden;") {{ valueText }}
</template>
<script>
  import { defineComponent,computed } from '@nuxtjs/composition-api'
  export default defineComponent({
    props: {
      value: {type: String, default: ''},
      maxCharNum: {type: Number, default: null},
    },
    setup(props) {
      let valueText = computed(() => {
        if (!props.value) return ''
        if (!props.maxCharNum) return props.value
        if(props.maxCharNum < props.value.length)
          return `${props.value.substring(0, props.maxCharNum)}...`
        return props.value
      })

      let tooltipValue = computed(() => {
        if (!props.value) return null
        if (!props.maxCharNum || props.maxCharNum >= props.value.length) return null
        return props.value
      })

      return { valueText, tooltipValue }
    },
  })
</script>

