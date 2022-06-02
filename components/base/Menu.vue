<template lang="pug">
v-navigation-drawer(app fixed permanent mini-variant mini-variant-width="64px" style="padding-top:10px;z-index: 900")
  nuxt-link(v-for="(l, i) in linkList" :to="localePath(l.path)" :key="i" class="nav-list" :event="l.path === '/clip' ? '' : 'click'" @click.native="openClipDrawer(l.path), event => event.preventDefault()")
    .nav-img
      v-img(:src='l.svg' :width="l.width || ''" :height="l.height || ''" )
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { pageLink, pageLinkList } from '@/types/base'
import { useRoute } from '@nuxtjs/composition-api'
import { useAppStore } from "~/store/appModule";
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// let appModule = createNamespacedHelpers('app')

export default defineComponent({
  setup() {
    const appModule = useAppStore()
    // TODO: Vuex to Pinia
    // const { isTagAssignAuthority } = appModule.useState([
    //   'isTagAssignAuthority'
    // ])
    const isTagAssignAuthority = computed(() => appModule.isTagAssignAuthority)
    const baseLinkList: pageLinkList = [
      {
        svg: require('icon/side_home.svg'),
        path: '/',
        width: '23px',
        height: '19x'
      },
      {
        svg: require('icon/book.svg'),
        path: '/index',
        width: '22px',
        height: '19x'
      }
      // {
      //   svg: require('icon/side_clip.svg'),
      //   path: '/clip',
      //   width: '20px',
      //   height: '19x'
      // }
    ]
    const tagAssignLink: pageLink = {
      svg: require('icon/side_tag.svg'),
      path: '/tag',
      width: '20px',
      height: '19x'
    }

    // clip: {
    //   svg: require('icon/side_clip.svg'),
    //   path: '/clip',
    //   width: '20px',
    //   height: '19x'
    // },
    // condition: {
    //   svg: require('icon/side_condition_look.svg'),
    //   path: '/condition',
    //   width: '28px',
    //   height: '20px'
    // },
    // history: {
    //   svg: require('icon/side_history.svg'),
    //   path: '/history',
    //   width: '24px',
    //   height: '20x'
    // },
    // account: {
    //   svg: require('icon/side_account.svg'),
    //   path: '/login',
    //   width: null,
    //   height: null
    // }
    // }

    const linkList = computed(() => {
      const copyLinkList = [...baseLinkList] // 配列をコピー
      // タグ付与(管理)権限がある、もしくはローカル環境の場合は、タグ一括付与画面へのリンクをメニューに追加
      if (
        isTagAssignAuthority.value ||
        process.env.NODE_ENV === 'development'
      ) {
        copyLinkList.push(tagAssignLink) // タグ一括付与のメニューを追加
        return copyLinkList
      }
      return copyLinkList
    })
    // TODO: Vuex to Pinia
    // const { toggleClipDrawer } = appModule.useActions(['toggleClipDrawer'])
    const { toggleClipDrawer } = appModule
    const route = useRoute()

    function openClipDrawer(path: string) {
      if (path !== '/clip') return false
      if (route.value.path === '/clip') return false
      toggleClipDrawer(true)
    }

    return {
      linkList,
      openClipDrawer
    }
  }
})
</script>
<style lang="stylus" scoped>
.nav-list
  .nav-img
    width 100%
    padding 1em
    display flex
    justify-content center
    .v-image
      flex none
  &.nuxt-link-exact-active
    .nav-img
      background #e6f6fa
.nav-list:first-child
  &.nuxt-link-exact-active
    .nav-img
      background none
/*.nav-list:last-child
  position absolute
  bottom 10px
.nav-list:last-child .nav-img
  width: 80%;
  height: auto;
  display: inline-block;
  margin: 0.62em;
  padding 0*/
</style>
