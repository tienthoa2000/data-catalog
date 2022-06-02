<template lang="pug">
v-container
  v-card(width="375" class="mx-auto my-12")
    v-sheet
      v-progress-linear(:active="loading" :indeterminate="loading" top color="blue accent-4")
      div(class="wrapper card-padding")
        div(class="text-right margin-right")
          span(class="no-decoration")
            nuxt-link(
              :to="switchLocalePath('ja')"
              class="no-decoration"
            ) 日本語
          hr(role="separator" aria-orientation="vertical" class="mx-2 my-auto v-divider v-divider--inset v-divider--vertical theme--light" style="height: 16px;")
          span(class="no-decoration")
            nuxt-link(
              :to="switchLocalePath('en')"
              class="no-decoration"
            ) English
        div(class="text-center card-padding title primary--text") Data Catalog
        div
          p(class="caption text-left margin-bottom-narrow") {{ $t('login.L0001') }}
          v-text-field
          p(class="caption text-left margin-bottom-narrow") {{ $t('login.L0002') }}
          v-text-field
        v-btn(
          color="primary"
          @click="$router.push(localeRoute({ name: 'index'}))"
        )
          span(class="v-btn__content") {{ $t('login.L0003') }}


</template>
<script>
import { defineComponent, computed, useContext } from '@nuxtjs/composition-api'
// compositionAPIにuseRouterがないようでまだ使用できない

export default defineComponent({
  setup() {
    const { app:{ store, router, i18n } } = useContext()
    const loader = computed(() => {
      store.dispatch('login.myAction')
      router.push(app.localeRoute({'name': 'index'}))
    })
    return { loader }
    return {}
  },
})
</script>
<style lang="stylus" scoped>
</style>
