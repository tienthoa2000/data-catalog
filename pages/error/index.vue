<template>
  <ErrorLoginError v-if="errorType === 'login'" />
  <ErrorSystemError v-else />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  nextTick,
  useRoute
} from '@nuxtjs/composition-api'

// TODO: Vuex to Pinia
// import appModule from '~/store/app/app'
import { useAppStore } from "~/store/appModule";

export default defineComponent({
  name: 'error',
  layout: 'errorLayout',
  setup() {
    const appModule = useAppStore()
    const route = useRoute()
    const errorType = route?.value?.query?.errorType
    onMounted(() => {
      nextTick(() => {
        appModule.disableLoading(true)

      })
    })
    
    return {
      errorType
    }
  }
})
</script>
