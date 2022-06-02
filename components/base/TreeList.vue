<template lang="pug">
    div(v-if="drawer" id="mainNavIndex" :class="['left-pain', dottedLine ? 'dotted-line' : '']")
      div.resizer-right
      .select-area(v-if="selectOptions")
        v-select(v-model="selectedLocationType" :items='locationType', label='', dense='', outlined='', hide-details='true')
      //- Power BIの場合
      div(v-show="selectedLocationType === 'Power BI'")
        template(v-for="(powerbi, powerbiIndex) in powerbiTreeList")
          li(v-if="powerbi.name" :key="powerbi.id" :class="powerbi.open && powerbi.items.length ? 'parent-li' : ''")
            div.title-li(@click='toggleTree(powerbiTreeList, powerbiIndex)')
              v-icon(color="#43A5C4") {{ powerbi.open ? 'mdi-chevron-down' : 'mdi-chevron-right'}}
              p {{ powerbi.name }}
            ul(v-if='powerbi.open')
              li.child-li(v-for='(item, index) in powerbi.items', :key="index" v-if="item.isRelated" @click.stop="onClickTreeItem(powerbi, powerbi, item)")
                div(:class="`item ${item.selected ? 'selected': ''}`")
                  v-icon(color="#43A5C4") mdi-circle-small
                  p(v-text='item.showCategory')
          li(v-for='(item, index) in powerbi.items', :key="index" v-if="item.isRelated && !powerbi.name" @click.stop="onClickTreeItem(powerbi, powerbi), item")
            div(:class="`title-li second-level ${item.selected ? 'selected': ''}`")
              p {{ item.showCategory }}
      //- GMXの場合
      div(v-show="selectedLocationType === 'GMX'" style="height: calc(100vh - 110px); overflow-y: auto; overflow-x: hidden;")
        template(v-for="(gmx, gmxIndex) in gmxTreeList")
          li(v-if="gmx.locationType" :key="" :class="gmx.open && gmx.locations.length ? 'parent-li' : ''")
            div.title-li(@click='toggleTree(gmxTreeList, gmxIndex)')
              v-icon(color="#43A5C4") {{ gmx.open ? 'mdi-chevron-down' : 'mdi-chevron-right'}}
              p {{ gmx.locationType }}
            ul(v-if="gmx.open")
              template(v-for="(location, index) in gmx.locations")
                li(v-if="location.name" :key="location.id" :class="location.open && location.items.length ? gmx.locations.length - 1 !== index ? 'parent-li-open' : 'parent-li-end' : 'parent-li-close'")
                  div.title-li(@click='toggleTree(gmx.locations, index)')
                    v-icon(color="#43A5C4") {{ location.open ? 'mdi-chevron-down' : 'mdi-chevron-right'}}
                    p {{ location.name }}
                  ul(v-if='location.open' class="child-ul")
                    li.child-li(v-for='(item, i) in location.items', :key="i" v-if="item.isRelated" @click.stop="onClickTreeItem(gmx, location, item)")
                      div(:class="`item ${item.selected ? 'selected': ''}`")
                        v-icon(color="#43A5C4") mdi-circle-small
                        p(v-text='item.showCategory')
                li(v-for='(item, i) in location.items', :key="i" v-if="item.isRelated && !location.name" @click.stop="onClickTreeItem(gmx, location, item)")
                  div(:class="`title-li second-level ${item.selected ? 'selected': ''}`")
                    p {{ item.showCategory }}
      //- SAPの場合
      div(v-show="selectedLocationType === 'SAP'")
        template(v-for="(sap, sapIndex) in sapTreeList")
          li(v-if="sap.name" :key="sap.id" :class="sap.open && sap.items.length ? 'parent-li' : ''")
            div.title-li(@click='toggleTree(sapTreeList, sapIndex)')
              v-icon(color="#43A5C4") {{ sap.open ? 'mdi-chevron-down' : 'mdi-chevron-right'}}
              p {{ sap.name }}
            ul(v-if='sap.open')
              li.child-li(v-for='(item, index) in sap.items', :key="index" v-if="item.isRelated" @click.stop="onClickTreeItem(sap, sap, item)")
                div(:class="`item ${item.selected ? 'selected': ''}`")
                  v-icon(color="#43A5C4") mdi-circle-small
                  p(v-text='item.showCategory')
          li(v-for='(item, index) in sap.items', :key="index" v-if="item.isRelated && !sap.name" @click.stop="onClickTreeItem(sap, sap), item")
            div(:class="`title-li second-level ${item.selected ? 'selected': ''}`")
              p {{ item.showCategory }}
</template>
<script>
import {computed, defineComponent, nextTick, ref, watch} from '@nuxtjs/composition-api'
import { Category } from '~/constants/Category'
import { useSearchStore } from "~/store/searchModule";
import {useIndexStore} from "~/store/indexModule";
import {useAppStore} from "~/store/appModule";
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// import _searchModule from '~/store/search/searches'
// let searchModule = createNamespacedHelpers('searches')
// import _indexModule from '~/store/index/index'
// let indexModule = createNamespacedHelpers('index')
// import appModule from '~/store/app/app'

export default defineComponent({
  props: {
    dottedLine: { type: Boolean, default: false },
    selectOptions: { type: Boolean, default: false },
    drawer: { type: Boolean, default: true }
  },
  setup(_, { emit }) {
    const locationType = ['Power BI', 'GMX', 'SAP']
    const selectedLocationType = ref('Power BI')
    const powerbiTreeList = ref([]) // Power BIの左ツリー表示用
    const gmxTreeList = ref([]) // GMXの左ツリー表示用
    const sapTreeList = ref([]) // SAPの左ツリー表示用

    const searchModule = useSearchStore()
    const indexModule = useIndexStore()
    const appModule = useAppStore()

    // TODO: Vuex to Pinia
    // const { systemOverView } = searchModule.useState(['systemOverView']) // システムオーバービューのグローバルステート
    // const { fetchSystemOverview } = searchModule.useActions([
    //   'fetchLocations',
    //   'fetchSystemOverview'
    // ])
    // const { initialSelectionLocation } = indexModule.useState([
    //   'initialSelectionLocation'
    // ])
    // const {
    //   SET_DATA_FLOW,
    //   SET_INITIAL_SELECTION_LOCATION
    // } = indexModule.useMutations([
    //   'SET_DATA_FLOW',
    //   'SET_INITIAL_SELECTION_LOCATION'
    // ])
    // const { fetchIndexSearch } = indexModule.useActions(['fetchIndexSearch'])

    const systemOverView = computed(() => searchModule.systemOverView)
    const initialSelectionLocation = computed(() => indexModule.initialSelectionLocation)

    const { setDataFlow, setInitialSelectionLocation, fetchIndexSearch } = indexModule
    const { fetchSystemOverview } = searchModule

    // ロケーション情報取得(SystemOverview APIを使用)
    const fetchLocationData = async () => {
      await fetchSystemOverview()
      if (systemOverView?.value) replacementTreeList()
    }

    // 左ツリーのデータ加工
    const replacementTreeList = () => {
      // Power BIデータのみ抽出
      const powerbiValues =
        systemOverView.value?.find((e) => e?.systemType === 'PowerBI')
          ?.locations[0]?.values || []
      powerbiTreeList.value = powerbiValues?.map((e) => ({
        id: e?.id,
        name: e?.name,
        items: [
          {
            label: Category.DASHBOARD,
            showCategory: Category.getCategoryUCC(Category.DASHBOARD),
            isRelated: true,
            selected: false
          },
          {
            label: Category.REPORT,
            showCategory: Category.getCategoryUCC(Category.REPORT),
            isRelated: true,
            selected: false
          },
          {
            label: Category.DATASET,
            showCategory: Category.getCategoryUCC(Category.DATASET),
            isRelated: true,
            selected: false
          }
        ],
        open: false
      }))
      // GMXデータのみ抽出
      const gmxValues = systemOverView.value?.find(
        (e) => e?.systemType === 'GMX'
      )?.locations
      gmxTreeList.value = gmxValues?.map((e) => ({
        locationType: e.locationType,
        databaseParent: true,
        locations: e.values?.map((x) => ({
          id: x.id,
          name: x.name,
          databaseParent: false,
          items: [
            {
              label: Category.TABLE,
              showCategory: Category.getCategoryUCC(Category.TABLE),
              isRelated: true,
              selected: false
            },
            {
              label: Category.VIEW,
              showCategory: Category.getCategoryUCC(Category.VIEW),
              isRelated: true,
              selected: false
            }
          ],
          open: false
        })),
        open: false
      }))
      // SAPデータのみ抽出
      const sapValues =
        systemOverView.value?.find((e) => e?.systemType === 'SAP')?.locations[0]
          ?.values || []
      sapTreeList.value = sapValues?.map((e) => ({
        id: e?.id,
        name: e?.name,
        items: [
          {
            label: Category.TABLE,
            showCategory: Category.getCategoryUCC(Category.TABLE),
            isRelated: true,
            selected: false
          },
          {
            label: Category.VIEW,
            showCategory: Category.getCategoryUCC(Category.VIEW),
            isRelated: true,
            selected: false
          }
        ],
        open: false
      }))
    }
    const toggleTree = (list, index) => {
      list?.forEach((item, _index) => {
        if (_index !== index) {
          item.open = false
        }
      })
      if (list[index]) list[index].open = !list[index].open
    }
    const onClickTreeItem = async (parent, child, item) => {
      let dataFlow = ''
      if (selectedLocationType.value === 'Power BI') {
        // Power BIの場合
        clearSelection(powerbiTreeList.value) // 全データ選択されていない状態にする
        dataFlow = child.name + ' > ' + item.showCategory
      } else if (selectedLocationType.value === 'GMX') {
        // GMXの場合
        gmxTreeList.value?.forEach((gmx) => {
          clearSelection(gmx?.locations) // 全データ選択されていない状態にする
        })
        dataFlow =
          parent.locationType + ' > ' + child.name + ' > ' + item.showCategory
      } else if (selectedLocationType.value === 'SAP') {
        // SAPの場合
        clearSelection(sapTreeList.value) // 全データ選択されていない状態にする
        dataFlow = child.name + ' > ' + item.showCategory
      }
      item.selected = true
      appModule.enableLoading()
      setDataFlow(dataFlow)
      await fetchIndexSearch({ id: child.id, label: item.label })
      appModule.disableLoading()
      emit('selectTreeItem')
    }
    // 全データ選択されていない状態にする
    const clearSelection = (data) => {
      data?.map((e) => {
        e?.items?.forEach((item) => {
          if (item.selected) item.selected = false
        })
      })
    }
    // SystemOverview(Top画面)から遷移された時は、該当ツリーを展開する
    const initialOpenLocation = () => {
      if (initialSelectionLocation.value?.systemType === 'PowerBI') {
        // Power BIの場合
        selectedLocationType.value = 'Power BI'
        powerbiTreeList.value?.forEach((e) => {
          if (e.id === initialSelectionLocation.value?.locationId) e.open = true
          else e.open = false
        })
      } else if (initialSelectionLocation.value?.systemType === 'GMX') {
        // GMXの場合
        console.log(gmxTreeList)
        selectedLocationType.value = 'GMX'
        gmxTreeList.value?.forEach((e) => {
          if (e.locationType !== initialSelectionLocation.value?.locationType) {
            e.open = false
            return
          }
          console.log(true)
          e.open = true
          e.locations?.forEach((j) => {
            if (j.id === initialSelectionLocation.value?.locationId)
              j.open = true
            else j.open = false
          })
        })
      } else if (initialSelectionLocation.value?.systemType === 'SAP') {
        // SAPの場合
        selectedLocationType.value = 'SAP'
        sapTreeList.value?.forEach((e) => {
          if (e.id === initialSelectionLocation.value?.locationId) e.open = true
          else e.open = false
        })
      }
      // 左ツリー初期展開要素の初期化
      setInitialSelectionLocation({ locationType: null, locationId: null })
    }

    watch(powerbiTreeList, () => {
      nextTick(() => {
        emit('dataRendered')
      })
    })
    watch(gmxTreeList, () => {
      nextTick(() => {
        emit('dataRendered')
      })
    })
    watch(sapTreeList, () => {
      nextTick(() => {
        emit('dataRendered')
      })
    })

    if (systemOverView?.value?.length > 0) replacementTreeList()
    else fetchLocationData()
    initialOpenLocation()

    return {
      locationType,
      selectedLocationType,
      toggleTree,
      fetchLocationData,
      onClickTreeItem,
      replacementTreeList,
      powerbiTreeList,
      gmxTreeList,
      sapTreeList
    }
  }
})
</script>
<style lang="stylus" scoped>
#mainNavIndex
  min-width 180px
.left-pain
  padding-bottom 28px
  padding-right 3px
  color #41434E
  position relative
  height 100%
  background #fff
  overflow hidden
  box-shadow 1px 1px 2px #00000033 !important
  user-select none
  ul, li
    list-style none
    margin 0
    padding 0
  ul
    padding-left 20px !important
    height unset !important
    margin-top 0 !important
    font-weight normal !important
    li
      &:last-child
        ul
          border-left 4px solid white
          margin-left -10px
  li
    padding-left 8px
    user-select none
    .parent-li-open
      border: 1px dotted #000
      border-width: 0 0 0 1px
    .parent-li-end
      position relative
      &::before
        content ''
        position absolute
        border 1px dotted #000
        border-width 0 0 0 1px
        height 25px
        left 0px
    .parent-li-close
      border 1px dotted #000
      border-width 0 0 1px 1px
    .child-ul
      border 1px dotted #000
      border-width 1px 0 0 0
      margin-left -8px
    .title-li
      display flex
      margin 0
      background white
      position relative
      top 1.1em
      color #41434E
      font-size 12px
      cursor pointer
      p
        margin 0
        padding-top 3px
        padding-left 3px
        z-index 10
        overflow hidden
        text-overflow ellipsis
      &:hover::before
        content ''
        background rgba(84, 172, 200, .2)
        width calc(100vw - 616px)
        height 100%
        position absolute
        left -8px
        border-radius 14px 0 0 14px
    .title-li.second-level
      top 0.6rem
    .title-li.selected
      &::before
        content ''
        background rgba(84, 172, 200, .2)
        width calc(100vw - 616px)
        height 100%
        position absolute
        left -8px
        border-radius 14px 0 0 14px
    .child-li
      border 1px dotted black
      border-width 0 0 1px 1px
      .item
        width 100%
        display flex
        margin 0
        background white
        position relative
        top 1.1em
        color #41434E
        font-size 12px
        cursor pointer
        white-space nowrap
        text-overflow: ellipsis;
        user-select none
        &:hover::before
          content ''
          background rgba(84, 172, 200, .2)
          width calc(100vw - 616px)
          height 100%
          position absolute
          left -29px
          border-radius 14px 0 0 14px
        p
          margin 0
          padding-top 2px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          padding-right 16px
          z-index 10

      .item.selected
        &::before
          content ''
          background rgba(84, 172, 200, .2)
          width calc(100vw - 616px)
          height 100%
          position absolute
          left -29px
          border-radius 14px 0 0 14px
    ul
      margin-left -8px
      padding-left 24px
  .select-area
    padding 12px 16px 0 16px
    >>>.v-input__control
      .v-input__slot
        color #eaeaea
        outline none
        &:hover
          outline #eaeaea
      .v-select__selection
        letter-spacing 0 !important
        color #41434E !important
  .resizer-right
    z-index 10
    width 8px
    height 100%
    background transparent
    position absolute
    right 0
    bottom 0
    cursor e-resize
</style>
