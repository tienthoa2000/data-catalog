<template lang="pug">
  v-app
    //- BaseInitialLoading(:loading='initialLoading' :opacity="1")
    //- BaseLoadingCircle(:loading='!initialLoading && loading')
    BaseMenu
    ClipDrawer
    v-main(app)
      v-container(fluid class="align-start no-padding-top pa-0")
        div.content
          nuxt
</template>
<script>
import {
  defineComponent,
  useRoute,
  watch,
  computed,
  onBeforeMount
} from '@nuxtjs/composition-api'
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// let appModule = createNamespacedHelpers('app')
import jwt_decode from 'jwt-decode'
import {useAppStore} from "~/store/appModule";

export default defineComponent({
  name: 'default',
  setup(_, context) {
    const appModule = useAppStore()
    // TODO: Vuex to Pinia
    // const { loading, isLogin, initialLoading } = appModule.useState([
    //   'loading',
    //   'isLogin',
    //   'initialLoading'
    // ])
    // const { SET_LOGIN, SET_INITIAL_LOADING } = appModule.useMutations([
    //   'SET_LOGIN',
    //   'SET_INITIAL_LOADING'
    // ])
    // const { loginAuthentication } = appModule.useActions([
    //   'loginAuthentication'
    // // ])
    const loading = computed(() => appModule.loading)
    const isLogin = computed(() => appModule.isLogin)
    const initialLoading = computed(() => appModule.initialLoading)
    const { setLogin, setInitialLoading, loginAuthentication } = appModule
    const route = useRoute()

    const urlPath = computed(() => {
      return route.value.path
    })
    const query = computed(() => {
      return route.value.query
    })
    // ログインチェック（tokenの有無）を行い、未ログインであれば、ログイン実行
    const loginCheck = async () => {
      // console.log(
      //   'token有無',
      //   !!context.root.context.$auth.$storage.getLocalStorage('_token.aad')
      // )
      if (
        !context.root.context.$auth.$storage.getLocalStorage('_token.aad') &&
        urlPath.value !== '/auth' &&
        !query.value?.code
      ) {
        await setLogin(false)
        context.root.$auth.loginWith('aad') // Microsoft側のログイン実行
      }
    }
    // token内のメールアドレスを用い、ログイン認証API実行
    const authentication = async () => {
      if (context.root.context.$auth.$storage.getLocalStorage('_token.aad')) {
        const decodedBearer = await jwt_decode(
          context.root.context.$auth.$storage.getLocalStorage('_token.aad')
        )
        // console.log('トークンから取得したメアド', decodedBearer?.unique_name)
        await loginAuthentication(decodedBearer?.unique_name)
      }
    }
    // routerによるページ切り替え時に発火（URL直接アクセス時・リロード時には発火しない）
    watch(urlPath, async () => {
      // ローカル環境の場合はログイン処理を省略
      if (process.env.NODE_ENV === 'development') {
        setLogin(true)
        setInitialLoading(true)
        return
      }
      await loginCheck()
      if (!isLogin.value) await authentication()
    })
    // URL直接アクセス時・リロード時に発火（routerによるページ切り替え時には発火しない）
    onBeforeMount(async () => {
      // ローカル環境の場合はログイン処理を省略
      if (process.env.NODE_ENV === 'development') {
        setLogin(true)
        setInitialLoading(true)
        return
      }
      await loginCheck()
      if (!isLogin.value) await authentication()
    })
    return {
      loading,
      initialLoading
    }
  }
})
</script>
<style lang="stylus" scoped>
.v-application
  font-family 'Yu Gothic UI','Yu Gothic', 'Hiragino Kaku Gothic Pro', 'Hiragino Kaku Gothic ProN', Arial
/* Font Family */
/* Yu Gothic UI -> YuGothR.ttc */
/* Yu Gothic -> YuGothM.ttc YuGothL.ttc YuGothB.ttc */
/* Hiragino Kaku Gothic Pro -> ヒラギノ角ゴシック W6.ttc*/
/* Hiragino Kaku Gothic ProN ->  ヒラギノ角ゴシック W3.ttc */
.no-padding-top
  padding-top 0px
.container
  height 100vh
.content
  height 100%
.loading-page
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  background rgba(255,255,255,0.8)
  z-index 999
  .progress-linear
    width 100%
    min-width 300px
    color #43a5c4
</style>
