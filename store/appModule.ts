import { defineStore } from 'pinia'
import { store as vuexStore } from '@/store'
import { $axios } from '~/utils/api'

interface AppState {
  initialLoading: boolean
  loading: boolean // ローディング状態 => true:ローディングがかかっている, false:ローディングがかかっていない
  userId: number | null
  isLogin: boolean // ログイン状態(認証が通ったか) => true:ログイン済み, false:未ログイン
  isTagAssignAuthority: boolean // タグ付与(解除)権限 => true:権限あり, false:権限なし
  isClipDrawerOpen: boolean
}

export const useAppStore = defineStore('app', {
  state: () =>
    ({
      initialLoading: true,
      loading: false,
      userId: null,
      isLogin: false,
      isTagAssignAuthority: false,
      isClipDrawerOpen: false,
    } as AppState),
  actions: {
    enableLoading() {
      this.loading = true
    },
    async disableLoading(forceDisable?: boolean) {
      // 強制的にローディング解除したい場合は forceDisable: true; でこちらを通る
      if (forceDisable) {
        this.loading = false
        return
      }

      if (process.env.NODE_ENV === 'development') {
        this.loading = false
        return
      }

      console.log('isLogin', this.isLogin)
      // ネットワークの状況によって、ログイン判定がtrueになるまで時間がかかる場合を考慮して、
      // 10秒間、ローディング解除までの猶予を設けている
      for (let i = 0; i < 20; i++) {
        if (this.isLogin) {
          this.loading = false
          return
        }
        // 0.5秒待ってから次のループ処理が走るようにする
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    },
    enableInitialLoading() {
      this.initialLoading = true
    },
    async disableInitialLoading() {
      this.initialLoading = false
    },
    async loginAuthentication(mailAddress: string) {
      const resp = await $axios.$post('/auth', { mailAddress })
      if (resp?.data) {
        this.userId = resp?.data?.id
        this.isLogin = resp?.data?.isLogin
        this.isTagAssignAuthority = resp?.data?.isTagAssignAuthority
      }
    },
    logoutAction() {
      this.isLogin = false
    },
    toggleClipDrawer(isOpen: boolean) {
      this.isClipDrawerOpen = isOpen
    },
    setLogin(value: boolean) {
      this.isLogin = value
    },
    setInitialLoading(value: boolean) {
      this.initialLoading = value
    },
  },
})
