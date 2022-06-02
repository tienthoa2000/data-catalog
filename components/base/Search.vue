<template lang="pug">
div(class="searchbg bg-index mb-6 rounded-b-xl")
  //- Power BI or データベース選択欄と、キーワード入力要素
  div(class="input-area up-index")
    div(class="row-wrapper")
      div(style="background-color: #FFFFFF; height: 48px; width: 100%; border-radius: 8px;")
        button(type="button" @click="onPowerBI()" :style="`background-color: ${powerBIBackground}; border-radius: 6px 0 0 6px; width: 90px; min-width: 90px; height: 42px; line-height: 42px; vertical-align: top; display: inline-block; margin: 3px 0 3px 3px; border: 1px solid #43A5C4;`")
          p(:style="`color: ${powerBIColor}; font-size: 14px;`") {{ $t('search.S0001') }}
        button(type="button" @click="onDatabase()" :style="`background-color: ${databaseBackground}; border-radius: 0 6px 6px 0; width: 90px; min-width: 90px; height: 42px; line-height: 42px; vertical-align: top; display: inline-block; margin: 3px 3px 3px 0; border: 1px solid #43A5C4;`")
          p(:style="`color: ${databaseColor}; font-size: 14px;`") {{ $t('search.S0002') }}
        div(class="input-area-field")
          div(class="v-input v-text-field-enclosed")
            div(class="v-slot search")
              v-text-field(
                refs="keywordField"
                v-model="word"
                :placeholder="$t('search.S0010')"
                @click="showMenu"
                @keydown.enter="searchWord(word)"
                :clear-icon="mdiCloseCircle"
                autocomplete="off"
                clearable
                filled
                background-color="#FFFFFF"
                flat
                solo
              )
                button(slot="append" type="button" @click="onAndCondition()" class="and-btn" :style="`background-color: ${andBackground};`")
                  p(class="condition-btn-text" :style="`color: ${andColor};`") {{ $t('search.S0012') }}
                button(slot="append" type="button" @click="onOrCondition()" class="or-btn" :style="`background-color: ${orBackground};`")
                  p(class="condition-btn-text" :style="`color: ${orColor};`") {{ $t('search.S0013') }}
                v-btn(slot="append" color="primary" class="search-btn" @click="searchWord(word)")
                  v-img(:src="magnify_icon")
              v-card(
                v-if="(menuflg && getInputWords !== null && getInputWords !== undefined && getInputWords.length !== 0)"
                class="menu-place"
                :elavation="0"
                outlined
              )
                v-list
                  v-list-item-group
                    template(v-for="(it, i) in getInputWords")
                      v-divider(:key="`divider-${i}`" v-if="i >= 1")
                      v-list-item(:key="`item-${i}`" @click="selectMenu(i)")
                        v-list-item-title {{ it }}
  //- condition area
  div(class="condition-area up-index")
    div(class="row-wrapper")
      //- 「システム」セレクトボックス要素
      div(v-show="locationType === 0" class="condition-child-area")
        p(class="text-left margin-caption-bottom label-color") {{ $t('search.System') }}
        v-menu(offset-y :close-on-content-click="false" class="system-select-box" allow-overflow)
          template(v-slot:activator="{ on }")
            v-btn(id="systemSearch" v-on="on" outlined color="#EAEAEA" class="font-weight-bold" elevation="0")
              span(class="system-span") {{ selectedSystemName }}
              v-img(:src="arrow_icon" max-height="16" max-width="16")
          v-list
            v-list-item-group(v-model="selectedSystemId" mandatory color="primary")
              template(v-for="(system, i) in systems")
                v-divider
                v-list-item(:value="system.id" :key="i")
                  v-list-item-content
                    v-list-item-title(v-text="system.systemName")
      //- 「データベース・スキーマ or ワークスペース」セレクトボックス要素
      div(class="condition-child-area")
        p(class="text-left margin-caption-bottom label-color") {{ locationText }}
        v-menu(offset-y :close-on-content-click="false" class="location-select-box" allow-overflow)
          template(v-slot:activator="{ on }")
            v-btn(id="locationSearch" v-on="on" outlined color="#EAEAEA" class="font-weight-bold" elevation="0")
              span(class="location-span") {{ selectedLocationsName }}
              v-img(:src="arrow_icon" max-height="16" max-width="16")
          v-list
            v-list-item(class="list-item-all-select" @click="onAllSelectLocation")
              v-list-item-icon(class="list-all-select")
                v-icon(v-if="!isAllSelectedLocation" color="grey lighten-1") {{ mdiCheckboxBlankOutline }}
                v-icon(v-else color="primary") {{ mdiCheckboxMarked }}
              v-list-item-content
                v-list-item-title(v-text="'すべて'")
            v-list-item-group(v-model="selectedlocations" multiple color="white")
              template(v-for="(location, i) in locations")
                v-divider
                v-list-item(:key="i")
                  template(v-slot:default="{ active }")
                    v-list-item-action
                      v-icon(v-if="!active" color="grey lighten-1") {{ mdiCheckboxBlankOutline }}
                      v-icon(v-else color="primary") {{ mdiCheckboxMarked }}
                    v-list-item-content
                      v-list-item-title(v-text="location.name")
      //- 「カテゴリ」セレクトボックス要素
      div(class="condition-child-area")
        p(class="text-left margin-caption-bottom label-color") {{ $t('search.S0005') }}
        v-menu(offset-y :close-on-content-click="false" class="category-select-box" allow-overflow)
          template(v-slot:activator="{ on }")
            v-btn(v-on="on" id="categorySearch" outlined color="#EAEAEA" class="font-weight-bold" elevation="0")
              span(class="category-span") {{ selectedCategoriesName }}
              v-img(:src="arrow_icon" max-height="16" max-width="16")
          v-list
            v-list-item(class="list-item-all-select" @click="onAllSelectCategory")
              v-list-item-icon(class="list-all-select")
                v-icon(v-if="!isAllSelectedCategory" color="grey lighten-1") {{ mdiCheckboxBlankOutline }}
                v-icon(v-else color="primary") {{ mdiCheckboxMarked }}
              v-list-item-content
                v-list-item-title(v-text="'すべて'")
            v-list-item-group(v-model="selectedcategories" multiple color="white")
              template(v-for="(category, i) in categories")
                v-divider
                v-list-item(:key="i")
                  template(v-slot:default="{ active }")
                    v-list-item-action
                      v-icon(v-if="!active" color="grey lighten-1") {{ mdiCheckboxBlankOutline }}
                      v-icon(v-else color="primary") {{ mdiCheckboxMarked }}
                    v-list-item-content
                      v-list-item-title(v-text="Category.getCategoryUCC(category.name)")
      //- 「データオーナー」セレクトボックス要素
      div(class="condition-child-area")
        p(class="text-left margin-caption-bottom label-color") {{ $t('search.S0006') }}
        v-menu(offset-y :close-on-content-click="false" class="owner-select-box" allow-overflow)
          template(v-slot:activator="{ on }")
            v-btn(id="ownerSearch" v-on="on" outlined color="#EAEAEA" class="font-weight-bold" elevation="0")
              span(class="owner-span") {{ selectedOwnersName }}
              v-img(:src="arrow_icon" max-height="16" max-width="16")
          v-list
            v-list-item(class="list-item-all-select" @click="onAllSelectOwner")
              v-list-item-icon(class="list-all-select")
                v-icon(v-if="!isAllSelectedOwner" color="grey lighten-1") {{ mdiCheckboxBlankOutline }}
                v-icon(v-else color="primary") {{ mdiCheckboxMarked }}
              v-list-item-content
                v-list-item-title(v-text="'すべて'")
            v-list-item-group(v-model="selectedowners" multiple color="white")
              template(v-for="(owner, i) in owners")
                v-divider
                v-list-item(:key="i")
                  template(v-slot:default="{ active }")
                    v-list-item-action
                      v-icon(v-if="!active" color="grey lighten-1") {{ mdiCheckboxBlankOutline }}
                      v-icon(v-else color="primary") {{ mdiCheckboxMarked }}
                    v-list-item-content
                      v-list-item-title(v-text="owner.name")
      //- 「タグ」セレクトボックス要素
      div(class="condition-child-area")
        p(class="text-left margin-caption-bottom label-color") {{ $t('search.S0007') }}
        v-menu(offset-y :close-on-content-click="false" class="tag-select-box" allow-overflow)
          template(v-slot:activator="{ on }")
            v-btn(id="tagSearch" v-on="on" outlined color="#EAEAEA" class="font-weight-bold" elevation="0")
              span(class="tag-span") {{ selectedTagsName }}
              v-img(:src="arrow_icon" max-height="16" max-width="16")
          v-list
            v-list-item(class="list-item-all-select" @click="onAllSelectTag")
              v-list-item-icon(class="list-all-select")
                v-icon(v-if="!isAllSelectedTag" color="grey lighten-1") {{ mdiCheckboxBlankOutline }}
                v-icon(v-else color="primary") {{ mdiCheckboxMarked }}
              v-list-item-content
                v-list-item-title(v-text="'すべて'")
            v-list-item-group(v-model="selectedtags" multiple color="white")
              template(v-for="(tag, i) in tags")
                v-divider
                v-list-item(:key="i")
                  template(v-slot:default="{ active }")
                    v-list-item-action
                      v-icon(v-if="!active" color="grey lighten-1") {{ mdiCheckboxBlankOutline }}
                      v-icon(v-else color="primary") {{ mdiCheckboxMarked }}
                    v-list-item-content
                      v-list-item-title(v-text="tag.name")
      //- div(class="clipbtn-area")
      //-  v-btn(fab color="white" class="addclip-icon")
      //-    v-img(:src="require('@/assets/icons/search_condition_add_blue.svg')" class="condition-size")
  //- infomation
  HelpDialog(
    :showalert="showalert"
    :alerticon="exclamation_icon"
    :alerttext="$t('search.S0011')"
    :btntext="$t('search.S0014')"
    @close="showOff"
  )
</template>
<script>
import {
  defineComponent,
  ref,
  useRoute,
  computed,
  watch,
  useContext
} from '@nuxtjs/composition-api'
import {
  mdiChevronDown,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiMagnify,
  mdiCloseCircle
} from '@mdi/js'
import { Category } from '~/constants/Category'
import { useSearchStore } from "~/store/searchModule";
import { useAppStore } from "~/store/appModule";
import { useResultStore } from "~/store/resultModule";
// TODO: Vuex to Pinia
// import { createNamespacedHelpers } from 'vuex-composition-helpers'
// import _resultModule from '~/store/result/results'
// import _searchModule from '~/store/search/searches'
// import appModule from '~/store/app/app'
// let searchModule = createNamespacedHelpers('searches')
// let resultModule = createNamespacedHelpers('results')

export default defineComponent({
  setup(props, { emit }) {
    const arrow_icon = require('@/assets/icons/search_arrow.svg')
    const magnify_icon = require('@/assets/icons/search_search.svg')
    const exclamation_icon = require('@/assets/icons/dialog_error.svg')
    const locationType = ref(1)
    const condition = ref(0)
    const selectedSystemId = ref(0)
    const selectedlocations = ref([])
    const selectedcategories = ref([])
    const selectedowners = ref([])
    const selectedtags = ref([])
    const showalert = ref(false)
    const menuflg = ref(false)
    const word = ref(null)
    const isAllSelectedLocation = ref(false)
    const isAllSelectedCategory = ref(false)
    const isAllSelectedOwner = ref(false)
    const isAllSelectedTag = ref(false)

    const route = useRoute()
    const {
      app: { i18n }
    } = useContext()

    const searchModule = useSearchStore()
    const appModule = useAppStore()
    const resultModule = useResultStore()

    // TODO: Vuex to Pinia
    // const { _systems, _locations, _owners, _tags } = searchModule.useState([
    //   '_systems',
    //   '_locations',
    //   '_owners',
    //   '_tags'
    // ])
    // const { getInputWords } = searchModule.useGetters(['getInputWords'])
    // const { SET_INPUT_WORDS } = searchModule.useMutations(['SET_INPUT_WORDS'])
    // const {
    //   fetchSystems,
    //   fetchLocations,
    //   fetchOwners,
    //   fetchTags
    // } = searchModule.useActions([
    //   'fetchSystems',
    //   'fetchLocations',
    //   'fetchOwners',
    //   'fetchTags'
    // ])
    // const { fetchSearch } = resultModule.useActions(['fetchSearch'])

    const _systems = computed(() => searchModule._systems)
    const _locations = computed(() => searchModule._locations)
    const _owners = computed(() => searchModule._owners)
    const _tags = computed(() => searchModule._tags)
    const getInputWords = computed(() => searchModule.getInputWords)

    const { setInputWords, fetchSystems, fetchLocations, fetchOwners, fetchTags } = searchModule
    const { fetchSearch } = resultModule

    const fetchSearchConditions = async () => {
      await Promise.all([
        fetchSystems(),
        fetchLocations(),
        fetchOwners(),
        fetchTags()
      ])
      // AppServiceでキャッシュされてしまい、最新データが取得できないため、一旦以下をコメントアウト
      // 検索条件API未実行であれば、検索条件APIをコール
      // if (_systems.value === null) await fetchSystems()
      // if (_locations.value === null) await fetchLocations()
      // if (_owners.value === null) await fetchOwners()
      // if (_tags.value === null) await fetchTags()
    }

    // システム情報
    const systems = computed(() => {
      if (!_systems.value || _systems.value?.length === 0) return _systems.value
      return _systems.value?.filter(
        (e) =>
          e?.systemName !== null &&
          e?.systemName !== '' &&
          e?.systemName !== undefined
      )
    })
    // ロケーション情報(ワークスペース or データベース/スキーマ)
    const locations = computed(() => {
      if (!_locations.value) return _locations.value
      const values = []
      if (locationType.value === 0) {
        _locations.value?.database?.forEach((e) => {
          e?.schema?.forEach((j) => {
            if (j?.name !== null && j?.name !== '' && j?.name !== undefined) {
              values?.push({
                id: j?.id,
                name: e?.name + ' / ' + j?.name
              })
            }
          })
        })
      } else if (locationType.value === 1) {
        _locations.value?.workspace?.forEach((e) => {
          if (e?.name !== null && e?.name !== '' && e?.name !== undefined) {
            values?.push({ id: e?.id, name: e?.name })
          }
        })
      }
      return values
    })
    // カテゴリ情報
    const categories = computed(() => {
      if (locationType.value === 0)
        return [
          { name: Category.TABLE },
          { name: Category.VIEW },
          { name: Category.COLUMN }
        ]
      else if (locationType.value === 1)
        return [
          { name: Category.DASHBOARD },
          { name: Category.REPORT },
          { name: Category.DATASET }
        ]
      else return []
    })
    // データオーナー情報
    const owners = computed(() => {
      if (!_owners.value || _owners.value?.length === 0) return _owners.value
      const values = _owners.value?.filter(
        (e) => e?.name !== null && e?.name !== '' && e?.name !== undefined
      )
      values?.push({ id: -1, name: 'データオーナー未設定' }) // 未設定項目を決め打ちで追加
      return values
    })
    // タグ情報
    const tags = computed(() => {
      if (!_tags.value || _tags.value?.length === 0) return _tags.value
      const values = _tags.value?.filter(
        (e) => e?.name !== null && e?.name !== '' && e?.name !== undefined
      )
      values?.push({ id: -1, name: 'タグ未設定' }) // 未設定項目を決め打ちで追加
      return values
    })

    watch(route, (val) => {
      setSearchFromQueryParam()
    })

    // URLのクエリパラメータから検索条件をセット
    const setSearchFromQueryParam = async () => {
      const queryParams = route.value.query
      locationType.value = +(queryParams.locationType || 1)
      word.value = queryParams.keyword || ''
      condition.value = +(queryParams.conditions || 0)
      const locationIds = queryParams['locationIds[]'] || []
      const categoryNames = queryParams['categoryNames[]'] || []
      const ownerIds = queryParams['ownerIds[]'] || []
      const tagIds = queryParams['tagIds[]'] || []
      await fetchSearchConditions()
      selectedSystemId.value =
        systems.value?.filter((item) => item.id === +queryParams.systemId)[0]
          ?.id || systems.value[0]?.id
      selectedlocations.value = locations.value
        .map((item, index) =>
          locationIds?.includes(item?.id?.toString()) ? index : -1
        )
        .filter((item) => item > -1)
      selectedcategories.value = categories.value
        .map((item, index) =>
          categoryNames?.includes(item?.name) ? index : -1
        )
        .filter((item) => item > -1)
      selectedowners.value = owners.value
        .map((item, index) =>
          ownerIds?.includes(item?.id?.toString()) ? index : -1
        )
        .filter((item) => item > -1)
      selectedtags.value = tags.value
        .map((item, index) =>
          tagIds?.includes(item?.id?.toString()) ? index : -1
        )
        .filter((item) => item > -1)
    }

    // ロケーションタイプ切り替えボタン（PowerBI）
    const onPowerBI = () => {
      if (locationType.value === 1) return
      locationType.value = 1
      selectedlocations.value = []
      selectedcategories.value = []
    }
    // ロケーションタイプ切り替えボタン（データベース）
    const onDatabase = () => {
      if (locationType.value === 0) return
      locationType.value = 0
      selectedlocations.value = []
      selectedcategories.value = []
    }
    const onAndCondition = async () => {
      if (condition.value === 0) return
      condition.value = 0
    }
    const onOrCondition = async () => {
      if (condition.value === 1) return
      condition.value = 1
    }

    const databaseBackground = computed(() => {
      if (locationType.value === 0) {
        return '#43A5C4'
      } else {
        return '#FFFFFF'
      }
    })
    const powerBIBackground = computed(() => {
      if (locationType.value === 1) {
        return '#43A5C4'
      } else {
        return '#FFFFFF'
      }
    })
    const databaseColor = computed(() => {
      if (locationType.value === 0) {
        return '#FFFFFF'
      } else {
        return '#43A5C4'
      }
    })
    const powerBIColor = computed(() => {
      if (locationType.value === 1) {
        return '#FFFFFF'
      } else {
        return '#43A5C4'
      }
    })

    const andBackground = computed(() => {
      if (condition.value === 0) {
        return '#43A5C4'
      } else {
        return '#FFFFFF'
      }
    })
    const orBackground = computed(() => {
      if (condition.value === 1) {
        return '#43A5C4'
      } else {
        return '#FFFFFF'
      }
    })
    const andColor = computed(() => {
      if (condition.value === 0) {
        return '#FFFFFF'
      } else {
        return '#43A5C4'
      }
    })
    const orColor = computed(() => {
      if (condition.value === 1) {
        return '#FFFFFF'
      } else {
        return '#43A5C4'
      }
    })
    const locationText = computed(() => {
      if (locationType.value === 0) {
        return i18n.t('search.S0003')
      } else {
        return i18n.t('search.S0004')
      }
    })

    // すべて選択ボタン押下時（ロケーション）
    const onAllSelectLocation = () => {
      if (isAllSelectedLocation.value) {
        isAllSelectedLocation.value = false
        selectedlocations.value = []
      } else {
        isAllSelectedLocation.value = true
        selectedlocations.value = Array.from(
          { length: locations.value?.length },
          (_, i) => i
        )
      }
    }
    watch(selectedlocations, (val) => {
      if (!val || !locations.value) return
      if (val.length === locations.value?.length) {
        isAllSelectedLocation.value = true
      } else {
        isAllSelectedLocation.value = false
      }
    })

    // すべて選択ボタン押下時（カテゴリ）
    const onAllSelectCategory = () => {
      if (isAllSelectedCategory.value) {
        isAllSelectedCategory.value = false
        selectedcategories.value = []
      } else {
        isAllSelectedCategory.value = true
        selectedcategories.value = Array.from(
          { length: categories.value?.length },
          (_, i) => i
        )
      }
    }
    watch(selectedcategories, (val) => {
      if (!val || !categories.value) return
      if (val.length === categories.value?.length) {
        isAllSelectedCategory.value = true
      } else {
        isAllSelectedCategory.value = false
      }
    })

    // すべて選択ボタン押下時（データオーナー）
    const onAllSelectOwner = () => {
      if (isAllSelectedOwner.value) {
        isAllSelectedOwner.value = false
        selectedowners.value = []
      } else {
        isAllSelectedOwner.value = true
        selectedowners.value = Array.from(
          { length: owners.value?.length },
          (_, i) => i
        )
      }
    }
    watch(selectedowners, (val) => {
      if (!val || !owners.value) return
      if (val.length === owners.value?.length) {
        isAllSelectedOwner.value = true
      } else {
        isAllSelectedOwner.value = false
      }
    })

    // すべて選択ボタン押下時（タグ）
    const onAllSelectTag = () => {
      if (isAllSelectedTag.value) {
        isAllSelectedTag.value = false
        selectedtags.value = []
      } else {
        isAllSelectedTag.value = true
        selectedtags.value = Array.from(
          { length: tags.value?.length },
          (_, i) => i
        )
      }
    }
    watch(selectedtags, (val) => {
      if (!val || !tags.value) return
      if (val.length === tags.value?.length) {
        isAllSelectedTag.value = true
      } else {
        isAllSelectedTag.value = false
      }
    })

    // 選択した項目を表示するテキスト（システム）
    const selectedSystemName = computed(() => {
      const val = systems?.value?.find((system) => {
        return system?.id === selectedSystemId?.value
      })
      if (val) return val?.systemName
      return '選択されていません'
    })
    // 選択した項目を表示するテキスト（ロケーション）
    const selectedLocationsName = computed(() => {
      let str = ''
      if (
        locations?.value?.length === 1 &&
        selectedlocations.value?.length === 1
      ) {
        // 選択肢が一つ、且つ、その選択肢を選択している場合
        selectedlocations.value?.forEach((x) => {
          str += locations.value[x]?.name + ', '
        })
        const returnValue = str?.slice(0, -2)
        return returnValue
      } else if (locations.value?.length === selectedlocations.value?.length) {
        // 選択肢の数と、選択した数が同じ場合
        return 'すべて'
      } else if (selectedlocations.value?.length > 0) {
        // 一つ以上選択している場合
        selectedlocations.value?.forEach((x) => {
          str += locations.value[x]?.name + ', '
        })
        const returnValue = str?.slice(0, -2)
        return returnValue
      } else {
        // なにも選択していない場合
        return 'すべて'
      }
    })
    // 選択した項目を表示するテキスト（カテゴリ）
    const selectedCategoriesName = computed(() => {
      let str = ''
      if (
        categories.value?.length === 1 &&
        selectedcategories.value?.length === 1
      ) {
        selectedcategories.value?.forEach((x) => {
          str += Category.getCategoryUCC(categories.value[x]?.name) + ', '
        })
        const returnValue = str?.slice(0, -2)
        return returnValue
      } else if (
        categories.value?.length === selectedcategories.value?.length
      ) {
        return 'すべて'
      } else if (selectedcategories.value?.length > 0) {
        selectedcategories.value?.forEach((x) => {
          str += Category.getCategoryUCC(categories.value[x]?.name) + ', '
        })
        const returnValue = str?.slice(0, -2)
        return returnValue
      } else {
        return 'すべて'
      }
    })
    // 選択した項目を表示するテキスト（データオーナー）
    const selectedOwnersName = computed(() => {
      let str = ''
      if (owners.value?.length === 1 && selectedowners.value?.length === 1) {
        selectedowners.value?.forEach((x) => {
          str += owners.value[x]?.name + ', '
        })
        const returnValue = str?.slice(0, -2)
        return returnValue
      } else if (owners.value?.length === selectedowners.value?.length) {
        return 'すべて'
      } else if (selectedowners.value?.length > 0) {
        selectedowners.value?.forEach((x) => {
          str += owners.value[x]?.name + ', '
        })
        const returnValue = str?.slice(0, -2)
        return returnValue
      } else {
        return 'すべて'
      }
    })
    // 選択した項目を表示するテキスト（タグ）
    const selectedTagsName = computed(() => {
      let str = ''
      if (tags.value?.length === 1 && selectedtags.value?.length === 1) {
        selectedtags.value?.forEach((x) => {
          str += tags.value[x]?.name + ', '
        })
        const returnValue = str?.slice(0, -2)
        return returnValue
      } else if (tags.value?.length === selectedtags.value?.length) {
        return 'すべて'
      } else if (selectedtags.value?.length > 0) {
        selectedtags.value?.forEach((x) => {
          str += tags.value[x]?.name + ', '
        })
        const returnValue = str?.slice(0, -2)
        return returnValue
      } else {
        return 'すべて'
      }
    })

    // 検索実行
    const searchAction = async (word) => {
      appModule.enableLoading()
      let apiUrl = ''
      apiUrl += 'locationType=' + locationType.value
      apiUrl += '&conditions=' + condition.value
      if (locationType.value === 0) {
        apiUrl += '&systemId=' + selectedSystemId.value
      }
      if (
        word !== '' &&
        word !== null &&
        word !== undefined &&
        word?.length > 0
      ) {
        apiUrl += '&keyword=' + encodeURIComponent(word) // 特殊文字列がキーワードとして正しく認識されるようにエンコード
      }
      if (selectedlocations.value?.length > 0) {
        selectedlocations.value?.forEach((e) => {
          apiUrl += '&locationIds[]=' + locations.value[e]?.id
        })
      }
      if (selectedcategories.value?.length > 0) {
        selectedcategories.value?.forEach((e) => {
          apiUrl += '&categoryNames[]=' + categories.value[e]?.name
        })
      }
      let ownerQueryString = ''
      selectedowners.value?.forEach((e) => {
        if (owners.value[e]?.id !== null && owners.value[e]?.id !== '') {
          ownerQueryString += '&ownerIds[]=' + owners.value[e]?.id
        } else {
          ownerQueryString += '&ownerIds[]=' + owners.value[e]?.id
        }
      })
      if (owners.value?.length !== selectedowners.value?.length) {
        apiUrl += ownerQueryString
      }

      let tagQueryString = ''
      selectedtags.value?.forEach((e) => {
        tagQueryString += '&tagIds[]=' + tags.value[e].id
      })
      if (tags.value?.length !== selectedtags.value?.length) {
        apiUrl += tagQueryString
      }

      await fetchSearch('/searchs?' + apiUrl)
      await setInputWords(word)
      emit('onSearchRedirect', apiUrl)
      appModule.disableLoading()
    }

    function showMenu() {
      menuflg.value = !menuflg.value
    }
    function showOff() {
      menuflg.value = false
      showalert.value = false
    }
    const selectMenu = (index) => {
      word.value = getInputWords.value[index]
      showOff()
    }
    const searchWord = (word) => {
      // １つもチェックされていない、もしくは全てチェックしている場合はtrue
      // 全てチェックしているが、リスト値が１つしかない場合はfalse
      const allselectedflg =
        (!selectedcategories.value?.length ||
          (categories.value?.length > 1 &&
            categories.value?.length === selectedcategories.value?.length)) &&
        (!selectedlocations.value?.length ||
          (locations.value?.length > 1 &&
            locations.value?.length === selectedlocations.value?.length)) &&
        (!selectedowners.value?.length ||
          (owners.value?.length > 1 &&
            owners.value?.length === selectedowners.value?.length)) &&
        (!selectedtags.value?.length ||
          (tags.value?.length > 1 &&
            tags.value?.length === selectedtags.value?.length))

      if (!word?.trim() && allselectedflg) {
        showalert.value = true
      } else {
        menuflg.value = false
        searchAction(word)
      }
    }

    // 以下初期ロード時に呼ばれる(setup直下)
    setSearchFromQueryParam()

    return {
      getInputWords,
      arrow_icon,
      magnify_icon,
      exclamation_icon,
      mdiChevronDown,
      mdiCheckboxBlankOutline,
      mdiCheckboxMarked,
      mdiMagnify,
      mdiCloseCircle,
      locationType,
      systems,
      Category,
      locations,
      categories,
      owners,
      tags,
      selectedSystemId,
      selectedlocations,
      selectedcategories,
      selectedowners,
      selectedtags,
      showalert,
      menuflg,
      word,
      isAllSelectedLocation,
      isAllSelectedCategory,
      isAllSelectedOwner,
      isAllSelectedTag,
      i18n,
      onDatabase,
      onPowerBI,
      databaseBackground,
      powerBIBackground,
      databaseColor,
      powerBIColor,
      onAndCondition,
      onOrCondition,
      andBackground,
      orBackground,
      andColor,
      orColor,
      locationText,
      onAllSelectLocation,
      onAllSelectCategory,
      onAllSelectOwner,
      onAllSelectTag,
      selectedSystemName,
      selectedLocationsName,
      selectedCategoriesName,
      selectedOwnersName,
      selectedTagsName,
      searchAction,
      showMenu,
      showOff,
      selectMenu,
      searchWord
    }
  }
})
</script>
<style lang="stylus" scoped>
.searchbg
  position relative
  top 0
  margin auto
  width calc(100vw - 64px - 48px * 2)
  min-width calc(190px + 810px)
  min-height 190px
  max-height 190px
  background-color #DFECF0
.up-index
  width 100%
  position absolute
  padding-left clamp(60px, (calc(((100vw - 64px - 48px * 2)-(190px + 810px)) /2)), (calc(((100vw - 64px - 48px * 2)-(190px + 810px)) /2)))
  padding-right clamp(60px, (calc(((100vw - 64px - 48px * 2)-(190px + 810px)) /2)), (calc(((100vw - 64px - 48px * 2)-(190px + 810px)) /2)))
.input-area
  top 40px
.row-wrapper
  display flex
  flex-direction row
  flex-wrap nowrap
.condition-area
  top 100px
  box-sizing border-box
.condition-area >>> .row
  margin 0
.input-area-list
  padding-left 0
  padding-right 0
.input-area-field
  width 810px
  max-width 810px
  display inline-block
.search
  width 100%
.and-btn
  border-radius 5px 0 0 5px
  width 49px
  min-width 49px
  height 32px
  vertical-align top
  display inline-block
  margin 3px 0 3px 3px
  border 1px solid #43A5C4
.or-btn
  border-radius 0 5px 5px 0
  width 49px
  min-width 49px
  height 32px
  vertical-align top
  display inline-block
  margin 3px 3px 3px 0
  border 1px solid #43A5C4
.condition-btn-text
  font-size 13px
  margin 0
.search-btn
  min-width 74px
  max-width 74px
  height auto
  padding 0 16px
  box-shadow 0px 2px 4px #00000033
.search-btn >>> .v-btn__content
  padding 10px
.condition-child-area
  width calc((190px + 810px - 88px) /4)
.condition-child-area >>> .v-btn
  width 100%
  min-height 48px
  max-height 48px
  padding 16px 15px 16px 15px
  border-radius 9px
  border-color #EAEAEA !important
  background-color white !important
  > .v-btn__content
    justify-content space-between
    color #41434e
.input-area >>> .input-area-list > .v-btn
  width 100%
  min-height 48px
  max-height 48px
  padding 16px 10px 16px 15px
  border-top-left-radius 9px
  border-top-right-radius 0px
  border-bottom-left-radius 9px
  border-bottom-right-radius 0px
  border-color #EAEAEA !important
  background-color white !important
  > .v-btn__content
    justify-content space-between
    color #41434e
.v-menu__content
  max-height calc( 100vh - 190px)
  box-shadow 0px 2px 4px #00000033 !important
  border-top-right-radius 0px !important
  border-top-left-radius 0px !important
  border-bottom-right-radius 4px !important
  border-bottom-left-radius 4px !important
.v-menu__content >>> .v-list-item__title
  color #43a5c4
.condition-child-area:not(:first-child)
  padding-left 8px
.v-list
  padding 0px
.v-list-item
  min-height 45px !important
  max-height 45px !important
::v-deep .v-list-item
  padding-left 24px
::v-deep .v-list-item__title
  font-size 14px !important
  color #41434E
.v-divider
  border-color #EAEAEA !important
.v-list-group >>> .v-list-group__items
  box-shadow 0px 2px 4px #00000033 !important
.condition-area >>> .v-icon.v-icon
  color #43A5C4
.input-area-list >>> .v-icon.v-icon
  color #43A5C4
.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon
  margin-right 10px !important
.v-input
  font-size 14px
  color #909090
.clipbtn-area
  width calc(74px + 12px * 2)
  text-align center
.addclip-icon
  top 25px
  left -6px
  padding 14px 10px 10px
  width 40px !important
  height 40px !important
  box-shadow 0px 2px 4px #00000033
.addclip-icon:hover
  background-color #F7FDFF !important
.v-application--is-ltr .v-text-field .v-input__append-inner
  padding 0 7px !important
  margin-top 15px
.search >>> .v-icon__svg
  fill #51B6D6
.search >>> .v-icon__svg:hover
  fill #78C6DE
.search >>> .v-text-field.v-text-field--enclosed .v-input__slot
  padding 0 12px 0 16px
  min-height 48px
  max-height 48px
.search >>> .v-text-field--outlined fieldset
  background-color white
  border-top-left-radius 0px
  border-top-right-radius 9px
  border-bottom-left-radius 0px
  border-bottom-right-radius 9px
  border-color #EAEAEA
  width 100%
.search >>> .v-input__icon--clear
  margin-right calc(22px - 2px)
  margin-top -4px
.input-area-list >>> div.v-list-item__icon.v-list-group__header__append-icon
  margin-left 0 !important
.input-area-list >>> .v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon
  min-width 0
.menu-place
  top -32px
  border-top-left-radius 0px
  border-top-right-radius 0px
  border-bottom-left-radius 4px
  border-bottom-right-radius 4px
  border-color #EAEAEA
  box-shadow 0px 2px 4px #00000033
  z-index 100
.menu-place >>> .v-list-item__title
  color #43a5c4
.label-color
  color #777777
  font-size 12px
.link-color
  color #43a5c4
.link-color:hover
  color #51B6D6
.icon-size
  width 1em
  height auto
  margin-right 3px
.margin-caption-bottom
  margin-bottom 6px
.location-span, .category-span, .owner-span, .tag-span
  max-width 170px
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
.list-all-select
  margin-top 12px
  margin-bottom 12px
.list-item-all-select
  padding-left 14px
.font-weight-bold
  text-transform none
@media screen and (max-width: 1280px)
  .input-area-field
    width calc(100vw - 470px)
    min-width 690px
</style>
