<template>
  <ErrorPageNotFound />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  nextTick
} from '@nuxtjs/composition-api'
// TODO: Vuex to Pinia
// import appModule from '~/store/app/app'
import { useAppStore } from "~/store/appModule";
export default defineComponent({
  name: 'page_not_found',
  layout: 'errorLayout',
  setup() {
    const appModule = useAppStore()
    onMounted(() => {
      nextTick(() => {
        appModule.disableLoading()
        appModule.disableInitialLoading()
      })
    })
    
  }
})
</script>
