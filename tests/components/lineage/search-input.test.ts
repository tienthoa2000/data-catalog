import {createLocalVue} from '@vue/test-utils'
import vueCompositionApi from '@vue/composition-api'
import Vuex from 'vuex'
import Vue from 'vue'

// @ts-ignore
import {addHelpers, addVuetify, addVuex, bootstrapVueContext, compositeConfiguration, customWrapper, addComponent, addI18n } from '~/tests/utils'

const localVue = createLocalVue()
localVue.use(Vuex)
// @ts-ignore
import resultModule from '~/store/result/results'
// @ts-ignore
import searchModule from '~/store/search/searches'


// @ts-ignore
import Search from '@/components/base/Search'
// @ts-ignore
import HelpDialog from '@/components/helpers/dialog/Dialog'



import {describe, beforeEach, beforeAll, afterEach, expect, it, jest} from "@jest/globals"

describe('Search.vue', () => {
  let vueContext:any = null
  let wrapper:any = null
  const $route = {
    path: '/result'
  }
  const router = {
    push: jest.fn()
  }

  resultModule.fetchSearch = jest.fn()
  searchModule.setInputWordAction = jest.fn()
  searchModule.setSelectLocationsAction = jest.fn()
  searchModule.setSelectCategoriesAction = jest.fn()
  searchModule.setSelectOwnersAction = jest.fn()
  searchModule.setSelectTagsAction = jest.fn()
// @ts-ignore
  searchModule.fetchLocations = jest.fn()
// @ts-ignore
  searchModule.fetchCategories = jest.fn()

  searchModule.fetchOwners =  jest.fn()
// @ts-ignore
  searchModule.fetchTags =  jest.fn()

  beforeEach(() => {
    // @ts-ignore
    vueContext = bootstrapVueContext(
      compositeConfiguration(addVuex, addVuetify, addHelpers(), addI18n(), addComponent('HelpDialog', HelpDialog))
    )
    vueContext.mocks = {
      $route,
      router
    }
    wrapper = customWrapper(Search, vueContext)
  })

  afterEach(() => {
    vueContext.teardownVueContext()
    jest.restoreAllMocks()
  })
  //

})
