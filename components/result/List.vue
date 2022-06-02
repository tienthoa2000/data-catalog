<template>
  <v-container fluid class="px-12">
    <v-data-table
      v-if="resultList && resultList.length !== 0"
      no-data-text="データがありません。"
      class="elevation-0"
      :items="resultList"
      id="result-table"
      style="background-color:#F4F6F7; width:100%; height:calc(100vh - 232px); overflow-y:scroll"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :items-per-page="10"
      :page.sync="page"
    >
      <template v-slot:top="{}">
        <p
          class="mx-4 mb-4"
          style="font-size: 12px; font-weight: regular; color: #777777;"
        >
          検索結果 :
          {{ resultList && resultList.length !== 0 ? resultList.length : 0 }} 件
        </p>
      </template>
      <template v-slot:header="{}">
        <thead id="thead">
          <tr>
            <th
              class="pl-4 pr-0"
              :style="`width: ${nameWidth}px`"
              @click="clickNameSort"
            >
              <span style="vertical-align: middle;">
                データ名
              </span>
              <v-btn x-small icon>
                <div v-show="sortDesc && sortBy === 'name'">
                  <img src="@/assets/icons/search_arrow.svg" width="10px" />
                </div>
                <div v-show="!sortDesc && !sortNomalFlg && sortBy === 'name'">
                  <img
                    src="@/assets/icons/search_arrow.svg"
                    width="10px"
                    style="transform: scale(1, -1);"
                  />
                </div>
                <v-col
                  v-show="(!sortDesc && sortNomalFlg) || sortBy !== 'name'"
                >
                  <div style="height: 10px">
                    <img
                      src="@/assets/icons/search_arrow.svg"
                      width="10px"
                      style="transform: scale(1, -1);"
                    />
                  </div>
                  <div>
                    <img src="@/assets/icons/search_arrow.svg" width="10px" />
                  </div>
                </v-col>
              </v-btn>
            </th>
            <th
              class="pl-5 pr-0"
              :style="`width: ${logicalNameWidth}px`"
              @click="clickTableLogicalNameSort"
            >
              <span style="vertical-align: middle;">
                論理名
              </span>
              <v-btn x-small icon>
                <div v-show="sortDesc && sortBy === 'logicalName'">
                  <img src="@/assets/icons/search_arrow.svg" width="10px" />
                </div>
                <div
                  v-show="
                    !sortDesc && !sortNomalFlg && sortBy === 'logicalName'
                  "
                >
                  <img
                    src="@/assets/icons/search_arrow.svg"
                    width="10px"
                    style="transform: scale(1, -1);"
                  />
                </div>
                <v-col
                  v-show="
                    (!sortDesc && sortNomalFlg) || sortBy !== 'logicalName'
                  "
                >
                  <div style="height: 10px">
                    <img
                      src="@/assets/icons/search_arrow.svg"
                      width="10px"
                      style="transform: scale(1, -1);"
                    />
                  </div>
                  <div>
                    <img src="@/assets/icons/search_arrow.svg" width="10px" />
                  </div>
                </v-col>
              </v-btn>
            </th>
            <th
              class="pl-5 pr-0"
              :style="`width: ${locationNameWidth}px`"
              @click="clickLocationNameSort"
            >
              <span style="vertical-align: middle;">
                ロケーション
              </span>
              <v-btn x-small icon>
                <div v-show="sortDesc && sortBy === 'location'">
                  <img src="@/assets/icons/search_arrow.svg" width="10px" />
                </div>
                <div
                  v-show="!sortDesc && !sortNomalFlg && sortBy === 'location'"
                >
                  <img
                    src="@/assets/icons/search_arrow.svg"
                    width="10px"
                    style="transform: scale(1, -1);"
                  />
                </div>
                <v-col
                  v-show="(!sortDesc && sortNomalFlg) || sortBy !== 'location'"
                >
                  <div style="height: 10px">
                    <img
                      src="@/assets/icons/search_arrow.svg"
                      width="10px"
                      style="transform: scale(1, -1);"
                    />
                  </div>
                  <div>
                    <img src="@/assets/icons/search_arrow.svg" width="10px" />
                  </div>
                </v-col>
              </v-btn>
            </th>
            <th
              class="pl-5 pr-0"
              :style="`width: ${databaseNameWidth}px`"
              @click="clickDatabaseNameSort"
            >
              <span style="vertical-align: middle;">
                {{
                  locationType === 0
                    ? 'データベース / スキーマ'
                    : 'ワークスペース'
                }}
              </span>
              <v-btn x-small icon>
                <div v-show="sortDesc && sortBy === 'database'">
                  <img src="@/assets/icons/search_arrow.svg" width="10px" />
                </div>
                <div
                  v-show="!sortDesc && !sortNomalFlg && sortBy === 'database'"
                >
                  <img
                    src="@/assets/icons/search_arrow.svg"
                    width="10px"
                    style="transform: scale(1, -1);"
                  />
                </div>
                <v-col
                  v-show="(!sortDesc && sortNomalFlg) || sortBy !== 'database'"
                >
                  <div style="height: 10px">
                    <img
                      src="@/assets/icons/search_arrow.svg"
                      width="10px"
                      style="transform: scale(1, -1);"
                    />
                  </div>
                  <div>
                    <img src="@/assets/icons/search_arrow.svg" width="10px" />
                  </div>
                </v-col>
              </v-btn>
            </th>
            <th
              class="pl-5 pr-0"
              :style="`width: ${ownerNameWidth}px`"
              @click="clickOwnerNameSort"
            >
              <span style="vertical-align: middle;">
                データオーナー
              </span>
              <v-btn x-small icon>
                <div v-show="sortDesc && sortBy === 'owner'">
                  <img src="@/assets/icons/search_arrow.svg" width="10px" />
                </div>
                <div v-show="!sortDesc && !sortNomalFlg && sortBy === 'owner'">
                  <img
                    src="@/assets/icons/search_arrow.svg"
                    width="10px"
                    style="transform: scale(1, -1);"
                  />
                </div>
                <v-col
                  v-show="(!sortDesc && sortNomalFlg) || sortBy !== 'owner'"
                >
                  <div style="height: 10px">
                    <img
                      src="@/assets/icons/search_arrow.svg"
                      width="10px"
                      style="transform: scale(1, -1);"
                    />
                  </div>
                  <div>
                    <img src="@/assets/icons/search_arrow.svg" width="10px" />
                  </div>
                </v-col>
              </v-btn>
            </th>
            <th
              class="pl-5 pr-0"
              :style="`width: ${tagsWidth}px`"
              @click="clickTagsSort"
            >
              <span style="vertical-align: middle;">
                タグ
              </span>
              <v-btn x-small icon>
                <div v-show="sortDesc && sortBy === 'tags'">
                  <img src="@/assets/icons/search_arrow.svg" width="10px" />
                </div>
                <div v-show="!sortDesc && !sortNomalFlg && sortBy === 'tags'">
                  <img
                    src="@/assets/icons/search_arrow.svg"
                    width="10px"
                    style="transform: scale(1, -1);"
                  />
                </div>
                <v-col
                  v-show="(!sortDesc && sortNomalFlg) || sortBy !== 'tags'"
                >
                  <div style="height: 10px">
                    <img
                      src="@/assets/icons/search_arrow.svg"
                      width="10px"
                      style="transform: scale(1, -1);"
                    />
                  </div>
                  <div>
                    <img src="@/assets/icons/search_arrow.svg" width="10px" />
                  </div>
                </v-col>
              </v-btn>
            </th>
            <th
              class="pl-5 pr-0"
              :style="`width: ${modifyDateWidth}px`"
              @click="clickModifyDateSort"
            >
              <span style="vertical-align: middle;">
                更新日時
              </span>
              <v-btn x-small icon>
                <div v-show="sortDesc && sortBy === 'modifyDate'">
                  <img src="@/assets/icons/search_arrow.svg" width="10px" />
                </div>
                <div
                  v-show="!sortDesc && !sortNomalFlg && sortBy === 'modifyDate'"
                >
                  <img
                    src="@/assets/icons/search_arrow.svg"
                    width="10px"
                    style="transform: scale(1, -1);"
                  />
                </div>
                <v-col
                  v-show="
                    (!sortDesc && sortNomalFlg) || sortBy !== 'modifyDate'
                  "
                >
                  <div style="height: 10px">
                    <img
                      src="@/assets/icons/search_arrow.svg"
                      width="10px"
                      style="transform: scale(1, -1);"
                    />
                  </div>
                  <div>
                    <img src="@/assets/icons/search_arrow.svg" width="10px" />
                  </div>
                </v-col>
              </v-btn>
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:body="{ items }">
        <tbody
          id="t-body"
          v-for="(item, index) in items"
          :key="index"
          @click="rowClick(item)"
        >
          <tr id="table-tr">
            <td
              class="pa-0"
              style="vertical-align: top; border-top-left-radius: 4px;"
            >
              <v-row
                class="ml-4 my-3 mr-0"
                style="display: table;table-layout: fixed;"
              >
                <div style="display: table-cell; vertical-align: top;">
                  <img
                    v-if="item.label === 'table'"
                    :src="require('@/assets/icons/table.svg')"
                    style="margin-right: 5px; height: 14px;"
                  />
                  <img
                    v-else-if="item.label === 'view'"
                    :src="require('@/assets/icons/view.svg')"
                    style="margin-right: 5px; height: 14px;"
                  />
                  <img
                    v-else-if="item.label === 'dataset'"
                    :src="require('@/assets/icons/dataset.svg')"
                    style="margin-right: 5px; height: 14px;"
                  />
                  <img
                    v-else-if="item.label === 'report'"
                    :src="require('@/assets/icons/report.svg')"
                    style="margin-right: 5px; height: 14px;"
                  />
                  <img
                    v-else-if="item.label === 'dashboard'"
                    :src="require('@/assets/icons/dashboard.svg')"
                    style="margin-right: 5px; height: 14px;"
                  />
                </div>
                <div style="display: table-cell;">
                  <span
                    v-if="item.name"
                    style="font-weight: bold; font-size: 14px; color: #41434E; word-break: break-all; display: inline-block;"
                  >
                    {{ item.name }}</span
                  >
                </div>
              </v-row>
            </td>
            <td class="pa-0" style="vertical-align: top;">
              <p
                class="ml-5 my-3"
                style="font-weight: regular; font-size: 14px; color: #41434E;"
              >
                {{ !item.logicalName ? '-' : item.logicalName }}
              </p>
            </td>
            <td class="pa-0" style="vertical-align: top;">
              <p
                class="ml-5 my-3"
                style="font-weight: regular; font-size: 14px; color: #41434E;"
              >
                {{
                  `${item.system.systemName} ${item.product.productName} ( ${item.product.envName} )`
                }}
              </p>
            </td>
            <td class="pa-0" style="vertical-align: top;">
              <p
                v-if="locationType === 0 && item.database && item.schema"
                class="ml-5 my-3"
                style="font-weight: regular; font-size: 14px; color: #41434E;"
              >
                {{ `${item.database} / ${item.schema}` }}
              </p>
              <p
                v-else-if="locationType === 1 && item.database"
                class="ml-5 my-3"
                style="font-weight: regular; font-size: 14px; color: #41434E;"
              >
                {{ item.database }}
              </p>
            </td>
            <td class="pa-0" style="vertical-align: top;">
              <p
                v-if="item.owner"
                class="ml-5 my-3"
                style="font-weight: regular; font-size: 14px; color: #41434E;"
              >
                {{ item.owner }}
              </p>
            </td>
            <td class="pa-0" style="vertical-align: top;">
              <v-row
                class="ml-5 mr-0"
                style="margin-top: 10px; margin-bottom: 10px;"
              >
                <v-tooltip
                  v-if="
                    item.tags &&
                      item.tags[0] &&
                      item.tags[0].name &&
                      (isTrancate[index] ||
                        isTrancate[index] === null ||
                        isTrancate[index] === undefined ||
                        !isFirstView)
                  "
                  bottom
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      small
                      color="#CFE9C6"
                      :style="
                        `max-width: ${tagsChipWidth}px;margin-right: 5px;`
                      "
                      v-bind="attrs"
                      v-on="on"
                    >
                      <span
                        v-if="item.tags && item.tags[0] && item.tags[0].name"
                        ref="tagRef"
                        style="font-weight: regular; font-size: 12px; color: #41434E; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                      >
                        {{ item.tags[0].name }}
                      </span>
                    </v-chip>
                  </template>
                  <span
                    v-if="item.tags && item.tags[0] && item.tags[0].name"
                    style="font-weight: regular; font-size: 12px;"
                    >{{ item.tags[0].name }}</span
                  >
                </v-tooltip>
                <v-chip
                  v-else-if="item.tags && item.tags[0] && item.tags[0].name"
                  small
                  color="#CFE9C6"
                  :style="`max-width: ${tagsChipWidth}px;margin-right: 5px;`"
                >
                  <span
                    v-if="item.tags && item.tags[0] && item.tags[0].name"
                    style="font-weight: regular; font-size: 12px; color: #41434E;"
                  >
                    {{ item.tags[0].name }}
                  </span>
                </v-chip>
                <v-tooltip v-if="item.tags && item.tags.length > 1" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-if="item.tags"
                      class="d-inline-block text-truncate"
                      style="font-weight: regular; max-width: 60px; font-size: 12px; line-height: 24px; color: #777777;"
                      v-bind="attrs"
                      v-on="on"
                    >
                      他{{ item.tags.length - 1 }}件
                    </span>
                  </template>
                  <div v-for="(tag, index) in item.tags" :key="index">
                    <span
                      v-if="index !== 0 && tag.name"
                      style="font-weight: regular; font-size: 12px;"
                      >{{ tag.name
                      }}{{ index === item.tags.length - 1 ? '' : ',' }}</span
                    >
                  </div>
                </v-tooltip>
              </v-row>
            </td>
            <td
              style="vertical-align: top;  border-top-right-radius: 4px;"
              class="pa-0"
            >
              <v-row
                class="ml-5 my-2 mr-0"
                :style="
                  `justify-content: ${
                    item.modifyDate ? 'space-between' : 'right'
                  }`
                "
              >
                <span
                  v-if="item.modifyDate"
                  id="modify-date"
                  class="my-1"
                  style="font-weight: regular; font-size: 14px; color: #41434E; min-width: 108px;"
                >
                  {{
                    item.modifyDate
                      ? $dayjs(item.modifyDate).format('YYYY/MM/DD HH:mm')
                      : ''
                  }}
                </span>
                <!--<div
                  style="width: 64px !important; min-height: 32px; text-align: center; padding: 0 4px 0 0;"
                >
                  <v-btn
                    v-show="!clipFlg"
                    id="clip-btn-blue"
                    fab
                    x-small
                    color="white"
                    elevation="2"
                    class="ml-3"
                    @click="clipClick"
                  >
                    <img src="@/assets/icons/search_clip_blue.svg" />
                  </v-btn>
                  <v-btn
                    v-show="clipFlg"
                    id="clip-btn-white"
                    fab
                    x-small
                    elevation="2"
                    class="ml-3"
                    @click="clipClick"
                  >
                    <img
                      src="@/assets/icons/search_clip_white.svg"
                      style="padding-top: 3px; padding-left: 4px;"
                    />
                  </v-btn>
                </div>-->
              </v-row>
            </td>
          </tr>
          <tr v-if="item.typeDesc">
            <td
              colspan="7"
              style="border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
            >
              <p style="background-color: #F4F4F4;" class="mx-4 pa-2">
                {{ item.typeDesc }}
              </p>
            </td>
          </tr>
          <tr
            style="height: 10px; width: 100%; background-color: #f4f6f7;"
          ></tr>
        </tbody>
      </template>
    </v-data-table>
    <div v-else-if="!isSearched" class="mx-auto">
      <CommonError
        height="calc(100vh - 255px)"
        errType="search"
        mainErrText="ここに検索結果が表示されます"
        secondaryErrText="キーワードか検索条件を一つ以上設定して検索してください"
      />
    </div>
    <div v-else-if="isSrchLimit" class="mx-auto">
      <CommonError
        height="calc(100vh - 255px)"
        errType="error"
        mainErrText="検索結果が2000件を超えました。"
        secondaryErrText="キーワードか検索条件を変更してお試しください"
      />
    </div>
    <div v-else class="mx-auto">
      <CommonError
        height="calc(100vh - 255px)"
        errType="error"
        mainErrText="検索結果が見つかりませんでした"
        secondaryErrText="キーワードか検索条件を変更してお試しください"
      />
    </div>
  </v-container>
</template>

<script>

import {
  defineComponent,
  ref,
  watch,
  computed,
  onMounted,
  onUpdated,
  onBeforeUnmount,
  nextTick,
  useRoute
} from '@nuxtjs/composition-api'
import { useResultStore } from "~/store/resultModule";

// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// let resultModule = createNamespacedHelpers('results')

export default defineComponent({
  setup(props, { emit }) {
    const route = useRoute()

    const sortBy = ref('name') // ソート対象のカラム名
    const sortDesc = ref(false) // ソート判定(falseが昇順、trueが降順)
    const sortCount = ref(0)
    const sortNomalFlg = ref(false) // ソートしていない状態かどうかのフラグ(trueならソートしていない状態)
    const clipFlg = ref(false) // クリップしたかどうかのフラグ
    const isClipBtn = ref(false)
    const modifyDateWidth = ref(null) // 更新日時カラムのWidth
    const tableTrWidth = ref(null) // TableのTr要素のWidth
    const nameWidth = ref(null) // データ名カラムのWidth
    const logicalNameWidth = ref(null) // 論理名カラムのWidth
    const locationNameWidth = ref(null) // ロケーションカラムのWidth
    const databaseNameWidth = ref(null) // データベースカラムのWidth
    const ownerNameWidth = ref(null) // データオーナーカラムのWidth
    const tagsWidth = ref(null) // タグカラムのWidth
    const tagsChipWidth = ref(null) // タグチップ領域のWidth

    const tagRef = ref(null)
    const isTrancate = ref([])
    const isFirstView = ref(false)
    const page = ref(1)
    const resultModule = useResultStore()
    //Vuex To Pinia
    // const { isSearched } = resultModule.useState(['isSearched'])
    // const { isSrchLimit } = resultModule.useState(['isSrchLimit'])
    // const resultList = resultModule.useGetters(['list']).list

    const isSearched = computed(() => resultModule.isSearched)
    const isSrchLimit = computed(() => resultModule.isSrchLimit)
    const resultList = computed(() => resultModule.list.list)

    // URLパラメータを参照し、ロケーションタイプをセット
    const locationType = computed(() => {
      return +route?.value?.query?.locationType ?? 1 // OR演算子「||」を使うと「0」がfalsyのため、右辺が代入されてしまうので、Null合体演算子「??」を使う
    })

    watch(resultList, (val) => {
      //reset paging
      page.value = 1
    })

    onMounted(() => {
      // Tableの各カラム幅を算出
      modifyDateWidth.value = document.getElementById('modify-date')
        ? document.getElementById('modify-date')?.offsetWidth + 64 + 22
        : 194
      tableTrWidth.value =
        document.getElementById('result-table')?.clientWidth - 64
      nameWidth.value = (tableTrWidth.value - modifyDateWidth.value) * 0.2
      logicalNameWidth.value =
        (tableTrWidth.value - modifyDateWidth.value) * 0.16
      locationNameWidth.value =
        (tableTrWidth.value - modifyDateWidth.value) * 0.16
      databaseNameWidth.value =
        (tableTrWidth.value - modifyDateWidth.value) * 0.16
      ownerNameWidth.value = (tableTrWidth.value - modifyDateWidth.value) * 0.16
      tagsWidth.value = (tableTrWidth.value - modifyDateWidth.value) * 0.16
      tagsChipWidth.value = tagsWidth.value - 61

      // 画面リサイズ時に発火
      window.addEventListener('resize', onResize, { passive: true })
    })

    onUpdated(() => {
      // Tableの各カラム幅を算出
      modifyDateWidth.value = document.getElementById('modify-date')
        ? document.getElementById('modify-date')?.offsetWidth + 64 + 22
        : 194
      tableTrWidth.value =
        document.getElementById('result-table')?.clientWidth - 64
      nameWidth.value = (tableTrWidth.value - modifyDateWidth.value) * 0.2
      logicalNameWidth.value =
        (tableTrWidth.value - modifyDateWidth.value) * 0.16
      locationNameWidth.value =
        (tableTrWidth.value - modifyDateWidth.value) * 0.16
      databaseNameWidth.value =
        (tableTrWidth.value - modifyDateWidth.value) * 0.16
      ownerNameWidth.value = (tableTrWidth.value - modifyDateWidth.value) * 0.16
      tagsWidth.value = (tableTrWidth.value - modifyDateWidth.value) * 0.16
      tagsChipWidth.value = tagsWidth.value - 61

      nextTick(() => {
        isTrancate.value = []

        for (let i = 0; i < resultList.value.length; i++) {
          isTrancate.value.push(
            tagRef.value &&
              tagRef.value[i] &&
              tagRef.value[i].scrollWidth - tagRef.value[i].offsetWidth < 3
              ? false
              : true
          )
        }
      })
      // }
      isFirstView.value = true
    })

    onBeforeUnmount(() => {
      if (typeof window === 'undefined') return
      // 画面リサイズ時に発火
      window.addEventListener('resize', onResize, { passive: true })
    })

    const onResize = () => {
      // 画面リサイズ時にTableや各カラムの幅を再度算出する
      modifyDateWidth.value = document.getElementById('modify-date')
        ? document.getElementById('modify-date')?.offsetWidth + 64 + 22
        : 194
      tableTrWidth.value =
        document.getElementById('result-table')?.clientWidth - 64
      nameWidth.value = (tableTrWidth.value - modifyDateWidth.value) * 0.2
      logicalNameWidth.value =
        (tableTrWidth.value - modifyDateWidth.value) * 0.16
      locationNameWidth.value =
        (tableTrWidth.value - modifyDateWidth.value) * 0.16
      databaseNameWidth.value =
        (tableTrWidth.value - modifyDateWidth.value) * 0.16
      ownerNameWidth.value = (tableTrWidth.value - modifyDateWidth.value) * 0.16
      tagsWidth.value = (tableTrWidth.value - modifyDateWidth.value) * 0.16
      tagsChipWidth.value = tagsWidth.value - 61
    }

    // const resultList = require('assets/json/result_data.json')
    // const resultList = jsonData

    // データ名カラムのソートボタンクリック時
    const clickNameSort = () => {
      if (sortBy.value !== 'name') {
        sortBy.value = 'name'
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else if (sortDesc.value) {
        sortDesc.value = false
        sortCount.value = 1
        sortNomalFlg.value = true
      } else if (!sortDesc.value && sortCount.value === 1) {
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else {
        sortDesc.value = true
        sortNomalFlg.value = false
      }
    }

    // 論理名カラムのソートボタンクリック時
    const clickTableLogicalNameSort = () => {
      if (sortBy.value !== 'logicalName') {
        sortBy.value = 'logicalName'
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else if (sortDesc.value) {
        sortDesc.value = false
        sortCount.value = 1
        sortNomalFlg.value = true
      } else if (!sortDesc.value && sortCount.value === 1) {
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else {
        sortDesc.value = true
        sortNomalFlg.value = false
      }
    }

    // ロケーションカラムのソートボタンクリック時
    const clickLocationNameSort = () => {
      if (sortBy.value !== 'location') {
        sortBy.value = 'location'
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else if (sortDesc.value) {
        sortDesc.value = false
        sortCount.value = 1
        sortNomalFlg.value = true
      } else if (!sortDesc.value && sortCount.value === 1) {
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else {
        sortDesc.value = true
        sortNomalFlg.value = false
      }
    }

    // データベースカラムのソートボタンクリック時
    const clickDatabaseNameSort = () => {
      if (sortBy.value !== 'database') {
        sortBy.value = 'database'
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else if (sortDesc.value) {
        sortDesc.value = false
        sortCount.value = 1
        sortNomalFlg.value = true
      } else if (!sortDesc.value && sortCount.value === 1) {
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else {
        sortDesc.value = true
        sortNomalFlg.value = false
      }
    }

    // データオーナーカラムのソートボタンクリック時
    const clickOwnerNameSort = () => {
      if (sortBy.value !== 'owner') {
        sortBy.value = 'owner'
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else if (sortDesc.value) {
        sortDesc.value = false
        sortCount.value = 1
        sortNomalFlg.value = true
      } else if (!sortDesc.value && sortCount.value === 1) {
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else {
        sortDesc.value = true
        sortNomalFlg.value = false
      }
    }

    // タグカラムのソートボタンクリック時
    const clickTagsSort = () => {
      if (sortBy.value !== 'tags') {
        sortBy.value = 'tags'
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else if (sortDesc.value) {
        sortDesc.value = false
        sortCount.value = 1
        sortNomalFlg.value = true
      } else if (!sortDesc.value && sortCount.value === 1) {
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else {
        sortDesc.value = true
        sortNomalFlg.value = false
      }
    }

    // 更新日時カラムのソートボタンクリック時
    const clickModifyDateSort = () => {
      if (sortBy.value !== 'modifyDate') {
        sortBy.value = 'modifyDate'
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else if (sortDesc.value) {
        sortDesc.value = false
        sortCount.value = 1
        sortNomalFlg.value = true
      } else if (!sortDesc.value && sortCount.value === 1) {
        sortDesc.value = false
        sortCount.value = 0
        sortNomalFlg.value = false
      } else {
        sortDesc.value = true
        sortNomalFlg.value = false
      }
    }

    const rowClick = (item) => {
      if (!isClipBtn.value) {
        emit('onItemClick', item)
      }
      isClipBtn.value = false
    }

    const clipClick = () => {
      clipFlg.value = !clipFlg.value
      isClipBtn.value = true
    }

    return {
      locationType,
      resultList,
      sortBy,
      sortDesc,
      sortCount,
      sortNomalFlg,
      clickNameSort,
      clickTableLogicalNameSort,
      clickLocationNameSort,
      clickDatabaseNameSort,
      clickOwnerNameSort,
      clickTagsSort,
      clickModifyDateSort,
      rowClick,
      clipFlg,
      clipClick,
      isClipBtn,
      modifyDateWidth,
      tableTrWidth,
      nameWidth,
      logicalNameWidth,
      locationNameWidth,
      databaseNameWidth,
      ownerNameWidth,
      tagsWidth,
      tagsChipWidth,
      onResize,
      tagRef,
      isTrancate,
      isFirstView,
      page,
      isSearched,
      isSrchLimit
    }
  }
})
</script>

<style lang="scss">
#result-table {
  table {
    border-collapse: separate;
    #thead:after {
      content: '';
      display: table-row;
      height: 10px;
      background-color: #f4f6f7;
    }
    #thead > tr:last-child > th {
      border-bottom: none;
      color: #a6a7a7;
      height: 16px;
    }
    #t-body {
      background-color: #ffffff;
      // box-shadow: 1px 1px 2px #00000033;
      // box-shadow: 6px -4px 2px -5px rgb(0 0 0 / 20%);
      filter: drop-shadow(1px 1px 2px #00000033);
      #clip-btn-blue {
        display: none;
      }
    }
    #t-body:hover {
      background-color: #dfedf2;
      tr:hover {
        background-color: #dfedf2;
      }
      #clip-btn-blue {
        display: inline;
      }
    }
    #clip-btn-white {
      background-color: #43a5c4;
    }
    #clip-btn-white:hover {
      background-color: #51b6d6;
    }
    #clip-btn-white:before {
      background-color: #43a5c4;
    }
  }
}
.v-data-table__wrapper {
  overflow: visible;
}
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:not(:last-child)
  > td:not(.v-data-table__mobile-row) {
  border-bottom: none;
}
</style>
