<template lang="pug">
  div(id="lineage-container")
    BaseLoadingCircle(:loading='loading' :opacity="1")
    div.expand-nav(@click="drawer = !drawer")
      img(:src="require('@/assets/icons/expand-nav.svg')" height="36px")
    div(class="actions")
      //-div(class="group filter" style="border:1px solid #54ACC8")
      //-  v-checkbox(v-model="filterRelated" label="関連データのみ表示" @change="onShowAllChange")
      div(class="group search" style="padding-right: 4px")
        img(:src="require('@/assets/icons/result_search.svg')" class="search-icon" width="18px")
        div(class="input-box")
          input(v-model="refineKeywords" class="mr-1" placeholder="絞り込みキーワード ")
          img(:src="require('@/assets/icons/result_search_clear.svg')" class="action-btn" width="16px" @click="onKeywordClear")
      div(class="group zoom")
        v-btn(icon @click="onZoomOutClick" width='30px' height='30px')
          img(:src="require('@/assets/icons/minus.svg')" class="action-btn" width="14px")
        span(class="zoom-value-text") {{ zoomValue }}%
        v-btn(icon @click="onZoomInClick" width='30px' height='30px')
          img(:src="require('@/assets/icons/plus.svg')" class="action-btn" width="14px")
        v-divider(:vertical="true" class="zoom-divider")
        v-btn(icon @click="onFitContentClick" width='30px' height='30px')
          img(:src="require('@/assets/icons/fullscreen.svg')" class="action-btn" width="21px")
    //- 詳細情報パネル
    div(id="detailPanel" v-show="isShowDetail" class="detail-panel")
      div.head
        v-img(v-if="detailData && detailData.label === Category.TABLE" :src="require('@/assets/icons/table.svg')" class="icon-size mr-2" height="1em" max-width="1em")
        v-img(v-if="detailData && detailData.label === Category.VIEW" :src="require('@/assets/icons/view.svg')" class="icon-size mr-2" height="1em" max-width="1em")
        v-img(v-if="detailData && detailData.label === Category.DASHBOARD" :src="require('@/assets/icons/dashboard.svg')" class="icon-size mr-2" height="1em" max-width="1em")
        v-img(v-if="detailData && detailData.label === Category.REPORT" :src="require('@/assets/icons/report.svg')" class="icon-size mr-2" height="1em" max-width="1em")
        v-img(v-if="detailData && detailData.label === Category.DATASET" :src="require('@/assets/icons/dataset.svg')" class="icon-size mr-2" height="1em" max-width="1em")
        span(class="font-weight-bold mr-2") {{ detailData && detailData.name ? detailData.name : '' }}
        a(href="#" style="text-decoration: none" @click="onShowDetailClick(detailData)") 詳細情報
        v-spacer
        v-icon(@click="hideDetail" style="color: #43a5c4") {{ mdiClose }}
      div(class="detail-tab-content")
        v-row
          //- 物理名
          v-col(ref="nameColRef" cols="12" sm="6" :md="`${nameColsMd}`" class="min-width-120")
            p(class="label text-small") {{ $t('detail_tab.PHYSICAL_NAME') }}
            p(ref="nameRef" class="value" v-tooltip="'SAP_SDT_FL_LIKP'") {{ detailData && detailData.name ? detailData.name : '' }}
          //- 論理名
          v-col(ref="logicalNameColRef" cols="12" sm="6" :md="`${logicalNameColsMd}`" class="min-width-120")
            p(v-if="detailData && detailData.hasOwnProperty('powerbiUrl')" class="label text-small") {{ $t('detail_tab.ALIAS') }}
            p(v-else class="label text-small") {{ $t('detail_tab.LOGICAL_NAME') }}
            p(ref="logicalNameRef" class="value") {{ detailData && detailData.logicalName ? detailData.logicalName : '' }}
          //- Power BI URL
          v-col(v-if="detailData && detailData.hasOwnProperty('powerbiUrl')" ref="nameColRef" cols="12" sm="6" :md="`${nameColsMd}`" class="min-width-120")
            p(class="label text-small") {{ $t('detail_tab.POWER_BI_URL') }}
            a(:href="detailData.powerbiUrl" target="_blank" rel="noopener noreferrer" style="text-decoration:none; display:flex; align-items:center;")
              p(class="value" style="color:#43A5C4; text-decoration:none; cursor:pointer;") Power BI画面へ&nbsp;
              img(:src="require('@/assets/icons/url_link.svg')" height="12px")
          v-col(cols="12" sm="6" :md="`${spaceColsMd}`")
        v-row
        v-row
          //- ロケーション
          v-col(cols="12" sm="6" :md="`${nameColsMd}`" class="min-width-120")
            p(class="label text-small") {{ $t('detail_tab.LOCATION') }}
            p(class="value") {{ detailData && detailData.locationName ? detailData.locationName : '' }}
          //- スキーマ
          v-col(cols="12" sm="6" :md="`${logicalNameColsMd}`" class="min-width-120")
            p(v-if="detailData && detailData.label === Category.DATASET" class="label text-small") {{ $t('detail_tab.WORKSPACE') }}
            p(v-else class="label text-small") {{ $t('detail_tab.SCHEMA') }}
            p(class="value") {{ detailData && detailData.schemaName ? detailData.schemaName : '' }}
          //- カテゴリ
          v-col(cols="12" sm="6" md="2" class="min-width-120")
            p(class="label text-small") {{ $t('detail_tab.CATEGORY') }}
            p(class="value") {{ detailData && detailData.label ? Category.getCategoryUCC(detailData.label) : '' }}
          //- データオーナー
          v-col(cols="12" sm="6" md="2" class="min-width-120")
            p(class="label text-small") {{ $t('detail_tab.DATA_OWNER') }}
            AppLink(v-if="detailData && detailData.values && detailData.values.owner" class="value" :to="'#'")
              span {{ detailData && detailData.values && detailData.values.owner ? detailData.values.owner : '' }}
              img(class="ml-3" :src="require('@/assets/icons/detail_mail.svg')" height="13px")
        v-row
          //- タグ
          v-col(cols="12" sm="6" md="6")
            p(class="label text-small") {{ $t('detail_tab.TAG') }}
            div.tags-list(v-if="detailData && detailData.values && detailData.values.tags")
              div.tag-item(v-for="item in detailData.values.tags")
                div # {{ item.name }}
    div(id="lineage-konva")
      v-stage(ref="stageRef" :config="configKonva")

    div.left-nav(v-show='drawer')
      div#mainNav.main-nav
        div.resizer-right
        v-subheader ジョブ一覧
        div.pine-line-nav
          v-list-item.pine-line-item(v-for='item in pipelineList' :key='item.id' :class="{'active': pipelineSelectedId===item.id}" @click.stop="selectPipeline(item)")
            v-list-tile-content
              v-list-tile-title {{ item.pipelineName }}
        v-subheader ロケーション⼀覧 
        div(class="location-list")
          template(v-for="(group) in groups")
            v-list-item(class="location-item")
              span {{ group.title || '' }}
            ul(class="location-item")
              template(v-for="child in group.children")
                li(v-if="child.label" :key="child.id" :class="child.open && child.items.length ? 'parent-li' : ''")
                  div.title-li(@click='child.open = !child.open')
                    v-icon(color="#43A5C4") {{ child.open ? 'mdi-chevron-down' : 'mdi-chevron-right'}}
                    p {{ child.label }}
                  ul(v-if='child.open')
                    li.child-li(v-for='(item, index) in child.items', :key="index" v-if="!filterRelated || item.isRelated" @click.stop="selectLocationItem(item, child)")
                      div(:class="`item ${item.selected ? 'selected': ''}`")
                        v-icon(color="#43A5C4") mdi-circle-small
                        p(v-text='item.title')
                li(v-for='(item, index) in child.items', :key="index" v-if="(!filterRelated || item.isRelated) && !child.label" @click.stop="selectLocationItem(item, child)")
                  div(:class="`title-li second-level ${item.selected ? 'selected': ''}`")
                    p {{ item.title }}
      div.shrink-nav(@click="drawer = !drawer")
        img(:src="require('@/assets/icons/shrink-nav.svg')" height="36px")
</template>
<script>

import { mdiPaperclip, mdiChevronRight, mdiClose } from '@mdi/js'
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  computed,
  nextTick
} from '@nuxtjs/composition-api'
import { Category } from '~/constants/Category'
import { wait } from '~/utils/app-utils'
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// let resultModule = createNamespacedHelpers('results')
// import _resultModule from '~/store/result/results'
import { $axios } from '~/utils/api'
import { useResultStore } from "~/store/resultModule";

export default defineComponent({
  props: {
    isExpanded: { type: Boolean, default: false },
    loadLineageRandom: { type: Number, default: 0 },
    selectedItem: { type: Object, default: {} }
  },
  setup(props, { root, emit }) {
    let configKonva = ref({
      width: 1400,
      height: 700,
      draggable: false
    })
    let originalConfigKonva = ref({
      width: 1400,
      height: 700
    })
    const contentSize = ref(null)
    const stageRef = ref(null)
    let stage = null
    let layer = null
    let rootGroup = null
    let gridLayer = null
    let fontSize = 14

    let tableIcon
    let viewIcon
    let datasetIcon
    let reportIcon
    let dashboardIcon
    const groups = ref([])
    const loading = ref(false)
    const filterRelated = ref(false)
    const zoom = ref(1)
    const zoomValue = ref(100)
    const isShowDetail = ref(false)
    const isExpanded = computed(() => props.isExpanded)
    const loadLineageRandom = computed(() => props.loadLineageRandom)
    const selectedItem = computed(() => props.selectedItem)
    const drawer = ref(true)
    const detailData = ref(null)

    const resultModule = useResultStore()

    const arraytest = []

    // TODO: Vuex to Pinia
    // const pipelines = resultModule.useState(['pipelineList'])

    const pipelines = computed(() => resultModule.pipelineList)
    const pipelineList = computed(
      () =>  pipelines.value?.pipelines || []
    )
    const pipelineSelectedId = ref(null)

    // TODO: Vuex to Pinia
    // const {
    //   selectedItemId,
    //   selectedItemType,
    //   lineage
    // } = resultModule.useGetters([
    //   'selectedItemId',
    //   'selectedItemType',
    //   'lineage'
    // ])
    // const { ADD_SHOW_ITEMS } = resultModule.useMutations(['ADD_SHOW_ITEMS'])
    // const {
    //   fetchPipelines,
    //   fetchLineage,
    //   setSelectedItem
    // } = resultModule.useActions([
    //   'fetchPipelines',
    //   'fetchLineage',
    //   'setSelectedItem'
    // ])
    const selectedItemId = computed(() => resultModule.selectedItemId)
    const selectedItemType = computed(() => resultModule.selectedItemType)
    const lineage = computed(() => resultModule.lineage)

    const {
      fetchPipelines,
      fetchLineage,
      setSelectedItem,
      addShowItems,
    } = resultModule

    const loadGridLine = () => {
      if (!gridLayer) {
        gridLayer = new Konva.Layer({
          draggable: false,
          listening: false
        })
        stage.add(gridLayer)
      } else {
        gridLayer.destroyChildren()
      }
      drawGridLines()
      stage.batchDraw()
    }

    const drawGridLines = () => { 
      if (!stage) return
      if (!gridLayer) return
      gridLayer.removeChildren()
      const padding = 25
      const background = new Konva.Rect({
        width: configKonva.value.width,
        height: configKonva.value.height,
        x: 0,
        y: 0,
        fill: '#F5F5F5'
      })
      gridLayer.add(background)
      let line = null
      for (let i = 0; i < (configKonva.value.width * 2) / padding; i++) {
        if (!line)
          line = new Konva.Line({
            points: [
              Math.round(i * padding) + 0.5,
              5,
              Math.round(i * padding) + 0.5,
              configKonva.value.height
            ],
            stroke: '#DEDFE6',
            strokeWidth: 3,
            lineCap: 'round',
            dash: [0.001, 25, 0.001, 25]
          })
        else
          line = line.clone({
            points: [
              Math.round(i * padding) + 0.5,
              5,
              Math.round(i * padding) + 0.5,
              configKonva.value.height
            ]
          })
        gridLayer.add(line)
        line.cache()
      }
      line.clearCache()
    }

    const fetchData = async (vertexId) => {
      const resultLineage = await fetchLineage({
        vertexId: vertexId
      })
      let count = 1
      let groupDependsOn = null
      groups.value = []
      resultLineage?.data?.groups?.forEach((group) => {
        let children = []
        group?.children?.forEach((child) => {
          let items = []
          let chartLabel = child.label
          child?.items?.forEach((item) => {
            chartLabel = item.label
            items.push({
              id: item.id,
              dependsOn: item.id === 1 ? [4] : [],
              title: item.title,
              label: item.label,
              desc: item.logicalName,
              isRelated: true, // TODO: 「関連データあり」の実装が来たら、「item.isRelated」から値を取得
              selected: false
            })
          })
          chartLabel = Category.getCategoryUCC(chartLabel)
          children.push({
            id: count,
            dependsOn: count - 1,
            label: chartLabel,
            items: items,
            open: false
          })
          count += 1
        })
        groups?.value.push({
          id: group.id,
          title: group.title,
          dependsOn: groupDependsOn ? groupDependsOn : [],
          children: children,
          open: false
        })
        groupDependsOn = [group.id]
      })
    }

    const dataGeneration = async () => {
      // if (
      //   lineage &&
      //   lineage.value &&
      //   lineage.value.groups &&
      //   lineage.value.vertexId &&
      //   pipelineList.value &&
      //   pipelineList.value[0] &&
      //   pipelineList.value[0].id &&
      //   pipelineList.value.some((item) => item.id === lineage.value.vertexId)
      // ) {
      //   console.log('true')
      //   let count = 1
      //   let groupDependsOn = null
      //   lineage?.value?.groups?.forEach((group) => {
      //     let children = []
      //     group?.children?.forEach((child) => {
      //       let items = []
      //       child?.items?.forEach((item) => {
      //         items.push({
      //           id: item.id,
      //           title: item.title,
      //           label: item.label,
      //           desc: item.logicalName,
      //           isRelated: item.isRelated,
      //           selected: false
      //         })
      //       })
      //       children.push({
      //         id: count,
      //         dependsOn: count - 1,
      //         label: child.label,
      //         items: items,
      //         open: false
      //       })
      //       count += 1
      //     })
      //     groups?.value.push({
      //       id: group.id,
      //       title: group.title,
      //       dependsOn: groupDependsOn ? groupDependsOn : [],
      //       children: children,
      //       open: false
      //     })
      //     groupDependsOn = [group.id]
      //   })
      // } else {
      await fetchPipelines(selectedItem.value.id)
      fetchData(pipelineList.value[0]?.id)
      // }
    }

    const unSelectGroups = (ignoreId, parentId) => {
      if (!groups.value) return
      groups?.value?.forEach((group) => {
        if (!group || !group.children) return
        group?.children?.forEach((child) => {
          if (!child || !child.items) return
          child?.items?.forEach((item) => {
            if (item.id === ignoreId && parentId === child.id) {
              return
            }
            item.selected = false
          })
        })
      })
    }

    const width = configKonva.value.width * 20
    const height = configKonva.value.height * 20

    const loadData = () => {
      rootGroup = new Konva.Group({
        draggable: false,
        x: 350,
        y: 100,
        originX: 350,
        originY: 100,
        level: 0
      })
      if (!layer) {
        layer = new Konva.Layer({
          draggable: true
        })
        stage.add(layer)
      } else {
        layer.destroyChildren()
      }
      const selectionRectangle = new Konva.Rect({
        width: width,
        height: height,
        x: -width / 2,
        y: -height / 2,
        fill: 'rgba(0,0,0,0)',
        draggable: false
      })
      layer.add(selectionRectangle)
      layer.add(rootGroup)
      selectionRectangle.on('mouseover', function() {
        stage.container().style.cursor = 'grab'
      })
      selectionRectangle.on('mouseleave', function() {
        stage.container().style.cursor = 'default'
      })
      selectionRectangle.on('mousedown', function() {
        stage.container().style.cursor = 'grabbing'
      })
      selectionRectangle.on('mouseup', function() {
        stage.container().style.cursor = 'grab'
      })
      selectionRectangle.on('dragstart', function() {
        stage.container().style.cursor = 'grabbing'
      })
      selectionRectangle.on('dragend', function() {
        stage.container().style.cursor = 'grab'
      })
      layer.on('mouseleave', function() {
        stage.container().style.cursor = 'default'
      })
      layer.on('dragstart', function() {
        stage.container().style.cursor = 'grabbing'
      })
      layer.on('dragend', function() {
        stage.container().style.cursor = 'grab'
      })
      return drawData()
    }

    const drawData = () => {
      const res = { width: 0, height: 0 }
      if (!layer) return res
      if (!rootGroup) return res

      const drawGroupConnector = (group) => {
        if (!group || !group.dependsOn || !group.dependsOn.length) return
        const dependGroups = rootGroup
          .find('Group')
          .filter(
            (item) =>
              item.attrs.level === 1 && group.dependsOn.includes(item.attrs.id)
          )
        const groupKonva = rootGroup
          .find('Group')
          .filter(
            (item) => item.attrs.level === 1 && group.id === item.attrs.id
          )
          .shift()
        if (!groupKonva) return
        for (const dependGroup of dependGroups) {
          if (!dependGroup) continue
          const groupWidth = dependGroup.children[0]?.width()
          drawArrow(
            rootGroup,
            { x: dependGroup.x() + groupWidth, y: dependGroup.y() + 23 },
            {
              x1: dependGroup.x() + groupWidth,
              y1: dependGroup.y() + 23,
              x2: groupKonva.x() - 2,
              y2: groupKonva.y() + 23
            }
          )
        }
      }

      let x = 0

      for (let group of groups.value) {
        if (!group) continue
        if (!group.children) continue
        if (
          filterRelated.value &&
          !group.children?.some((child) =>
            child?.items?.some((item) => item.isRelated)
          )
        ) {
          continue
        }

        const sameDependGroups = groups?.value?.filter(
          (item) =>
            JSON.stringify(item.dependsOn) === JSON.stringify(group.dependsOn)
        )
        const sameDependGroup = sameDependGroups
          .slice(
            0,
            sameDependGroups.findIndex((item) => item.id === group.id)
          )
          .pop()
        if (sameDependGroup) {
          const sameDependGroupKonva = rootGroup
            .find('Group')
            .filter(
              (item) =>
                item.attrs.id === sameDependGroup.id && item.attrs.level === 1
            )
            .shift()
          if (sameDependGroupKonva) {
            x = sameDependGroupKonva.x()
            let y = sameDependGroup.calcHeight || 0
            if (!y) {
              const sameDependGroupKonvaBg = sameDependGroupKonva
                .find('Rect')
                .filter(
                  (item) => item.attrs.isBackground && item.attrs.level === 1
                )
                .shift()
              y = sameDependGroupKonvaBg ? sameDependGroupKonvaBg.height() : 0
            }
            y += 43
            const height = drawGroup(group, { x, y })
            drawGroupConnector(group)
            group.calcHeight = height + y
            x +=
              sameDependGroupKonva.children[0] &&
              sameDependGroupKonva.children[0].attrs.width
                ? sameDependGroupKonva.children[0].attrs.width
                : 560
            continue
          }
        }
        const height = drawGroup(group, { x, y: 0 })
        drawGroupConnector(group)
        group.calcHeight = height
        const groupWidth = group?.children ? 240 * group.children.length : 480
        x += groupWidth + 40
      }
      const groupsDependsOn = rootGroup.find('Group').map((item) => item.attrs.dependsOn && item.attrs.dependsOn.length > 0)
      console.log(groupsDependsOn)

      for (const group of groupsDependsOn) {
        const drawGroupConnector = (groupKonva) => {
          if (
            !groupKonva ||
            !groupKonva.attrs.dependsOn ||
            !groupKonva.attrs.dependsOn.length
          )
            return

          const dependGroups = rootGroup
            .find('Group')
            .filter(
              (item) =>
                item.attrs.level === 3 &&
                groupKonva.attrs.dependsOn.includes(item.attrs.id)
            )

          if (!groupKonva) return
          for (const dependGroup of dependGroups) {
            if (!dependGroup) continue
            const groupWidth = dependGroup.children[0]?.width()
            const heightRectLevel2 = dependGroup.parent.parent.find('Rect').filter((item) => item.attrs.level === 2)[0].height()
            const heightRectLevel3 = dependGroup.parent.parent.find('Rect').filter((item) => item.attrs.level === 3)[0].height()
            //  console.log('x1',dependGroup.parent.parent.parent.parent.x() + dependGroup.parent.parent.x() )
            //  console.log('x2',groupKonva.parent.parent.parent.parent.x() + groupKonva.parent.parent.x() )
            //  console.log('dfdf', dependGroup)
            let terminalCoordinates = {}
            const coordinatesStartX1 = dependGroup.parent.parent.parent.parent.x() + dependGroup.parent.parent.x()
            const coordinatesEndX2 = groupKonva.parent.parent.parent.parent.x() + groupKonva.parent.parent.x()

            if (coordinatesStartX1 < coordinatesEndX2) {
              terminalCoordinates = {
                x1: dependGroup.parent.parent.parent.parent.x() + dependGroup.parent.parent.x() + dependGroup.x() + groupWidth,
                y1: 43 + dependGroup.parent.parent.y() + 43 + dependGroup.y() + heightRectLevel3 / 2,
                x2: groupKonva.parent.parent.parent.parent.x() + groupKonva.parent.parent.x() + groupKonva.x(),
                y2: 43 + groupKonva.parent.parent.y() + 43 + groupKonva.y() + heightRectLevel3 / 2,
              }
            } else if (coordinatesStartX1 > coordinatesEndX2) {
              terminalCoordinates = {
                x1: dependGroup.parent.parent.parent.parent.x() + dependGroup.parent.parent.x() + dependGroup.x(),
                y1: 43 + dependGroup.parent.parent.y() + 43 + dependGroup.y() + heightRectLevel3 / 2,
                x2: groupKonva.parent.parent.parent.parent.x() + groupKonva.parent.parent.x() + groupKonva.x() + groupWidth,
                y2: 43 + groupKonva.parent.parent.y() + 43 + groupKonva.y() + heightRectLevel3 / 2,
              }
            } else {
              terminalCoordinates = {
                x1: dependGroup.parent.parent.parent.parent.x() + dependGroup.parent.parent.x() + dependGroup.x() + groupWidth,
                y1: 43 + dependGroup.parent.parent.y() + 43 + dependGroup.y() + heightRectLevel3 / 2,
                x2: groupKonva.parent.parent.parent.parent.x() + groupKonva.parent.parent.x() + groupKonva.x() + groupWidth,
                y2: 43 + groupKonva.parent.parent.y() + 43 + groupKonva.y() + heightRectLevel3 / 2,
              }
            }
            // console.log(terminalCoordinates)


            LinageChartHelper.drawArrow(
              stage,
              rootGroup,
              {
                x: dependGroup.x() + groupWidth + dependGroup.parent.parent.x(),
                y: 43 + dependGroup.parent.parent.y() + 43 + dependGroup.y() + heightRectLevel3 / 2,
              },
              terminalCoordinates, arraytest
            )
          }
        }
        drawGroupConnector(group)
      }

      res.width = x
      res.height = Math.max(...groups.value.map((item) => item.calcHeight))
      return res
    }

    // draw同士に線を引く
    const drawArrow = (parent, config, { x1, y1, x2, y2 }) => {
      if (!layer) return
      if (!parent) return
      const circle = new Konva.Circle({
        ...config,
        radius: 4,
        fill: '#23A8D1'
      })
      let points = []
      if (x1 === x2) {
        points = [x1, y1, x1 + 8, y1 + 4, x2 + 12, y2 - 2, x2, y2 + 2]
      } else if (y1 !== y2) {
        points = [x1, y1, x1 + 5, y1 + 4, x2 - 12, y2 - 5, x2, y2 - 2]
      } else {
        points = [x1, y1, x1 + 5, y1, x2 - 4, y2, x2, y2]
      }
      const arrow = new Konva.Arrow({
        points: points,
        pointerLength: 5,
        pointerWidth: 7,
        fill: '#23A8D1',
        stroke: '#23A8D1',
        strokeWidth: 2.5,
        tension: y1 !== y2 ? 0.5 : 0
      })
      const arrays = [circle, arrow]
      arrays.forEach((item) => {
        item.on('mouseover', function() {
          stage.container().style.cursor = 'grab'
        })
        item.on('mouseleave', function() {
          stage.container().style.cursor = 'default'
        })
        item.on('mousedown', function() {
          stage.container().style.cursor = 'grabbing'
        })
        item.on('mouseup', function() {
          stage.container().style.cursor = 'grab'
        })
      })
      parent.add(circle)
      parent.add(arrow)
    }

    // drawの作成
    const drawGroup = (groupData, config) => {
      if (!layer) return 50
      if (!rootGroup) return 50
      if (!groupData) return 50
      if (
        filterRelated.value &&
        !groupData.children
          .map((item) => item.items.some((item) => item.isRelated))
          .some((item) => item)
      ) {
        return
      }

      const group = new Konva.Group({
        id: groupData.id,
        draggable: false,
        ...config,
        level: 1,
        isFile: !!groupData.isFile
      })

      let countRelatedObj = 0
      if (filterRelated.value) {
        groupData?.children?.forEach((child) => {
          if (child?.items?.some((item) => item.isRelated)) countRelatedObj++
        })
      } else {
        countRelatedObj = groupData?.children?.length
      }

      const contentBackground = new Konva.Rect({
        x: 0,
        y: 0,
        width: groupData?.children ? 240 * countRelatedObj : 480,
        height: 400,
        fill: '#E9EEF0',
        cornerRadius: [6, 6, 6, 6],
        shadowColor: 'rgba(0,0,0,.16)',
        shadowBlur: 2,
        shadowOffset: { x: 1, y: 1 },
        draggable: false,
        level: 1,
        isBackground: true
      })

      const groupTitleBg = new Konva.Rect({
        x: 0,
        y: 0,
        width: groupData?.children ? 240 * countRelatedObj : 480,
        height: 43,
        fill: '#54ACC8',
        cornerRadius: [6, 6, 0, 0]
      })

      const groupTitleText = new Konva.Text({
        align: 'center',
        verticalAlign: 'middle',
        text: groupData.title,
        fontSize: fontSize,
        fontFamily:
          "'Yu Gothic UI','Yu Gothic', 'Hiragino Kaku Gothic Pro', 'Hiragino Kaku Gothic ProN', Arial",
        fontStyle: 'bold',
        fill: '#f5f5f5',
        width: groupData?.children ? 240 * countRelatedObj : 480,
        height: 43,
        draggable: false
      })
      const arrays = [contentBackground, groupTitleBg, groupTitleText]
      arrays.forEach((item) => {
        item.on('mouseover', function() {
          stage.container().style.cursor = 'grab'
        })
        item.on('mouseleave', function() {
          stage.container().style.cursor = 'default'
        })
        item.on('mousedown', function() {
          stage.container().style.cursor = 'grabbing'
        })
        item.on('mouseup', function() {
          stage.container().style.cursor = 'grab'
        })
      })

      group.add(contentBackground)
      group.add(groupTitleBg)
      group.add(groupTitleText)

      const contentGroup = new Konva.Group({
        draggable: false,
        isContentGroup: true,
        x: 0,
        y: 43
      })

      let heights = []
      if (
        groupData.children.length === 1 &&
        groupData.children[0].lagel === null
      ) {
        // グループが１つの場合
        const res = drawSingleItems(contentGroup, groupData.children[0], {
          x: 20,
          y: 20
        })
        heights.push(res.height + 20)
        arraytest.push({ parent: group, child: res.group })
      } else {
        // グループが複数の場合
        let x = 20
        let y = 20

        // 小グループ描写（TablesやViewsなど）
        for (let child of groupData.children) {
          if (
            // 関連データのみ表示にチェック時は、isRelated: trueのものは描画しない
            filterRelated.value &&
            !child?.items?.some((item) => item.isRelated)
          ) {
            continue
          }

          const res = drawGroupItems(contentGroup, child, { x, y })
          heights.push(y + height)
          // y = x === 260 ? Math.max(...heights) + 23 : 20
          x = x += 240
          arraytest.push({ parent: group, child: res.group })
        }

        //draw arrow (矢印は削除になったが、今後使う可能性を考慮し、一旦コメントアウトで残す。)
        // for (let child of groupData.children) {
        //   if (!child || !child.dependsOn || !child.dependsOn.length) continue
        //   const dependGroups = contentGroup
        //     .find('Group')
        //     .filter(
        //       (item) =>
        //         child.dependsOn.includes(item.attrs.id) &&
        //         item.attrs.level === 2
        //     )
        //   const childGroup = contentGroup
        //     .find('Group')
        //     .filter(
        //       (item) => child.id === item.attrs.id && item.attrs.level === 2
        //     )
        //     .shift()
        //   if (!childGroup) continue
        //   for (let dependGroup of dependGroups) {
        //     let x1 = dependGroup.x() + 200
        //     let y1 = dependGroup.y() + 20
        //     let x2 = childGroup.x() - 2
        //     let y2 = childGroup.y() + 20
        //     if (dependGroup.x() === childGroup.x()) {
        //       x2 = x1
        //     }
        //     drawArrow(contentGroup, { x: x1, y: y1 }, { x1, x2, y1, y2 })
        //   }
        // }
      }

      let calcHeight = 0
      if (heights.length) calcHeight = Math.max(...heights)

      //63 = title 43 + padding bottom 20
      calcHeight += 63
      contentBackground.height(calcHeight)
      group.add(contentGroup)

      const arrow = new Konva.Arrow({
        x: 0,
        y: 100,
        points: [0, 0, 0, 0],
        pointerLength: 20,
        pointerWidth: 20,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
      })

      let groupContent = null
      let groupsDependsOn = null

      arraytest.forEach((item) => {
        groupContent = item.parent.find('Group').filter((group) => group.attrs.isContentGroup === true).shift()
        groupContent.add(arrow,item.child)

        // if () {

        // }
        groupsDependsOn = item.child.find('Group').filter((item) => item.attrs.dependsOn && item.attrs.dependsOn.length > 0)
        console.log('item', groupsDependsOn)
      })

      rootGroup.add(group)
      return calcHeight
    }

    /** グループが１つ（SQL DatabaseやAzure Synapse）の場合実行される */
    const drawSingleItems = (parent, item, config) => {
      if (!parent) return 0
      if (!item || !item.items) return 0
      if (filterRelated?.value && !item.items?.some((_item) => _item.isRelated))
        return 0
      const group = new Konva.Group({
        id: item.id,
        draggable: false,
        ...config
      })
      const contentBackground = new Konva.Rect({
        x: 0,
        y: 0,
        width: 440,
        height: 300,
        fill: '#F4F7F8',
        cornerRadius: [6, 6, 6, 6],
        shadowColor: 'rgba(0,0,0,.16)',
        shadowBlur: 2,
        shadowOffset: { x: 1, y: 1 },
        draggable: false,
        level: 2,
        isBackground: true
      })
      group.add(contentBackground)

      const contentGroup = new Konva.Group({
        draggable: false,
        x: 10,
        y: 10
      })

      let y = 8
      let calcHeight = 0

      for (let index = 0; index < item.items.length; index += 2) {
        const item1 = item.items[index]
        const item2 = item.items[index + 1]
        let height1 = 0
        let height2 = 0

        height1 = drawGroupItem(contentGroup, item1, { x: 10, y }, item)
        height2 = drawGroupItem(contentGroup, item2, { x: 230, y }, item)

        const height = height1 > height2 ? height1 : height2
        calcHeight += height + 8
        y += height + 8
      }

      // 25 = padding top + padding bottom
      calcHeight += 25
      contentBackground.height(calcHeight)

      group.add(contentGroup)
      // parent.add(group)
      return { height: calcHeight, group }
    }

    /** グループが複数ある（SQL DatabaseやAzure Synapse）場合実行される */
    const drawGroupItems = (parent, item, config) => {
      if (!parent) return 0
      if (!item) return 0
      if (filterRelated.value && !item.items.some((_item) => !item.isRelated)) {
        return 0
      }

      const group = new Konva.Group({
        id: item.id,
        draggable: false,
        ...config,
        level: 2
      })

      const contentBackground = new Konva.Rect({
        x: 0,
        y: 0,
        width: 200,
        height: 300,
        fill: '#F4F7F8',
        cornerRadius: [6, 6, 6, 6],
        shadowColor: 'rgba(0,0,0,.16)',
        shadowBlur: 2,
        shadowOffset: { x: 1, y: 1 },
        draggable: false,
        level: 2,
        isBackground: true
      })

      const groupTitleBg = new Konva.Rect({
        x: 0,
        y: 0,
        width: 200,
        height: 43,
        fill: '#87A3AC',
        cornerRadius: [6, 6, 0, 0]
      })

      const groupTitleText = new Konva.Text({
        align: 'center',
        verticalAlign: 'middle',
        text: item.label,
        fontSize: fontSize,
        fontStyle: 'bold',
        fontFamily:
          "'Yu Gothic UI','Yu Gothic', 'Hiragino Kaku Gothic Pro', 'Hiragino Kaku Gothic ProN', Arial",
        fill: '#F5F5F5',
        width: 200,
        height: 43,
        draggable: false
      })

      const arrays = [contentBackground, groupTitleBg, groupTitleText]
      arrays.forEach((item) => {
        item.on('mouseover', function() {
          stage.container().style.cursor = 'grab'
        })
        item.on('mouseleave', function() {
          stage.container().style.cursor = 'default'
        })
        item.on('mousedown', function() {
          stage.container().style.cursor = 'grabbing'
        })
        item.on('mouseup', function() {
          stage.container().style.cursor = 'grab'
        })
      })

      group.add(contentBackground)
      group.add(groupTitleBg)
      group.add(groupTitleText)

      const contentGroup = new Konva.Group({
        draggable: false,
        x: 0,
        y: 43
      })

      let y = 8
      let calcHeight = 0

      for (let _item of item.items) {
        if (filterRelated.value && !_item.isRelated) continue
        const height = drawGroupItem(contentGroup, _item, { x: 10, y }, item)
        calcHeight += height + 8
        y += height + 8
      }
      calcHeight += 63
      contentBackground.height(calcHeight)
      group.add(contentGroup)
      // parent.add(group)
      return { height: calcHeight, group }
    }

    let parentBackground
    let background
    let backgroundHover
    let titleText
    let descText

    let strokeRefineKeywords
    let strokeRefineKeywordsAndHover

    /** テーブル や ビュー 等の図形を作成する */
    const drawGroupItem = (parent, data, config, parentObject) => {
      if (!parent) return 0
      if (!data) return 0
      if (filterRelated.value && !data.isRelated) return 0

      const RELATED_OPACITY = 1
      const UNRELATED_OPACITY = 0.6

      const CARD_HEIGHT = 55
      const CARD_SMALL_HEIGHT = 30

      const label = data.label

      let group = new Konva.Group({
        draggable: false,
        ...config,
        id: data.id,
        dependsOn: data.dependsOn,
        data,
        level: 3,
        visible: data.isRelated || !filterRelated.value
      })

      let height = CARD_HEIGHT

      if (
        [Category.DASHBOARD, Category.REPORT, Category.DATASET].includes(label)
      )
        height = CARD_SMALL_HEIGHT

      const opacity = data.isRelated ? RELATED_OPACITY : UNRELATED_OPACITY

      if (!parentBackground)
        parentBackground = new Konva.Rect({
          x: 0,
          y: 0,
          width: 180,
          height: height,
          fill: '#FFFFFF',
          opacity: opacity,
          cornerRadius: [4, 4, 4, 4],
          shadowColor: 'rgba(0,0,0,.16)',
          shadowBlur: 2,
          shadowOffset: { x: 1, y: 1 },
          draggable: false,
          isBackground: true,
          isBackgroundParent: true,
          visible: true,
          isHover: false,
          level: 3
        })
      else
        parentBackground = parentBackground.clone({
          height: height,
          opacity: opacity,
          dash: [4, 4],
          fill: '#FFFFFF',
          shadowColor: 'rgba(0,0,0,.16)',
          shadowBlur: 2,
          shadowOffset: { x: 1, y: 1 },
          dashEnabled: !data.isRelated
        })

      group.add(parentBackground)

      const drawGroupItemGroup = new Konva.Group({
        draggable: false,
        x: 0,
        y: 0,
        isDataCard: true
      })

      drawGroupItemGroup.on('mouseover', function(e) {
        stage.container().style.cursor = 'pointer'
        const bg = this.find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              !item.attrs.isHover &&
              !item.attrs.isBackgroundParent
          )
          .shift()
        const bgHover = this.find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              item.attrs.isHover &&
              !item.attrs.isBackgroundParent
          )
          .shift()
        if (bgHover.visible()) return

        const strokeRect = this.find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              item.attrs.isKeywords &&
              !item.attrs.isBackgroundParent
          )
          .shift()
        const strokeAndHoverRect = this.find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              item.attrs.isKeywordsAndHover &&
              !item.attrs.isBackgroundParent
          )
          .shift()

        this.parent
          .find('Text')
          .forEach((text) => text.opacity(RELATED_OPACITY))
        this.parent
          .find('Image')
          .forEach((text) => text.opacity(RELATED_OPACITY))

        if (strokeRect.attrs.visible || strokeAndHoverRect.attrs.visible) {
          // 検索キーワードでハイライトしている場合
          bgHover.visible(false)
          bg.visible(false)
          strokeRect.visible(false)
          strokeAndHoverRect.visible(true)
        } else {
          bg.visible(false)
          strokeAndHoverRect.visible(false)
          strokeRect.visible(false)
          bgHover.visible(true)
        }
        layer.batchDraw()
      })
      drawGroupItemGroup.on('mouseout', function() {
        stage.container().style.cursor = 'default'
        if (data.selected) return
        const bg = this.find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              !item.attrs.isHover &&
              !item.attrs.isBackgroundParent
          )
          .shift()
        const bgHover = this.find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              item.attrs.isHover &&
              !item.attrs.isBackgroundParent
          )
          .shift()
        const strokeRect = this.find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              item.attrs.isKeywords &&
              !item.attrs.isBackgroundParent
          )
          .shift()
        const strokeAndHoverRect = this.find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              item.attrs.isKeywordsAndHover &&
              !item.attrs.isBackgroundParent
          )
          .shift()

        const opacity =
          this.parent.attrs.data && this.parent.attrs.data.isRelated
            ? RELATED_OPACITY
            : UNRELATED_OPACITY

        this.parent.find('Text').forEach((text) => text.opacity(opacity))
        this.parent.find('Image').forEach((text) => text.opacity(opacity))

        if (strokeAndHoverRect.attrs.visible) {
          // 検索キーワードでハイライトしている場合
          bgHover.visible(false)
          bg.visible(false)
          strokeAndHoverRect.visible(false)
          strokeRect.visible(true)
        } else {
          bgHover.visible(false)
          bg.visible(true)
          strokeAndHoverRect.visible(false)
          strokeRect.visible(false)
        }
        layer.batchDraw()
      })

      drawGroupItemGroup.on('click', async function(e) {
        isShowDetail.value = true
        data.selected = true
        rootGroup
          .find('Group')
          .filter((group) => group.attrs.level === 3)
          .forEach((_group) => {
            if (!_group) return
            // group.attrs.data.selected = false
            const bg = _group
              .find('Rect')
              .filter(
                (item) =>
                  item.attrs.isBackground &&
                  item.attrs.level === 3 &&
                  !item.attrs.isHover &&
                  !item.attrs.isBackgroundParent
              )
              .shift()
            const bgHover = _group
              .find('Rect')
              .filter(
                (item) =>
                  item.attrs.isBackground &&
                  item.attrs.level === 3 &&
                  item.attrs.isHover &&
                  !item.attrs.isBackgroundParent
              )
              .shift()
            const strokeAndHoverRect = _group
              .find('Rect')
              .filter(
                (item) =>
                  item.attrs.isBackground &&
                  item.attrs.level === 3 &&
                  item.attrs.isKeywordsAndHover &&
                  !item.attrs.isBackgroundParent
              )
              .shift()
            const strokeRect = _group
              .find('Rect')
              .filter(
                (item) =>
                  item.attrs.isBackground &&
                  item.attrs.level === 3 &&
                  item.attrs.isKeywords &&
                  !item.attrs.isBackgroundParent
              )
              .shift()

            if (_group.attrs.data && data.id === _group.attrs.data.id) {
              if (
                strokeRect.attrs.visible ||
                strokeAndHoverRect.attrs.visible
              ) {
                bgHover.visible(false)
                strokeRect.visible(false)
                strokeAndHoverRect.visible(true)
              } else {
                bgHover.visible(true)
                bg.visible(false)
              }
            } else {
              if (!_group.attrs.data.isRelated) {
                _group
                  .find('Text')
                  .forEach((text) => text.opacity(UNRELATED_OPACITY))
                _group
                  .find('Image')
                  .forEach((text) => text.opacity(UNRELATED_OPACITY))
              }
              if (
                strokeAndHoverRect.attrs.visible ||
                strokeRect.attrs.visible
              ) {
                strokeRect.visible(true)
              } else if (bgHover.attrs.visible) {
                bg.visible(true)
              }
              bgHover.visible(false)
              strokeAndHoverRect.visible(false)
            }
          })
        unSelectGroups(data.id, parentObject.id)
        parentObject.open = true
        rootGroup.draw()
        detailData.value = await onDataClick(data)
      })

      // 検索結果一覧で選択したデータ（着目データ）の場合、オブジェクトの色を変更
      const fill = data.id === selectedItemId.value ? '#E5FADF' : '#FFFFFF'

      if (!background) {
        // 最初に実行される時はここを通りKonvaオブジェクト作成
        background = new Konva.Rect({
          x: 0,
          y: 0,
          width: 180,
          height: height,
          fill: fill,
          opacity: RELATED_OPACITY,
          cornerRadius: [4, 4, 4, 4],
          draggable: false,
          isBackground: true,
          isBackgroundParent: false,
          visible: !data.selected,
          isHover: false,
          level: 3,
          stroke: '#BCD2D8',
          strokeWidth: 1,
          dash: [4, 4],
          dashEnabled: !data.isRelated,
          isKeywords: false
        })
      } else {
        // 2回目以降に実行されるときはここを通り、作成済みKonvaオブジェクトをクローン生成
        background = background.clone({
          height: height,
          opacity: RELATED_OPACITY,
          dash: [4, 4],
          fill: fill,
          visible: !data.selected,
          dashEnabled: !data.isRelated
        })
      }

      // ホバー時
      backgroundHover = background.clone({
        fill: '#DFEDF2',
        visible: data.selected,
        isHover: true,
        dashEnabled: false
      })
      // 検索キーワードでハイライト時
      strokeRefineKeywords = background.clone({
        stroke: '#FFE157',
        strokeWidth: 3,
        visible: false,
        isKeywords: true
      })
      // 検索キーワードでハイライト且つ、ホバー時
      strokeRefineKeywordsAndHover = background.clone({
        stroke: '#FFE157',
        strokeWidth: 3,
        fill: '#DFEDF2',
        visible: false,
        dashEnabled: false,
        isKeywordsAndHover: true,
        opacity: RELATED_OPACITY
      })

      drawGroupItemGroup.add(background)
      drawGroupItemGroup.add(backgroundHover)
      drawGroupItemGroup.add(strokeRefineKeywords)
      drawGroupItemGroup.add(strokeRefineKeywordsAndHover)

      //select icon for item
      let textY = 12
      if (label === Category.VIEW) {
        viewIcon = viewIcon.clone({ opacity })
        drawGroupItemGroup.add(viewIcon)
        viewIcon.cache()
      } else if (label === Category.TABLE) {
        tableIcon = tableIcon.clone({ opacity })
        drawGroupItemGroup.add(tableIcon)
        tableIcon.cache()
      } else if (label === Category.DATASET) {
        datasetIcon = datasetIcon.clone({ y: 10, opacity })
        drawGroupItemGroup.add(datasetIcon)
        datasetIcon.cache()
        textY = 10
      } else if (label === Category.REPORT) {
        reportIcon = reportIcon.clone({ y: 10, opacity })
        drawGroupItemGroup.add(reportIcon)
        reportIcon.cache()
        textY = 10
      } else if (label === Category.DASHBOARD) {
        dashboardIcon = dashboardIcon.clone({ y: 10, opacity })
        drawGroupItemGroup.add(dashboardIcon)
        dashboardIcon.cache()
        textY = 10
      }

      titleText = new Konva.Text({
        x: 35,
        y: textY,
        text: data.title,
        fontSize: 12,
        lineHeight: 1.33,
        fontStyle: 'bold',
        fontFamily:
          "'Yu Gothic UI','Yu Gothic', 'Hiragino Kaku Gothic Pro', 'Hiragino Kaku Gothic ProN', Arial",
        fill: '#41434E',
        wrap: 'char',
        width: 135,
        draggable: false,
        opacity
      })

      if (data.desc) {
        descText = new Konva.Text({
          x: 35,
          y: titleText.height() + 8 + 10,
          text: data.desc,
          fontSize: 12,
          lineHeight: 1.33,
          fontStyle: 'bold',
          fontFamily:
            "'Yu Gothic UI','Yu Gothic', 'Hiragino Kaku Gothic Pro', 'Hiragino Kaku Gothic ProN', Arial",
          wrap: 'char',
          fill: '#777777',
          width: 135,
          draggable: false,
          opacity
        })
        drawGroupItemGroup.add(descText)
      }
      height =
        textY +
        titleText.height() +
        (data.desc ? descText.height() + 8 : 0) +
        10
      parentBackground.height(height)
      background.height(height)
      backgroundHover.height(height)
      strokeRefineKeywords.height(height)
      strokeRefineKeywordsAndHover.height(height)
      drawGroupItemGroup.add(titleText)
      group.add(drawGroupItemGroup)
      parent.add(group)
      parentBackground.cache()
      background.cache()
      // titleText.cache()
      // descText.cache()

      return height
    }

    watch(zoom, (val) => {
      // Konvaの縮尺値ではなく独自の値で表示したいので、「×2」し「-100」している
      zoomValue.value = Math.round(val * 2 * 100) - 100
    })

    const onZoomOutClick = () => {
      if (!stage || !layer) return
      if (zoomValue.value === 10 || zoomValue.value <= 10) return
      const val = Math.round((zoom.value - 0.05) * 100) / 100
      if (val === 0) return
      zoom.value = val
      const newScale = zoom.value
      rootGroup.scale({ x: newScale, y: newScale })
      layer.batchDraw()
    }
    const onZoomInClick = () => {
      if (!stage || !layer) return
      if (zoomValue.value === 300 || zoomValue.value >= 300) return
      const val = Math.round((zoom.value + 0.05) * 100) / 100
      if (val > 2) return
      zoom.value = val
      const newScale = zoom.value
      /*const width = originalConfigKonva.value.width * newScale
        const height = originalConfigKonva.value.height * newScale
        if (width > originalConfigKonva.value.width) {
          configKonva.value.width = width
          configKonva.value.height = height
        }*/
      rootGroup.scale({ x: newScale, y: newScale })
      layer.batchDraw()
    }

    const onShowAllChange = async () => {
      if (!stage || !layer) return
      await wait(300)
      rootGroup.removeChildren()
      contentSize.value = drawData()
      layer.batchDraw()
      onRefineKeywordStyle(refineKeywords.value)
    }

    const onKeywordClear = () => {
      refineKeywords.value = ''
    }

    const hideDetail = () => {
      isShowDetail.value = false
    }

    watch(drawer, (val) => {
      let bottomNav = document.getElementById('detailPanel')
      let mainNavWidth
      if (val) {
        root.$nextTick(() => {
          mainNavWidth = document.getElementById('mainNav').clientWidth
          bottomNav.style.width = 'calc(100% - ' + mainNavWidth + 'px)'
        })
      } else {
        mainNavWidth = 0
        bottomNav.style.width = '100%'
      }
    })

    onMounted(() => {
      root.$nextTick(async () => {
        await dataGeneration()
        if (pipelineList?.value[0]?.id) {
          await selectPipeline(pipelineList?.value[0])
        } else {
          await drawKonva()
        }
      })
    })

    watch(loadLineageRandom, () => {
      isShowDetail.value = false
      detailData.value = null
      root.$nextTick(async () => {
        await dataGeneration()
        if (pipelineList?.value[0]?.id) {
          await selectPipeline(pipelineList?.value[0])
        } else {
          await drawKonva()
        }
      })
    })

    const fitChartContent = () => {
      const container = document.getElementById('lineage-konva')
      if (!stage) return
      if (!container) return
      if (contentSize?.value?.width && contentSize?.value?.height) {
        const detailPanel = document.getElementById('detailPanel')
        const leftPanel = document.getElementById('mainNav')
        let leftPanelWidth = 0
        if (leftPanel) leftPanelWidth = leftPanel.clientWidth - 24
        let detailPanelHeight = 0
        if (isShowDetail.value) detailPanelHeight = detailPanel.clientHeight

        const _width = container.clientWidth - leftPanelWidth
        const _height = container.clientHeight - 60 - detailPanelHeight
        let wScale = _width / contentSize.value.width
        let hScale = _height / contentSize.value.height
        wScale = Math.floor(wScale * 20) / 20 // 0.05単位で切り捨て
        hScale = Math.floor(hScale * 20) / 20 // 0.05単位で切り捨て

        const scale = Math.min(wScale, hScale)
        const formatScale = Math.floor(scale * 100) / 100
        let paddingX = 0
        let paddingY = 0
        if (formatScale > 1) {
          // フィット時には、1(画面上表記: 100%)より縮小されないようにする
          zoom.value = 1
          paddingX = (_width - contentSize.value.width * zoom.value) / 2
          paddingY = (_height - contentSize.value.height * zoom.value) / 2
        } else if (0.75 > formatScale) {
          // フィット時には、0.75(画面上表記: 50%)より縮小されないようにする
          zoom.value = 0.75
          paddingX = (_width - contentSize.value.width * zoom.value) / 2
          paddingY = 0
        } else {
          zoom.value = formatScale
          paddingX = (_width - contentSize.value.width * zoom.value) / 2
          paddingY = (_height - contentSize.value.height * zoom.value) / 2
        }

        layer.x(0)
        layer.y(0)
        container.scrollTop = 0
        container.scrollLeft = 0
        if (drawer.value) rootGroup.x(paddingX + leftPanelWidth + 24)
        else rootGroup.x(paddingX)
        rootGroup.y(paddingY + 60)

        rootGroup.scale({ x: zoom.value, y: zoom.value })
      }
    }

    const onFitContentClick = () => {
      if (!stage) return
      fitChartContent()
      layer.batchDraw()
    }

    function initResizeElement() {
      var popups = document.getElementsByClassName('left-nav')
      var element = null
      var startX, startY, startWidth, startHeight
      let bottomNav = document.getElementById('detailPanel')
      let mainNavWidth = document.getElementById('mainNav').clientWidth
      bottomNav.style.width = 'calc(100% - ' + mainNavWidth + 'px)'
      for (var i = 0; i < popups.length; i++) {
        var p = popups[i]

        var right = document.getElementsByClassName('resizer-right')[0]
        right.addEventListener('mousedown', initDrag, false)
        right.parentPopup = p
      }

      function initDrag(e) {
        element = this.parentPopup

        startX = e.clientX
        startY = e.clientY
        startWidth = parseInt(
          document.defaultView.getComputedStyle(element).width,
          10
        )
        startHeight = parseInt(
          document.defaultView.getComputedStyle(element).height,
          10
        )
        document.documentElement.addEventListener('mousemove', doDrag, false)
        document.documentElement.addEventListener('mouseup', stopDrag, false)
      }

      function doDrag(e) {
        element.style.width = startWidth + e.clientX - startX + 'px'
        mainNavWidth = document.getElementById('mainNav').clientWidth
        if (bottomNav) {
          bottomNav.style.width = 'calc(100% - ' + mainNavWidth + 'px)'
        }
        console.log('dodrag')
      }

      function stopDrag() {
        document.documentElement.removeEventListener('mousemove', doDrag, false)
        document.documentElement.removeEventListener('mouseup', stopDrag, false)
        mainNavWidth = document.getElementById('mainNav').clientWidth
        if (bottomNav) {
          bottomNav.style.width = 'calc(100% - ' + mainNavWidth + 'px)'
        }
      }
    }

    const selectPipeline = async (item) => {
      loading.value = true
      pipelineSelectedId.value = item.id
      await fetchData(item.id)
      await drawKonva()
    }

    const drawKonva = async () => {
      loading.value = true
      await wait(1000)
      initResizeElement()

      Konva.autoDrawEnabled = false

      const container = document.getElementById('lineage-konva')
      if (container) {
        originalConfigKonva.value.width = window.innerWidth - 64
        originalConfigKonva.value.height = container.clientHeight
        configKonva.value.width = (window.innerWidth - 64) * 2.5
        configKonva.value.height = container.clientHeight * 2.5
        stage = stageRef.value.getStage()
        stage.destroyChildren()
        layer = null
        gridLayer = null
        loadGridLine()

        const loadImage = (url, width, height) => {
          return new Promise((resolve, reject) => {
            try {
              Konva.Image.fromURL(url, (image) => {
                image.setAttrs({
                  x: 12,
                  y: 10,
                  width: width,
                  height: height,
                  scaleX: 0.5,
                  scaleY: 0.5
                })
                resolve(image)
              })
            } catch (e) {
              console.log(e)
              resolve(null)
            }
          })
        }

        const images = await Promise.all([
          loadImage(require(`@/assets/icons/table.svg`), 34, 28),
          loadImage(require(`@/assets/icons/view.svg`), 34, 30),
          loadImage(require(`@/assets/icons/dataset.svg`), 36, 30),
          loadImage(require(`@/assets/icons/report.svg`), 24, 30),
          loadImage(require(`@/assets/icons/dashboard.svg`), 36, 36)
        ])

        if (images && images.length) {
          tableIcon = images[0]
          viewIcon = images[1]
          datasetIcon = images[2]
          reportIcon = images[3]
          dashboardIcon = images[4]

          if (viewIcon) viewIcon.cache()
          if (tableIcon) tableIcon.cache()
          if (datasetIcon) datasetIcon.cache()
          if (reportIcon) reportIcon.cache()
          if (dashboardIcon) dashboardIcon.cache()
        }

        const _contentSize = loadData()
        contentSize.value = _contentSize
        await fitChartContent()
        stage.batchDraw()
        loading.value = false
      }
    }

    const selectLocationItem = async (item, parent) => {
      isShowDetail.value = true
      unSelectGroups(item.id, parent.id)
      item.selected = true
      if (!rootGroup) return

      // 全てホバーなしにする（ホバーの初期化）
      rootGroup
        .find('Group')
        .filter((group) => group.attrs.level === 3 && group.attrs.data)
        .forEach((_group) => {
          if (!_group) return
          const bg = _group
            .find('Rect')
            .filter(
              (item) =>
                item.attrs.isBackground &&
                item.attrs.level === 3 &&
                !item.attrs.isHover
            )
            .shift()
          const bgHover = _group
            .find('Rect')
            .filter(
              (item) =>
                item.attrs.isBackground &&
                item.attrs.level === 3 &&
                item.attrs.isHover
            )
            .shift()
          bgHover.visible(false)
          bg.visible(true)
        })

      // 選択したデータをホバー状態にする
      const parentGroup = rootGroup
        .find('Group')
        .filter(
          (group) => group.attrs.level === 2 && group.attrs.id === parent.id
        )
        .shift()
      if (parentGroup) {
        const _group = parentGroup
          .find('Group')
          .filter(
            (group) =>
              group.attrs.level === 3 &&
              group.attrs.data &&
              group.attrs.data.id === item.id
          )
          .shift()
        if (_group) {
          const bg = _group
            .find('Rect')
            .filter(
              (item) =>
                item.attrs.isBackground &&
                item.attrs.level === 3 &&
                !item.attrs.isHover
            )
            .shift()
          const bgHover = _group
            .find('Rect')
            .filter(
              (item) =>
                item.attrs.isBackground &&
                item.attrs.level === 3 &&
                item.attrs.isHover
            )
            .shift()
          bgHover.visible(true)
          bg.visible(false)
        }
      }
      const itemGroup = rootGroup
        .find('Group')
        .filter((group) => group.attrs.data && group.attrs.data.id === item.id)
        .shift()
      if (!itemGroup) return
      const secondParent = itemGroup.parent.parent
      const primaryParent = itemGroup.parent.parent.parent.parent
      const x =
        rootGroup.attrs.originX +
        secondParent.x() +
        primaryParent.x() +
        itemGroup.x()
      const y =
        rootGroup.attrs.originY +
        secondParent.y() +
        primaryParent.y() +
        itemGroup.y() +
        43 +
        43

      const container = document.getElementById('lineage-konva')
      if (!container) return

      container.scrollTo({
        top: 0,
        left: 0
      })

      const detailPanel = document.getElementById('detailPanel')

      const leftPanel = document.getElementById('mainNav')
      let leftPanelWidth = 0
      if (leftPanel) leftPanelWidth = leftPanel.clientWidth - 24
      let detailPanelHeight = 0
      if (isShowDetail.value) detailPanelHeight = detailPanel.clientHeight
      if (!detailPanelHeight) detailPanelHeight = 267
      const _width = container.clientWidth - leftPanelWidth
      const _height = container.clientHeight - detailPanelHeight
      const centerPoint = {
        x: _width / 2,
        y: _height / 2
      }

      // 100: 1/2 of item width
      let itemMinusWidth = 100
      if (zoom.value >= 1) {
        itemMinusWidth = 200
      }
      const minus = {
        x: x * zoom.value - centerPoint.x - itemMinusWidth * zoom.value,
        y: y * zoom.value - centerPoint.y
      }
      layer.x(0)
      layer.y(0)
      // let _zoom = zoom.value
      // _zoom -= 0.2

      rootGroup.x(rootGroup.attrs.originX - minus.x)
      rootGroup.y(rootGroup.attrs.originY - minus.y)
      layer.batchDraw()
      detailData.value = await onDataClick(item)
    }

    const onRefineKeywordStyle = (searchKeyword) => {
      layer.clear()
      const dataCardGroup = rootGroup
        .find('Group')
        .filter((item) => item.attrs.isDataCard)
      dataCardGroup.forEach((e) => {
        const group = e.parent
        const nomalRect = e
          .find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              !item.attrs.isKeywords
          )
          .shift()
        const hoverReact = e
          .find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              item.attrs.isHover &&
              !item.attrs.isBackgroundParent
          )
          .shift()
        const strokeRect = e
          .find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              item.attrs.isKeywords
          )
          .shift()

        const strokeAndHoverRect = e
          .find('Rect')
          .filter(
            (item) =>
              item.attrs.isBackground &&
              item.attrs.level === 3 &&
              item.attrs.isKeywordsAndHover &&
              !item.attrs.isBackgroundParent
          )
          .shift()

        if (searchKeyword === null || searchKeyword === '') {
          nomalRect.visible(true)
          strokeRect.visible(false)
          if (group.attrs.data && group.attrs.data.selected) {
            nomalRect.visible(false)
            strokeAndHoverRect.visible(false)
            hoverReact.visible(true)
          }
          strokeAndHoverRect.visible(false)
          return
        }

        const textCollection = e.find('Text')
        if (textCollection && textCollection.length === 2) {
          if (
            textCollection[1].attrs.text.indexOf(searchKeyword) > -1 ||
            textCollection[0].attrs.text.indexOf(searchKeyword) > -1
          ) {
            nomalRect.visible(false)
            strokeRect.visible(true)
            if (group.attrs.data && group.attrs.data.selected) {
              nomalRect.visible(false)
              hoverReact.visible(false)
              strokeAndHoverRect.visible(true)
            }
            if (strokeRect.attrs.dashEnabled) {
              strokeRect.dashEnabled(false)
              // TODO: 関連データ以外のデータカードの周りの点線が微妙に残ってしまうのを解消したい
              // console.log(e.parent.find('Rect').shift())
              // e.parent.find('Rect').shift().dashEnabled(false)
            }
          } else {
            nomalRect.visible(true)
            strokeRect.visible(false)
            strokeRect.dashEnabled(true)
          }
        } else {
          if (textCollection[0].attrs.text.indexOf(searchKeyword) > -1) {
            nomalRect.visible(false)
            strokeRect.visible(true)
            if (strokeRect.attrs.dashEnabled) {
              strokeRect.dashEnabled(false)
            }
            if (group.attrs.data && group.attrs.data.selected) {
              nomalRect.visible(false)
              hoverReact.visible(false)
              strokeAndHoverRect.visible(true)
            }
          } else {
            nomalRect.visible(true)
            strokeRect.visible(false)
            strokeRect.dashEnabled(true)
          }
        }
      })
      rootGroup.draw()
    }

    const onDataClick = async (data) => {
      if (!data) return

      let res
      switch (data.label) {
        case Category.TABLE:
          res = await $axios.$get(`/tables/${data.id}`)
          if (res?.data) {
            const item = res.data
            item.id = data.id
            item.label = Category.TABLE
            item.name = item.values?.table?.name || ''
            item.logicalName = item.values?.table?.logicalName || ''
            item.locationName = item.values?.location.name || ''
            item.schemaName = item.values?.schema.name || ''
            return item
          }
          return null
        case Category.VIEW:
          res = await $axios.$get(`/views/${data.id}`)
          if (res?.data) {
            const item = res.data
            item.id = data.id
            item.label = Category.VIEW
            item.name = item.values?.view?.name || ''
            item.logicalName = item.values?.view?.logicalName || ''
            item.locationName = item.values?.location.name || ''
            item.schemaName = item.values?.schema.name || ''
            return item
          }
          return null
        case Category.DASHBOARD:
          res = await $axios.$get(`/dashboards/${data.id}`)
          if (res.data?.values) {
            const item = res.data
            item.id = data.id
            item.label = Category.DASHBOARD
            item.name = item.values?.dashboard?.dashboardName || ''
            item.logicalName = item.values?.dashboard?.logicalName || ''
            item.powerbiUrl = item.values?.dashboard?.powerbiUrl || ''
            item.schemaName =
              item.values?.dashboard?.workspace?.workspaceName || ''
            item.locationName = item.values?.locationName || ''
            return item
          }
          return null
        case Category.REPORT:
          res = await $axios.$get(`/reports/${data.id}`)
          if (res.data?.values) {
            const item = res.data
            item.id = data.id
            item.label = Category.REPORT
            item.name = item.values?.report?.reportName || ''
            item.logicalName = item.values?.report?.logicalName || ''
            item.powerbiUrl = item.values?.report?.powerbiUrl || ''
            item.schemaName =
              item.values?.report?.workspace?.workspaceName || ''
            item.locationName = item.values?.locationName || ''
            return item
          }
          return null
        case Category.DATASET:
          res = await $axios.$get(`/datasets/${data.id}`)
          if (res.data?.values) {
            const item = res.data
            item.id = data.id
            item.label = Category.DATASET
            item.name = item.values?.dataset?.datasetName || ''
            item.logicalName = item.values?.dataset?.logicalName || ''
            item.powerbiUrl = item.values?.dataset?.powerbiUrl || ''
            item.schemaName =
              item.values?.dataset?.workspace?.workspaceName || ''
            item.locationName = item.values?.locationName || ''
            return item
          }
          return null
        default:
          return null
      }
    }

    const onShowDetailClick = async (data) => {
      if (!data) return
      await addShowItems(data)
      await setSelectedItem(data)
      await emit('onShowDetailClick')
      await fetchPipelines(data.id)
    }

    const refineKeywords = ref('')
    watch(refineKeywords, (val) => {
      onRefineKeywordStyle(val)
    })

    const nameRef = ref(null)
    const nameWidthDiff = ref(null)
    const nameColsMd = ref(2)
    const spaceColsMd = ref(6)

    const logicalNameRef = ref(null)
    const logicalNameWidthDiff = ref(null)
    const logicalNameColsMd = ref(2)

    watch(isShowDetail, (val) => {
      if (val) {
        nextTick(() => {
          if (nameRef.value) {
            nameWidthDiff.value =
              nameRef.value.scrollWidth / nameRef.value.offsetWidth
          }
          if (logicalNameRef.value) {
            logicalNameWidthDiff.value =
              logicalNameRef.value.scrollWidth /
              logicalNameRef.value.offsetWidth
          }

          if (1.0 >= nameWidthDiff.value) {
            nameColsMd.value = 2
          } else if (1.0 < nameWidthDiff.value && 1.5 >= nameWidthDiff.value) {
            nameColsMd.value = 3
          } else if (1.5 < nameWidthDiff.value && 2.0 >= nameWidthDiff.value) {
            nameColsMd.value = 4
          } else if (2.0 < nameWidthDiff.value && 2.5 >= nameWidthDiff.value) {
            nameColsMd.value = 5
          } else {
            nameColsMd.value = 6
          }

          if (1.0 >= logicalNameWidthDiff.value) {
            logicalNameColsMd.value = 2
            spaceColsMd.value = 10 - nameColsMd.value
          } else if (
            1.0 < logicalNameWidthDiff.value &&
            1.5 >= logicalNameWidthDiff.value
          ) {
            if (nameColsMd.value <= 5) {
              logicalNameColsMd.value = 3
              spaceColsMd.value = 9 - nameColsMd.value
            } else {
              logicalNameColsMd.value = 2
              spaceColsMd.value = 10 - nameColsMd.value
            }
          } else if (
            1.5 < logicalNameWidthDiff.value &&
            2.0 >= logicalNameWidthDiff.value
          ) {
            if (nameColsMd.value <= 4) {
              logicalNameColsMd.value = 4
              spaceColsMd.value = 8 - nameColsMd.value
            } else if ((nameColsMd.value = 5)) {
              logicalNameColsMd.value = 3
              spaceColsMd.value = 4
            } else {
              logicalNameColsMd.value = 2
              spaceColsMd.value = 10 - nameColsMd.value
            }
          } else if (
            2.0 < logicalNameWidthDiff.value &&
            2.5 >= logicalNameWidthDiff.value
          ) {
            if (nameColsMd.value <= 3) {
              logicalNameColsMd.value = 5
              spaceColsMd.value = 7 - nameColsMd.value
            } else if ((nameColsMd.value = 4)) {
              logicalNameColsMd.value = 4
              spaceColsMd.value = 4
            } else if ((nameColsMd.value = 5)) {
              logicalNameColsMd.value = 3
              spaceColsMd.value = 4
            } else {
              logicalNameColsMd.value = 2
              spaceColsMd.value = 10 - nameColsMd.value
            }
          }
        })
      }
    })

    return {
      drawer,
      pipelineList,
      pipelineSelectedId,
      selectedItemId,
      selectedItemType,
      lineage,
      groups,
      configKonva,
      stageRef,
      loading,
      filterRelated,
      zoom,
      isShowDetail,
      mdiClose,
      onZoomOutClick,
      onZoomInClick,
      onShowAllChange,
      hideDetail,
      selectPipeline,
      onFitContentClick,
      selectLocationItem,
      onRefineKeywordStyle,
      refineKeywords,
      onKeywordClear,
      zoomValue,
      nameRef,
      nameWidthDiff,
      nameColsMd,
      spaceColsMd,
      logicalNameRef,
      logicalNameWidthDiff,
      logicalNameColsMd,
      dataGeneration,
      fetchData,
      onDataClick,
      onShowDetailClick,
      drawKonva,
      detailData,
      Category,
      setSelectedItem,
      addShowItems,
      fetchPipelines,
      fetchLineage
    }
  }
})
</script>
<style lang="stylus" scoped>
@import '@/assets/stylus/components/result/Tabs/DetailTab.styl'
@import '@/assets/stylus/components/result/Tabs/LineageTab.styl'
#lineage-container
  position relative
</style>

<style scoped>
.progress-container {
  width: 100%;
  text-align: center;
  position: absolute;
  z-index: 9;
  top: 48%;
}
.progress {
  background: rgba(245, 245, 245, 1);
  justify-content: flex-start;
  border-radius: 100px;
  align-items: center;
  padding: 0 5px;
  display: flex;
  height: 20px;
  width: 500px;
  margin: 0 auto;
}

.progress-value {
  animation: load 5s normal forwards;
  box-shadow: 0 10px 20px -10px #54acc8;
  border-radius: 100px;
  background: #54acc8;
  height: 15px;
  width: 0;
}

@keyframes load {
  0% {
    width: 20%;
  }
  100% {
    width: 70%;
  }
}
</style>
