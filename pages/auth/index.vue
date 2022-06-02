<template>
  <div />
</template>

<script>
import { defineComponent, onMounted, nextTick } from '@nuxtjs/composition-api'
// TODO: Vuex to Pinia
// import appModule from '~/store/app/app'
import { useAppStore } from "~/store/appModule";
export default defineComponent({
  name: 'auth',
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
