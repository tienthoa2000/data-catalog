<template lang="pug">
div
  CommonError(height='calc(100vh - 220px)' errType='search' mainErrText='ここに検索結果が表示されます' secondaryErrText='キーワードか検索条件を一つ以上設定して検索してください')
</template>
<script>
import {
  defineComponent,
  useFetch,
  useContext,
  ref
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>
<style lang="stylus" scoped></style>
