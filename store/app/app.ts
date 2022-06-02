/*
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import { store } from '~/store'
import { $axios } from '~/utils/api'

@Module({
  name: 'app',
  stateFactory: true,
  namespaced: true,
  dynamic: true,
  store
})
class App extends VuexModule {
  initialLoading: boolean = true
  loading: boolean = false // ローディング状態 => true:ローディングがかかっている, false:ローディングがかかっていない
  userId: number | null = null
  isLogin: boolean = false // ログイン状態(認証が通ったか) => true:ログイン済み, false:未ログイン
  isTagAssignAuthority: boolean = false // タグ付与(解除)権限 => true:権限あり, false:権限なし
  isClipDrawerOpen: boolean = false

  @Mutation
  SET_LOADING(value: boolean) {
    this.loading = value
  }
  @Mutation
  SET_INITIAL_LOADING(value: boolean) {
    this.initialLoading = value
  }
  @Mutation
  SET_USER_ID(value: number) {
    this.userId = value
  }
  @Mutation
  SET_LOGIN(value: boolean) {
    this.isLogin = value
  }
  @Mutation
  SET_TAG_ASSIGN_AUTHORITY(value: boolean) {
    this.isTagAssignAuthority = value
  }
  @Mutation
  private TOGGLE_CLIP_DRAWER(isOpen: boolean) {
    this.isClipDrawerOpen = isOpen
  }

  @Action
  enableLoading() {
    this.SET_LOADING(true)
  }
  @Action
  async disableLoading(forceDisable?: boolean) {
    // 強制的にローディング解除したい場合は forceDisable: true; でこちらを通る
    if (forceDisable) {
      this.SET_LOADING(false)
      return
    }

    if (process.env.NODE_ENV === 'development') {
      this.SET_LOADING(false)
      return
    }

    console.log('isLogin', this.isLogin)
    // ネットワークの状況によって、ログイン判定がtrueになるまで時間がかかる場合を考慮して、
    // 10秒間、ローディング解除までの猶予を設けている
    for (let i = 0; i < 20; i++) {
      if (this.isLogin) {
        this.SET_LOADING(false)
        return
      }
      // 0.5秒待ってから次のループ処理が走るようにする
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
  @Action
  enableInitialLoading() {
    this.SET_INITIAL_LOADING(true)
  }
  @Action
  async disableInitialLoading() {
    this.SET_INITIAL_LOADING(false)
  }
  @Action
  async loginAuthentication(mailAddress: string) {
    const resp = await $axios.$post('/auth', { mailAddress })
    if (resp?.data) {
      this.SET_USER_ID(resp?.data?.id)
      this.SET_LOGIN(resp?.data?.isLogin)
      this.SET_TAG_ASSIGN_AUTHORITY(resp?.data?.isTagAssignAuthority)
    }
  }
  @Action
  logoutAction() {
    this.SET_LOGIN(false)
  }
  @Action
  public toggleClipDrawer(isOpen: boolean) {
    this.TOGGLE_CLIP_DRAWER(isOpen)
  }
}
export default getModule(App)
*/
