import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

// @ts-ignore
import {
  addComponent,
  addDirective,
  addHelpers,
  addI18n,
  addVuetify,
  addVuex,
  addKonva,
  bootstrapVueContext,
  compositeConfiguration,
  customWrapper
} from '~/tests/utils'
// @ts-ignore
import resultModule from '~/store/result/results'
// @ts-ignore
import searchModule from '~/store/search/searches'


// @ts-ignore
import Search from '@/components/base/Search'
// @ts-ignore
import HelpDialog from '@/components/helpers/dialog/Dialog'
// @ts-ignore
import LineageTab from '@/components/result/Tabs/LineageTab/LineageTab'

// @ts-ignore
import List from '@/components/result/List'


import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import {VTooltip} from "v-tooltip";


const lineageData = {
  'groups': [{
    'id': 61235352,
    'title': 'Azure Synapse',
    'children': [{
      'label': 'Tables',
      'items': [{
        'id': 34033816,
        'title': 'Security_UserMapper_GMX',
        'label': 'table',
        'logicalName': '',
        'isRelated': true
      }]
    }]
  }, {
    'id': 61259776,
    'title': 'SQL Database MI',
    'children': [{
      'label': 'Tables',
      'items': [{
        'id': 4952216,
        'title': 'RLS_UserRegionMapper_GMX',
        'label': 'table',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5013592,
        'title': 'Security_UserMapper_GMX',
        'label': 'table',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5288096,
        'title': 'RLS_UserCompanyMapper_GMX',
        'label': 'table',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 9699536,
        'title': 'RLS_UserBUMapper_GMX',
        'label': 'table',
        'logicalName': '',
        'isRelated': false
      }]
    }, {
      'label': 'Views',
      'items': [{
        'id': 5369896,
        'title': 'SAP_COM_EV_Order',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5373952,
        'title': 'SAP_COM_EV_CostCenterHier',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5398616,
        'title': 'PST_ZZM_EVF_SubCategory_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5435480,
        'title': 'SAP_COM_EV_Project',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5439576,
        'title': 'SAP_COM_EVF_ProfitCenterHierYM_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5443736,
        'title': 'PST_ZZM_EVF_Distributor_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5447760,
        'title': 'SAP_COM_EVF_ControlAreaAssign_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5517464,
        'title': 'SAP_FIM_EVF_ProcessingCategory_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5521560,
        'title': 'SAP_COM_EVF_CostCenterGrp_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5533848,
        'title': 'PSL_ZZM_EV_Date',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5554264,
        'title': 'PSL_ZZM_EV_FiscalPeriodExt',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5755040,
        'title': 'PST_ZZM_EVF_PLCategory_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5783712,
        'title': 'SAP_COM_EVF_AssignUOM_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5886112,
        'title': 'SAP_COM_EVF_CostCenterHier_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 5890208,
        'title': 'PST_ZZM_EVF_PlanningVersion_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 10612944,
        'title': 'SAP_COM_EV_CostCenterEx',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 10658000,
        'title': 'SAP_COM_EV_ProfitCenterEx',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 10662096,
        'title': 'SAP_COM_EV_ProfitCenterHier',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 10678480,
        'title': 'SAP_COM_EV_WBSElement',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 10801360,
        'title': 'SAP_COM_EVF_ProfitCenterHier_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      }, {
        'id': 10805456,
        'title': 'SAP_COM_EVF_CostCenterHierYM_GMX',
        'label': 'view',
        'logicalName': '',
        'isRelated': false
      },
        {
          'id': 10813648,
          'title': 'SAP_COM_EVF_ProfitCenterGrp_GMX',
          'label': 'view',
          'logicalName': '',
          'isRelated': false
        }]
    }]
  }], 'pipelineId': 61231256
};
const groups = [
  {
    "id": 61259776,
    "title": "SQL Database MI",
    "dependsOn": [],
    "children": [
      {
        "id": 1,
        "dependsOn": 0,
        "label": "Tables",
        "items": [
          {
            "id": 4952216,
            "title": "RLS_UserRegionMapper_GMX",
            "label": "table",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5013592,
            "title": "Security_UserMapper_GMX",
            "label": "table",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5288096,
            "title": "RLS_UserCompanyMapper_GMX",
            "label": "table",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 9699536,
            "title": "RLS_UserBUMapper_GMX",
            "label": "table",
            "desc": "",
            "isRelated": false,
            "selected": false
          }
        ],
        "open": false
      },
      {
        "id": 2,
        "dependsOn": 1,
        "label": "Views",
        "items": [
          {
            "id": 5369896,
            "title": "SAP_COM_EV_Order",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5373952,
            "title": "SAP_COM_EV_CostCenterHier",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5398616,
            "title": "PST_ZZM_EVF_SubCategory_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5435480,
            "title": "SAP_COM_EV_Project",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5439576,
            "title": "SAP_COM_EVF_ProfitCenterHierYM_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5443736,
            "title": "PST_ZZM_EVF_Distributor_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5447760,
            "title": "SAP_COM_EVF_ControlAreaAssign_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5517464,
            "title": "SAP_FIM_EVF_ProcessingCategory_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5521560,
            "title": "SAP_COM_EVF_CostCenterGrp_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5533848,
            "title": "PSL_ZZM_EV_Date",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5554264,
            "title": "PSL_ZZM_EV_FiscalPeriodExt",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5755040,
            "title": "PST_ZZM_EVF_PLCategory_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5783712,
            "title": "SAP_COM_EVF_AssignUOM_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5886112,
            "title": "SAP_COM_EVF_CostCenterHier_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 5890208,
            "title": "PST_ZZM_EVF_PlanningVersion_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 10612944,
            "title": "SAP_COM_EV_CostCenterEx",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 10658000,
            "title": "SAP_COM_EV_ProfitCenterEx",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 10662096,
            "title": "SAP_COM_EV_ProfitCenterHier",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 10678480,
            "title": "SAP_COM_EV_WBSElement",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 10801360,
            "title": "SAP_COM_EVF_ProfitCenterHier_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 10805456,
            "title": "SAP_COM_EVF_CostCenterHierYM_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          },
          {
            "id": 10813648,
            "title": "SAP_COM_EVF_ProfitCenterGrp_GMX",
            "label": "view",
            "desc": "",
            "isRelated": false,
            "selected": false
          }
        ],
        "open": false
      }
    ],
    "open": false
  },
  {
    "id": 61235352,
    "title": "Azure Synapse",
    "dependsOn": [
      61259776
    ],
    "children": [
      {
        "id": 3,
        "dependsOn": 2,
        "label": "Tables",
        "items": [
          {
            "id": 34033816,
            "title": "Security_UserMapper_GMX",
            "label": "table",
            "desc": "",
            "isRelated": true,
            "selected": false
          }
        ],
        "open": false
      }
    ],
    "open": false,
    "calcHeight": 186
  }
]

jest.mock('vuex-composition-helpers', () => {
  const resultModule = {
    useGetters: (params: string[]) => ({
      pipelines: {
        value: {
          pipelines: []
        }
      }
    }),
    useMutations: (params: string[]) => ({
      SET_SELECTED_ITEM: jest.fn(),
      ADD_SHOW_ITEMS: jest.fn(),
    }),
    useActions: (params: string[]) => ({
      fetchPipelines: () => {
        return lineageData
      },
      fetchLineage: jest.fn(),
    }),
  }
  const createNamespacedHelpers = (moduleName: string) => resultModule

  return { createNamespacedHelpers }
})

describe('LineageTab.vue',() => {
  let vueContext: any = null
  let searchWrapper: any = null
  let lineageWrapper: any = null
  const $route = {
    path: '/result'
  }
  const router = {
    push: jest.fn()
  }

  resultModule.fetchSearch = jest.fn()
  resultModule.fetchLineage = jest.fn()
  resultModule.fetchPipelines = jest.fn()
  resultModule.fetchTableDetail = jest.fn()
  resultModule.fetchViewDetail = jest.fn()
  searchModule.setInputWordAction = jest.fn()
  searchModule.setSelectLocationsAction = jest.fn()
  searchModule.setSelectCategoriesAction = jest.fn()
  searchModule.setSelectOwnersAction = jest.fn()
  searchModule.setSelectTagsAction = jest.fn()
  searchModule.fetchLocations = jest.fn()
  searchModule.fetchCategories = jest.fn()
  searchModule.fetchOwners =  jest.fn()
  searchModule.fetchTags =  jest.fn()

  beforeEach(async () => {
    // @ts-ignore
    vueContext = bootstrapVueContext(
      compositeConfiguration(addVuex, addVuetify, addHelpers(), addI18n(),addKonva, addComponent('HelpDialog', HelpDialog), addDirective('tooltip', VTooltip))
    )
    /*vueContext.mocks = {
      $route,
      router
    }*/
    lineageWrapper = customWrapper(LineageTab, vueContext)
    lineageWrapper.setProps({ isExpanded: true })
    lineageWrapper.setData({
      lineage: lineageData,
      groups: groups,
      pipelineList: [{"id":61231256,"interfaceId":"GMX02550","pipelineName":"SPECTRE_COPY_NEST_GMX02550"}]
    })
  })

  afterEach(() => {
    vueContext.teardownVueContext()
    jest.restoreAllMocks()
  })

  describe('LeftPanel Lineage', async () => {
    it('Test case: display left panel', async () => {

      const expandNavBtn = lineageWrapper.find('.expand-nav')
      expandNavBtn.trigger('click')
      expect(lineageWrapper.find('.left-nav').isVisible()).toBe(true)

      const resizeRight = lineageWrapper.find('#mainNav > div.resizer-right')
      expect(resizeRight.exists()).toBe(true)
      const pineLine = lineageWrapper.find('.pine-line-nav')
      expect(pineLine.exists()).toBe(true)
      const locationList = lineageWrapper.find('.location-list')
      expect(locationList.exists()).toBe(true)

      // expect(axiosSpy).toHaveBeenCalledTimes(1)
      // axiosSpy.mockRestore();
    })
    it('Test case: shrink leftpanel', async () => {
      const shrinkLeftpanel = lineageWrapper.find('.shrink-nav')
      await shrinkLeftpanel.trigger('click')
      expect(lineageWrapper.find('.left-nav').isVisible()).toBe(false)
    })
    it('Test case: render pineline display', async () => {
      const expandNavBtn = lineageWrapper.find('.expand-nav')
      expandNavBtn.trigger('click')
      const piplineItems = lineageWrapper.findAll('.pine-line-item v-list-tile-title')
      expect(piplineItems.exists()).toBe(true)
      expect(piplineItems.length).toBe(1)
      const pinelineItem = piplineItems.at(0)
      expect(pinelineItem.is('v-list-tile-title')).toBe(true)
      expect(pinelineItem.text()).toBe('SPECTRE_COPY_NEST_GMX02550')
    })
    it('Test case: hover pineline item', async () => {
      const expandNavBtn = lineageWrapper.find('.expand-nav')
      expandNavBtn.trigger('click')
      const pinelineItem = lineageWrapper.find('.pine-line-item')
      await pinelineItem.trigger('mouseover')
      expect(pinelineItem.classes()).toContain("pine-line-item")
    })

    it('Test case: render location item display', async () => {
      const locationItemArr = lineageWrapper.findAll('.location-list > .location-item .title-li p')
      expect(locationItemArr).toHaveLength(3)
      expect(locationItemArr.at(0).text()).toBe('Tables')
      expect(locationItemArr.at(1).text()).toBe('Views')
      expect(locationItemArr.at(2).text()).toBe('Tables')
    })
    it('Test case: click location item title', async () => {
      const locationItemArr = lineageWrapper.findAll('.location-list .location-item .title-li')
      await locationItemArr.at(2).trigger('click')
      console.log(lineageWrapper.html())
      expect(lineageWrapper.findAll('.child-li .item')).toHaveLength(1)
    })

    it('Test case: click location item child node', async () => {
      const locationItemChild = lineageWrapper.findAll('.child-li .item')
      await locationItemChild.at(0).trigger('click')
      expect(locationItemChild.at(0).classes()).toContain('selected')
      expect(lineageWrapper.find('#detailPanel').isVisible()).toBe(true)
    })
  })
  describe('Search Input', async () => {
    it('Test case: display search input', async () => {
      const search = lineageWrapper.find('.input-box')
      expect(search.exists()).toBe(true)
    })
    it('Test case: clear search input', async () => {
      const clearBtn = lineageWrapper.findAll('#lineage-container > div.actions .action-btn')
      await clearBtn.trigger('click')
      expect(lineageWrapper.find('.input-box').text()).toBe('')
    })
  })
  describe('Detail Panel', async () => {
    it('Test case: display detail panel', async () => {
      await lineageWrapper.setData({
        isShowDetail: true
      })
      expect(lineageWrapper.find('#detailPanel').isVisible()).toBe(true)
    })
    it('Test case: click button close detail panel', async () => {
      const button = lineageWrapper.find('#detailPanel > div.head > button')
      await button.trigger('click')
      expect(lineageWrapper.find('#detailPanel').isVisible()).toBe(false)
    })
  })
})
