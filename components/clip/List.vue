<template lang="pug">
  v-container(fluid class="px-8")
    .title-list クリップ一覧
    v-data-table(
      v-if="true"
      no-data-text="データがありません。"
      class="elevation-0"
      :items="dataListDisplay"
      id="clip-table"
      style="background-color:#F4F6F7; width:100%; height:calc(100vh - 232px); overflow-y:auto"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :items-per-page="10"
      :page.sync="page"
      hide-default-footer
      hide-default-header
      @sorted="sortedTable"
    )
      template(v-slot:header)
        thead
          tr
            th(class="pl-4 pr-0"
              style="width: 4%"
              )
              v-checkbox(
                v-model="selectAll"
                :indeterminate="isAllSelected"
                @change="onSelectAll"
                hide-details
                )
            th(class="pl-4 pr-0"
              style="width: 20%"
              )
              span データ名

            th(class="pl-4 pr-0"
              style="width: 16%"
              )
              span 論理名

            th(class="pl-4 pr-0"
              style="width: 16%"
              )
              span ロケーション
            th(class="pl-4 pr-0"
              style="width: 16%"
              )
              span ワークスペース または<br>データベース / スキーマ
            th(class="pl-4 pr-0"
              style="width: 28%"
            )
              span クリップ説明
      template(v-slot:body="{ items }")
        tbody
          tr(
            v-for="(item, index) in items"
            :key="index"
            :class="['row-flex', item.type === 'folder' ? 'row-folder' :'', 'draggable', item.selected ? 'selected': '']"
            :id="`row-${index}`"
            draggable="true"
            @dragstart="(e) => dragStart(e, item)"
            @dragenter="dragEnter"
            @dragover="dragOver"
            @dragleave="dragLeave"
            @drop="dragDrop"
            @dragend="dragEnd"
          )
            // folders
            td(v-if="item.type === 'folder'" class="pl-4"
              style="border-top-left-radius: 4px;")
              v-checkbox(:value="item.selected" @change="(val) => onCheckBoxChange(val, item)")
            td(v-if="item.type === 'folder'" class="pa-0"
              style="border-top-left-radius: 4px; display: table-cell" colspan="5"
              @click="() => onRowClick(item)")
              v-row(class="pl-4" style="flex-wrap: nowrap;")
                img(:src="require('@/assets/icons/clip_folder.svg')")
                span.text-truncate.d-inline-block(class="ml-2"
                  style="font-weight: bold; font-size: 14px; color: #41434E;" v-tooltip="item.name") {{ item.name }}

            //clip data list
            td(v-if="item.type !== 'folder'" class="pl-4"
              style="border-top-left-radius: 4px;")
              v-checkbox(:value="item.selected" @change="(val) => onCheckBoxChange(val, item)")
            td(v-if="item.type !== 'folder'" class="pa-0"
              style="border-top-left-radius: 4px; display: table-cell"
              @click="() => onRowClick(item)")
              v-row(class="pl-4" style="flex-wrap: nowrap;")
                img(v-if="item.label === Category.TABLE" :src="require('@/assets/icons/table.svg')")
                img(v-if="item.label === Category.VIEW" :src="require('@/assets/icons/view.svg')")
                img(v-if="item.label === Category.DASHBOARD" :src="require('@/assets/icons/dashboard.svg')")
                img(v-if="item.label === Category.REPORT" :src="require('@/assets/icons/report.svg')")
                img(v-if="item.label === Category.DATASET" :src="require('@/assets/icons/dataset.svg')")
                span.text-truncate.d-inline-block(class="ml-2"
                  style="font-weight: bold; font-size: 14px; color: #41434E;" v-tooltip="item.name") {{ item.name }}
                v-spacer
                div.has-bar(:id="`menu_bar_${index}`")
                  v-menu(origin="center center" transition="scale-transition" :offset-x="true")
                    template(v-slot:activator="{ on, attrs }")
                      v-icon(color="#777777" class="bar" v-on="on" v-bind="attrs") mdi-dots-horizontal
                    v-list.clip-menu-action
                      .clip-item(@click="onMove") 移動
                      v-divider
                      .clip-item(@click="onUnclip") クリップ解除
                      v-divider(v-if="(!isMultipleSelected && item.selected) || !item.selected")
                      .clip-item(v-if="(!isMultipleSelected && item.selected) || !item.selected" @click="onClipDescEdit") クリップ説明編集
            td(v-if="item.type !== 'folder'" class="pa-0"
              style="border-top-left-radius: 4px; display: table-cell"
              @click="() => onRowClick(item)")
              span.text-truncate.d-inline-block(class="pl-4"
                style="width: 90%; font-weight: regular; font-size: 14px; color: #41434E;" v-tooltip="item.logicalName") {{ item.logicalName }}
            td(v-if="item.type !== 'folder'" class="pa-0"
              style="border-top-left-radius: 4px; display: table-cell"
              @click="() => onRowClick(item)")
              span.text-truncate.d-inline-block(class="pl-4"
                style="width: 90%; font-weight: regular; font-size: 14px; color: #41434E;" v-tooltip="item.location") {{ item.location }}
            td(v-if="item.type !== 'folder'" class="pa-0"
              style="border-top-left-radius: 4px; display: table-cell"
              @click="() => onRowClick(item)")
              span.text-truncate.d-inline-block(class="ml-4"
                style="width: 90%; font-weight: regular; font-size: 14px; color: #41434E;" v-tooltip="item.wsOrDbScm") {{ item.wsOrDbScm }}
            td(v-if="item.type !== 'folder'" class="pa-0"
              style="border-top-left-radius: 4px; display: table-cell"
              @click="() => onRowClick(item)")
              span.text-truncate.d-inline-block(class="pl-4"
                style="width: 90%; font-weight: regular; font-size: 14px; color: #41434E;" v-tooltip="item.clipDesc") {{ item.clipDesc }}
</template>
<script>
import {computed, defineComponent, ref, watch} from '@nuxtjs/composition-api'
import {Category} from "~/constants/Category";

export default defineComponent({
  props: {
    dataList: { type: Array, default: [] }
  },
  setup(props, { emit }) {
    const sortBy = ref(null)
    const sortDesc = ref(null)
    const page = ref(null)
    const selectAll = ref(false)
    const itemIsHover = ref(null)
    const dataListDisplay = computed(() => props.dataList)

    let dragSrcEl = null
    let dragSrcElId = null
    let dragDestElId = null

    const isAllSelected = computed(() => {
      if (!dataListDisplay.value || !dataListDisplay.value.length) return false
      if (dataListDisplay.value.every((item) => !item.selected)) return false
      return dataListDisplay.value.some((item) => !item.selected)
    })

    const isMultipleSelected = computed(
      () => dataListDisplay.value.filter((item) => item.selected).length > 1
    )
    const rowHover = (item) => {
      itemIsHover.value = item
    }
    const rowBlur = () => {
      itemIsHover.value = null
    }
    const onClipDescEdit = () => {}
    const onMove = () => {}
    const onUnclip = () => {}
    const sortedTable = (event) => {}

    let isMultipleDrag = false
    let multipleTargetIndex = []

    const handleDragMultipleStart = (e, item) => {
      multipleTargetIndex = dataListDisplay.value
        .map((item, index) => (item.selected ? index : -1))
        .filter((item) => item > -1)
        .sort()
      let html = ''
      let elementWidth = 0
      for (let index of multipleTargetIndex) {
        const element = document.getElementById('row-' + index)
        if (!element) continue
        html += element.outerHTML
        const cloneElement = element.cloneNode(true)
        cloneElement.classList.remove('draggable')
        cloneElement.removeAttribute('id')
        cloneElement.removeAttribute('draggable')
        elementWidth = cloneElement.clientWidth
      }

      const cloneElement = document.createElement('div')
      const tableWrapper = document.createElement('div')
      tableWrapper.classList.add('v-data-table__wrapper')
      const tableElement = document.createElement('table')
      cloneElement.id = 'drag-multiple-row'
      cloneElement.classList.add(
        ...['v-data-table', 'elevation-0', 'theme--light']
      )
      cloneElement.style.backgroundColor = 'transparent'
      cloneElement.style.position = 'absolute'
      cloneElement.style.top = `${e.y - 20}px`
      cloneElement.style.left = `${e.x + 50}px`
      cloneElement.style.zIndex = '1000'
      cloneElement.style.display = 'table'
      cloneElement.style.opacity = '0.9'
      // cloneElement.style.width = elementWidth + 'px'
      tableElement.innerHTML = html
      tableWrapper.appendChild(tableElement)
      cloneElement.appendChild(tableWrapper)

      const themeDiv = document.querySelector('.theme--light')

      if (themeDiv) {
        themeDiv.appendChild(cloneElement)
      }

      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setDragImage(document.createElement('div'), 0, 0)
    }

    const dragStart = (e, item) => {
      if (!e.target) return
      if (item.selected && isMultipleSelected) {
        isMultipleDrag = true
        handleDragMultipleStart(e, item)
        return
      }
      const element = e.target.closest('tr')
      dragSrcEl = element
      dragSrcElId = element.id
      const cloneElement = element.cloneNode(true)
      cloneElement.classList.remove('draggable')
      cloneElement.removeAttribute('id')
      cloneElement.removeAttribute('draggable')

      const divElement = document.createElement('div')
      const tableWrapper = document.createElement('div')
      tableWrapper.classList.add('v-data-table__wrapper')
      const tableElement = document.createElement('table')
      const tbodyElement = document.createElement('tbody')
      divElement.id = 'drag-multiple-row'
      divElement.classList.add(
        ...['v-data-table', 'elevation-0', 'theme--light']
      )
      divElement.style.backgroundColor = 'transparent'
      divElement.style.position = 'absolute'
      divElement.style.top = `${e.y - 20}px`
      divElement.style.left = `${e.x + 50}px`
      divElement.style.zIndex = '1000'
      divElement.style.display = 'table'
      divElement.style.opacity = '0.9'
      // cloneElement.style.width = elementWidth + 'px'
      tbodyElement.appendChild(cloneElement)
      tableElement.appendChild(tbodyElement)
      tableWrapper.appendChild(tableElement)
      divElement.appendChild(tableWrapper)

      const themeDiv = document.querySelector('.theme--light')

      if (themeDiv) {
        themeDiv.appendChild(divElement)
      }

      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setDragImage(document.createElement('div'), 0, 0)
    }

    const dragEnter = (e) => {
      if (!e.target) return

      const element = e.target.closest('tr')
      if (element.id !== dragDestElId) {
        if (dragDestElId) {
          const element = document.getElementById(dragDestElId)
          if (element) {
            element.classList.remove('over')
            element.classList.remove('drag-to')
          }
        }
        if (element.id !== dragDestElId) {
          const destinationIndex = +element.id.split('-').pop()
          const destinationItem = dataListDisplay.value[destinationIndex]
          if (destinationItem && destinationItem.type !== 'folder') {
            element.classList.add('over')
          }
          if (destinationItem && destinationItem.type === 'folder') {
            element.classList.add('drag-to')
          }
        }
        dragDestElId = element.id
      }
    }

    const dragLeave = (e) => {
      if (!e.target) return
      e.stopPropagation()
      const element = e.target.closest('tr')
    }

    const dragOver = (e) => {
      if (!e.target) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      const dragMultipleRow = document.getElementById('drag-multiple-row')
      if (dragMultipleRow) {
        dragMultipleRow.style.top = `${e.y - 20}px`
        dragMultipleRow.style.left = `${e.x + 50}px`
      }
      return false
    }

    const arrayMove = (arr, fromIndex, toIndex) => {
      const element = arr[fromIndex]
      arr.splice(fromIndex, 1)
      arr.splice(toIndex, 0, element)
    }

    const addToFolder = (arr, folder, itemIndex) => {
      if (!folder) return
      const element = arr[itemIndex]
      arr.splice(itemIndex, 1)
      if (!folder.children) folder.children = []
      folder.children.push(element)
    }

    const dragDrop = (e) => {
      const drawElement = document.getElementById('drag-multiple-row')
      if (drawElement) {
        drawElement.remove()
      }
      if (!e.target) return
      const element = e.target.closest('tr')
      if (!element) return
      const destinationIndex = +element.id.split('-').pop()
      const destinationItem = dataListDisplay.value[destinationIndex]
      if (destinationItem && destinationItem.type !== 'folder') {
        if (!isMultipleDrag && dragSrcElId !== element.id) {
          const targetIndex = +dragSrcElId.split('-').pop()
          arrayMove(dataListDisplay.value, targetIndex, destinationIndex)
        }
        if (isMultipleDrag && !multipleTargetIndex.includes(destinationIndex)) {
          let index = 0
          for (let itemIndex of multipleTargetIndex) {
            if (!index)
              arrayMove(dataListDisplay.value, itemIndex, destinationIndex)
            else
              arrayMove(
                dataListDisplay.value,
                itemIndex + (itemIndex < destinationIndex ? -index : 0),
                itemIndex < destinationIndex
                  ? destinationIndex
                  : destinationIndex + index
              )
            index++
          }
        }
      }
      if (destinationItem && destinationItem.type === 'folder') {
        if (!isMultipleDrag && dragSrcElId !== element.id) {
          const targetIndex = +dragSrcElId.split('-').pop()
          addToFolder(dataListDisplay.value, destinationItem, targetIndex)
        }
        if (isMultipleDrag && !multipleTargetIndex.includes(destinationIndex)) {
          let index = 0
          for (let itemIndex of multipleTargetIndex) {
            if (!index)
              addToFolder(dataListDisplay.value, destinationItem, itemIndex)
            else
              addToFolder(
                dataListDisplay.value,
                destinationItem,
                itemIndex - index
              )
            index++
          }
        }
      }

      emit('changeDataList', dataListDisplay.value)

      return false
    }

    const dragEnd = (e) => {
      const drawElement = document.getElementById('drag-multiple-row')

      if (drawElement) {
        drawElement.remove()
      }
      if (!e.target) return
      const element = e.target.closest('tr')
      const listItems = document.querySelectorAll('.draggable')
      ;[].forEach.call(listItems, function(item) {
        item.classList.remove('over')
        item.classList.remove('drag-to')
      })
      isMultipleDrag = false
      multipleTargetIndex = []
      element.style.opacity = '1'
    }

    const onSelectAll = (e) => {
      if (!dataListDisplay) return
      dataListDisplay.value.forEach((item) => (item.selected = selectAll.value))
    }

    const onRowClick = (item) => {
      item.selected = !item.selected
    }

    const onCheckBoxChange = (val, item) => {
      item.selected = !!val
    }

    return {
      sortBy,
      sortDesc,
      page,
      selectAll,
      dataListDisplay,
      Category,
      rowHover,
      itemIsHover,
      rowBlur,
      onClipDescEdit,
      onMove,
      onUnclip,
      sortedTable,
      isAllSelected,
      onSelectAll,
      dragStart,
      dragEnter,
      dragEnd,
      dragDrop,
      dragOver,
      dragLeave,
      onRowClick,
      onCheckBoxChange,
      isMultipleSelected
    }
  }
})
</script>

<style lang="scss">
[draggable] {
  user-select: none;
}
.v-menu__content {
  border-radius: 0px 0px 4px 4px;
  box-shadow: 0px 2px 4px #00000033;
  border: 1px solid #eaeaea;
}
#clip-table,
#drag-multiple-row {
  table {
    table-layout: fixed;
    border-spacing: 0 0.6rem;
    thead > tr:last-child > th {
      border-bottom: none;
      color: #a6a7a7;
    }

    th {
      vertical-align: bottom;
    }
    tbody {
      background-color: #ffffff;
      // box-shadow: 1px 1px 2px #00000033;
      // box-shadow: 6px -4px 2px -5px rgb(0 0 0 / 20%);
      //filter: drop-shadow(1px 1px 2px #00000033);
      td:not(.v-data-table__mobile-row) {
        border-bottom: none !important;
        display: inline-flex;
      }
      .row-flex {
        box-shadow: 1px 1px 2px #00000029;
        border-radius: 4px;
        height: 54px;
        .row {
          margin: 0;
          display: flex;
          align-items: center;
        }
        img {
          height: 20px;
          width: 20px;
          object-fit: contain;
          object-position: center;
        }
        // .icons {
        //   width: 20px;
        //   height: 20px;
        //   img {
        //     height: 100%;
        //     width: 100%;
        //     object-fit: contain;
        //     object-position: center;
        //   }
        // }
        .has-bar {
          display: none;
          width: 40px;
          background: #efefef;
          .v-icon:focus::after {
            opacity: 0 !important;
          }
          .bar {
            font-size: 20px;
            width: 40px;
            text-align: center;
            height: 54px;
            cursor: pointer;
          }
        }
        &:hover {
          .has-bar {
            display: flex;
          }
        }
      }
      .row-flex.selected,
      .row-flex:hover,
      .row-flex.drag-to {
        background-color: #dfedf2;
      }
      td > .v-input--checkbox,
      td > p,
      td > img {
        display: table-cell;
        vertical-align: middle;
      }

      .v-input--selection-controls {
        padding-top: 0;
      }
      .draggable {
        will-change: transform;
        cursor: move;
        transition: all 200ms;
        user-select: none;
        position: relative;
        &:hover {
          &:after {
            opacity: 1;
            transform: translate(0);
          }
        }
        &.fill {
          td {
            opacity: 1 !important;
            color: red;
            background: red;
            border: 1px solid red;
          }
        }
      }
    }
    .v-data-footer {
      border-top: none !important;
    }
  }
}
.v-data-table__wrapper {
  overflow: visible;
}

.over {
  padding-top: 4px;
  position: relative;
  &::before {
    content: '';
    width: 100%;
    height: 4px;
    top: -4px;
    left: 0;
    background: #43a5c4;
    position: absolute;
  }
}

.title-list {
  color: #41434e;
  font-size: 14px;
  font-weight: bold;
}
.clip-menu-action {
  background: #ffffff;
  box-shadow: 0 2px 4px #00000033;
  border: 1px solid #eaeaea;
  border-radius: 0 0 4px 4px;
  padding: 0;
  .clip-item {
    color: #43a5c4 !important;
    font-size: 12px;
    padding: 14px 16px;
    cursor: pointer;
  }
}
#drag-multiple-row {
  .row-flex.selected {
    background-color: #ffffff !important;
  }
  tbody {
    tr {
      td:nth-child(1) {
        width: 60px;
      }
      td:nth-child(2) {
        width: 250px;
      }
      td:nth-child(3) {
        width: 150px;
      }
      td:nth-child(4) {
        width: 300px;
      }
      td:nth-child(5) {
        width: 250px;
      }
      td:nth-child(6) {
        width: 500px;
      }
    }
  }
}
#drag-row {
  td:nth-child(1) {
    width: 60px;
  }
  td:nth-child(2) {
    width: 250px;
  }
  td:nth-child(3) {
    width: 150px;
  }
  td:nth-child(4) {
    width: 300px;
  }
  td:nth-child(5) {
    width: 250px;
  }
  td:nth-child(6) {
    width: 500px;
  }
}
</style>
