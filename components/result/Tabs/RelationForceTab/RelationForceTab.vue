<template lang="pug">
  div(id="lineage-container")
    div(id="container")
    div(class="actions")
      //-div(class="group filter" style="border:1px solid #54ACC8")
      //-  v-checkbox(v-model="filterRelated" label="関連データのみ表示" @change="onShowAllChange")
      div(class="group search" style="padding-right: 4px")
        img(:src="require('@/assets/icons/result_search.svg')" class="search-icon" width="18px")
        div(class="input-box")
          input(class="mr-1" placeholder="絞り込みキーワード ")
          img(:src="require('@/assets/icons/result_search_clear.svg')" class="action-btn" width="16px" )
      div(class="group zoom")
        v-btn(icon @click="onZoomOutClick" width='30px' height='30px')
          img(:src="require('@/assets/icons/minus.svg')" class="action-btn" width="14px")
        span(class="zoom-value-text") {{ zoomValue }}% 
        v-btn(icon @click="onZoomInClick" width='30px' height='30px')
          img(:src="require('@/assets/icons/plus.svg')" class="action-btn" width="14px")
        v-divider(:vertical="true" class="zoom-divider")
        v-btn(icon @click="onFitContentClick" width='30px' height='30px')
          img(:src="require('@/assets/icons/fullscreen.svg')" class="action-btn" width="21px")

</template>

<script>
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  computed,
  nextTick,
} from '@nuxtjs/composition-api'
export default {
  setup() {
    let width = window.innerWidth
    let height = window.innerHeight
    let padding = 25
    let line = null
    let rootGroup = null
    let layer = null
    const zoomValue = ref(100)

    const loadData = () => {
      let stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height,
      })
      const background = new Konva.Rect({
        width: width,
        height: height,
        x: 0,
        y: 0,
        fill: '#f5f5f5',
      })

      layer = new Konva.Layer()
      layer.add(background)

      for (let i = 0; i < (width * 2) / padding; i++) {
        if (!line)
          line = new Konva.Line({
            points: [
              Math.round(i * padding) + 0.5,
              5,
              Math.round(i * padding) + 0.5,
              height,
            ],
            stroke: '#DEDFE6',
            strokeWidth: 3,
            lineCap: 'round',
            dash: [0.001, 25, 0.001, 25],
          })
        else
          line = line.clone({
            points: [
              Math.round(i * padding) + 0.5,
              5,
              Math.round(i * padding) + 0.5,
              height,
            ],
          })
        layer.add(line)
      }

      rootGroup = new Konva.Group({
        x: 500,
        y: 300,
        scaleX: 1,
        scaleY: 1,
        draggable: true,
      })

      const circleCenter = new Konva.Circle({
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
        fill: '#CCFFCC',
        shadowColor: 'black',
        shadowBlur: 2,
        shadowOffset: { x: 2, y: 2 },
        shadowOpacity: 0.2,
        stroke: '#fff',
        strokeWidth: 2,
      })
      const circleCenterText = new Konva.Text({
        text: `Report 1`,
        x: -10,
        y: -5,
        radius: 70,
        fill: '#000',
        fontSize: 14,
      })
      const circleCenterImg = new Konva.Image({
        x: -40,
        y: -10,
        width: 15,
        height: 20,
      })
      const imageObj1 = new Image()
      imageObj1.onload = function () {
        circleCenterImg.image(imageObj1)
        layer.draw()
      }
      imageObj1.src = '/_nuxt/assets/icons/report.svg'
      // __________circle1___________

      const circle1 = circleCenter.clone({
        x: 120,
        y: 150,
        fill: '#fff',
      })
      const textReport = new Konva.Text({
        x: 80,
        y: 60,
        text: 'Power BI Report',
      })
      const groupReport2 = new Konva.Group({
        x: 110,
        y: 110,
      })
      const reportImg = new Konva.Image({
        x: -20,
        y: -3,
        width: 15,
        height: 20,
      })
      const imageObjReport = new Image()
      imageObjReport.onload = function () {
        reportImg.image(imageObjReport)
        layer.draw()
      }
      imageObjReport.src = '/_nuxt/assets/icons/report.svg'

      groupReport2.add(
        new Konva.Text({
          text: 'Report 2',
        }),
        reportImg
      )
      const groupReport4 = groupReport2.clone({
        x: 110,
        y: 140,
      })
      groupReport4.children[0].text('Report 4')
      groupReport4.children[1].image(imageObjReport)

      const groupReport6 = groupReport2.clone({
        x: 110,
        y: 170,
      })
      groupReport6.children[0].text('Report 6')
      groupReport6.children[1].image(imageObjReport)
      // --------circle2----------------------------------------------------------------------
      const circle2 = circle1.clone({
        x: -120,
        y: 150,
        fill: '#fff',
      })
      const textSources = new Konva.Text({
        x: -170,
        y: 60,
        text: 'Power BI Sources',
      })
      const sourcesImg = new Konva.Image({
        x: -20,
        y: -5,
        width: 15,
        height: 20,
      })
      const imageObjSources = new Image()
      imageObjSources.onload = function () {
        sourcesImg.image(imageObjSources)
        layer.draw()
      }
      imageObjSources.src = '/_nuxt/assets/icons/dataset.svg'

      const groupSources = new Konva.Group({
        x: -150,
        y: 120,
      })
      groupSources.add(
        new Konva.Text({
          text: 'Data Sources 2',
        }),
        sourcesImg
      )

      const groupSources1 = groupSources.clone({
        x: -150,
        y: 150,
      })
      groupSources1.children[0].text('Data Sources 4')
      groupSources1.children[1].image(imageObjSources)

      const groupSources2 = groupSources.clone({
        x: -150,
        y: 180,
      })
      groupSources2.children[0].text('Data Sources 6')
      groupSources2.children[1].image(imageObjSources)

      /// -----circle3-----------------------------------------
      const circle3 = circle1.clone({
        x: -190,
        y: -30,
        fill: '#fff',
      })
      const textPipelines = new Konva.Text({
        x: -220,
        y: -115,
        text: 'ADF Pipelines',
      })

      /// -----circle4-----------------------------------------

      const groupCircles4 = new Konva.Group({
        x: 0,
        y: 0,
        draggable: true,
      })

      const circle4 = circle1.clone({
        x: 180,
        y: -30,
      })

      const textTableView = new Konva.Text({
        x: 150,
        y: -110,
        text: 'Tables, Views',
      })

      const groupTextTableView = new Konva.Group({
        x: 150,
        y: -60,
      })
      const TableImg = new Konva.Image({
        x: -25,
        y: -5,
        width: 15,
        height: 15,
      })
      const imageObjTable = new Image()
      imageObjTable.onload = function () {
        TableImg.image(imageObjTable)
        layer.draw()
      }
      imageObjTable.src =
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNi40NjciIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNi40NjcgMTQiPgogIDxnIGlkPSLjgrDjg6vjg7zjg5dfMTI3NCIgZGF0YS1uYW1lPSLjgrDjg6vjg7zjg5cgMTI3NCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIyOTIuNDI4IDg2NjIuMDAxKSI+CiAgICA8cGF0aCBpZD0i5YmN6Z2i44Kq44OW44K444Kn44Kv44OI44Gn5Z6L5oqc44GNXzEwIiBkYXRhLW5hbWU9IuWJjemdouOCquODluOCuOOCp+OCr+ODiOOBp+Wei+aKnOOBjSAxMCIgZD0iTTIyNzAuNzczLDIzLjI1MWgtOS4zNzlWMTBoMTUuMTQ0djMuMzA3Yy0uMDU2LDAtLjExNi0uMDA3LS4xNzgtLjAwN2gtLjc2OVYxMS44OTJoLTMuNzg1VjEzLjNoLS45NDdWMTEuODkyaC0zLjc4NnYyLjg0aDEuMjI1YTIuMTgyLDIuMTgyLDAsMCwwLS4xMzguNzY3YzAsLjA1NywwLC4xMTguMDA3LjE3OWgtMS4wOTR2Mi44MzloMy43di45NDdoLTMuN1YyMi4zaDMuN3YuOTQ1bDAsMFptLTguNDMyLTMuNzg2VjIyLjNoMy43ODV2LTIuODRabTAtMy43ODZ2Mi44MzloMy43ODVWMTUuNjc4Wm0wLTMuNzg2djIuODRoMy43ODV2LTIuODRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMS4wMzQgLTg2NzIpIiBmaWxsPSIjNDNhNWM0Ii8+CiAgICA8cGF0aCBpZD0i5ZCI5L2TXzE3IiBkYXRhLW5hbWU9IuWQiOS9kyAxNyIgZD0iTTI4MDIuODk0LDMzNy41VjMzMmgtMS41YTEuNSwxLjUsMCwwLDEsMC0zaDZhMS41LDEuNSwwLDEsMSwwLDNoLTEuNXY1LjVhMS41LDEuNSwwLDAsMS0zLDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTAwIC04OTg3KSIgZmlsbD0iIzQzYTVjNCIvPgogIDwvZz4KPC9zdmc+Cg=='

      groupTextTableView.add(
        new Konva.Text({
          text: 'SAP_MMT_FL_EK...',
          fontSize: 10,
        }),
        TableImg
      )

      const groupTextTableView2 = new Konva.Group({
        x: 160,
        y: -35,
        draggable: true,
      })
      const ViewImg = new Konva.Image({
        x: -25,
        y: -5,
        width: 15,
        height: 15,
      })
      const imageObjView = new Image()
      imageObjView.onload = function () {
        ViewImg.image(imageObjView)
        layer.draw()
      }
      imageObjView.src = '/_nuxt/assets/icons/view.svg'

      groupTextTableView2.add(
        new Konva.Text({
          text: 'SAP_SDT_FL',
          fontSize: 10,
        }),
        ViewImg
      )
      const groupTextTableView3 = groupTextTableView2.clone({
        x: 150,
        y: -10,
      })
      groupTextTableView3.children[0].text('SAP_SDT_FL_VB...')
      groupTextTableView3.children[1].image(imageObjView)


      groupCircles4.add(circle4, textTableView, groupTextTableView, groupTextTableView2, groupTextTableView3)

      const circle5 = circle1.clone({
        x: 0,
        y: -180,
        fill: '#fff',
      })
      const textTags = new Konva.Text({
        x: -20,
        y: -265,
        text: 'Tags',
      })
      const circle1layer1 = new Konva.Label({
        x: -25,
        y: -220,
        draggable: true,
      })

      circle1layer1.add(
        new Konva.Tag({
          fill: '#CCFFCC',
          cornerRadius: 10,
        }),
        new Konva.Text({
          text: '#tienthoa',
          padding: 5,
        })
      )
      const circle1layer2 = circle1layer1.clone({
        x: -25,
        y: -190,
      })
      const circle1layer3 = circle1layer1.clone({
        x: -25,
        y: -160,
      })

      const groupLinevsNode = new Konva.Group({
        x: 0,
        y: -155,
        draggable: true,
      })
      const redLine = new Konva.Line({
        points: [0, 50, 0, 80],
        stroke: '#0000CC',
        strokeWidth: 4,
        lineCap: 'round',
        lineJoin: 'round',
      })
      const node1 = new Konva.Circle({
        x: 0,
        y: 85,
        fill: '#0000CC',
        radius: 5,
        shadowColor: 'transparent',
        draggable: true,
      })
      const node2 = node1.clone({
        x: 0,
        y: 45,
        fill: '#0000CC',
      })
      groupLinevsNode.add(redLine, node1, node2)

      const groupLinevsNode1 = groupLinevsNode.clone({
        x: -40,
        y: 0,
        width: 20,
        height: 20,
        rotation: 90,
        offset: { x: 10, y: 10 },
      })
      const groupLinevsNode2 = groupLinevsNode.clone({
        x: 90,
        y: -10, 
        width: 50,
        height: 10,
        rotation: 75,
        offset: { x: 0, y: 65 },
      })
      const groupLinevsNode3 = groupLinevsNode2.clone({
        x: -60,
        y: 75,
        rotation: 50,
      })
      const groupLinevsNode4 = groupLinevsNode2.clone({
        x: 60,
        y: 75,
        rotation: 135,
      })
      rootGroup.add(
        circleCenter,
        circleCenterText,
        circleCenterImg,
        circle1,
        textReport,
        groupReport2,
        groupReport4,
        groupReport6,
        circle2,
        textSources,
        groupSources,
        groupSources1,
        groupSources2,
        circle3,
        textPipelines,
        groupCircles4,
        circle5,
        textTags,
        circle1layer1,
        circle1layer2,
        circle1layer3,
        groupLinevsNode,
        groupLinevsNode1,
        groupLinevsNode2,
        groupLinevsNode3,
        groupLinevsNode4
      )
      layer.add(rootGroup)
      stage.add(layer)

      layer.on('click', (e) => {
        console.log('groupSerial1', groupLinevsNode4)
      })
    }
    onMounted(() => {
      loadData()
    })
    const onZoomOutClick = () => {
      if (zoomValue.value <= 10) {
      } else {
        zoomValue.value = zoomValue.value - 10
        rootGroup.scale({ x: zoomValue.value / 100, y: zoomValue.value / 100 })
        layer.batchDraw()
      }
    }
    const onZoomInClick = () => {
      if (zoomValue.value >= 300) {
      } else {
        zoomValue.value = zoomValue.value + 10
        rootGroup.scale({ x: zoomValue.value / 100, y: zoomValue.value / 100 })
        layer.batchDraw()
      }
    }
    const onFitContentClick = () => {}
    return { onZoomOutClick, zoomValue, onZoomInClick, onFitContentClick }
  },
}
</script>

<style lang="stylus" scoped>
@import '@/assets/stylus/components/result/Tabs/DetailTab.styl'
@import '@/assets/stylus/components/result/Tabs/LineageTab.styl'
#lineage-container
  position relative
</style>
