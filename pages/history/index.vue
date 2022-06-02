<template lang="pug">
div
  BaseSearch
  BaseHistory
  ResultHistory
</template>
<script>
import {
  defineComponent,
  useFetch,
  useContext,
  ref,
  onMounted,
  nextTick
} from '@nuxtjs/composition-api'
// TODO: Vuex to Pinia
// import appModule from '~/store/app/app'
import { useAppStore } from "~/store/appModule";


export default defineComponent({
  name: 'history',
  setup() {
    const appModule = useAppStore()
    onMounted(() => {
      nextTick(() => {
        appModule.disableLoading()
      })
    })
  }
})
</script>
