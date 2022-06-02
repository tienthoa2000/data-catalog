<template lang="pug">
  div(class="result-preview-panel" :style="`min-width: 70%; width: calc(100% - ${isExpanded ? 64 : 300}px);margin-left: ${isExpanded ? '64px' : '364px'}`")
    div(class="d-flex")
      div(class="py-0 px-0" style="width:100%")
        div(class="content")
          ResultDetail(
            :isExpanded="isExpanded"
            :showPreviewPanel="open"
            :clickItem="clickItem"
            @onChildClick="$emit('onItemClick', $event)"
            @close="onDetailClose"
            @expand="isExpanded = true"
            @collapse="isExpanded = false"
          )
</template>
<script>
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  nextTick,
  onBeforeUnmount
} from '@nuxtjs/composition-api'
export default defineComponent({
  props: {
    open: { type: Boolean, default: false },
    clickItem: { type: Boolean, default: false },
    parentClass: { type: String, default: '.result-content' } // 親コンポーネントのhtmlのclass
  },
  setup(props, { emit }) {
    let isExpanded = ref(false)
    const parentClassName = computed(() => {
      return props.parentClass
    })
    const onDetailClose = () => emit('close')
    const handleWindowClick = (e) => {
      if (!props.open) return
      // PreviewPanelコンポーネントは使い回ししているため、親のコンポーネントによって取得するHTML要素を切り替える
      let parentClass = parentClassName.value || '.result-content'
      const contentParent = document.querySelector(
        `${parentClass} .result-preview-panel .content`
      )
      if (
        contentParent &&
        e.target !== contentParent &&
        !contentParent.contains(e.target)
      ) {
        if (!hasSomeParentTheId(e.target, 't-body')) {
          onDetailClose()
        }
      }
    }
    function hasSomeParentTheId(element, idName) {
      if (element.id && element.id.trim() === idName.trim()) return true
      return (
        element.parentNode && hasSomeParentTheId(element.parentNode, idName)
      )
    }
    onMounted(() => {
      nextTick(() => {
        window.addEventListener('click', handleWindowClick, true)
      })
    })
    onBeforeUnmount(() => {
      window.removeEventListener('click', handleWindowClick, true)
    })
    return { isExpanded, onDetailClose }
  }
})
</script>
<style lang="stylus" scoped>
@import '@/assets/stylus/components/result/PreviewPanel.styl'
</style>
