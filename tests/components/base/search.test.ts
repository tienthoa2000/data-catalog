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

    describe('Search Button', () => {

        it('Test case: do not redirect to result page when user not input to search input and click to search button', async () => {
            const spy = jest.spyOn(wrapper.vm, 'searchWord')
            const searchInput = wrapper.findComponent({name: 'v-text-field'})
            expect(searchInput.exists()).toBe(true)
            const searchBtn = wrapper.find('.search-btn')
            expect(searchBtn.exists()).toBe(true)
            searchBtn.trigger('click')
            await wrapper.vm.$nextTick()
            expect(spy).toHaveBeenCalled()
            expect(wrapper.vm.$route.path).toEqual('/')
        })

        it('Test case: redirect to result page when user click to search button', async () => {
            const spy = jest.spyOn(wrapper.vm, 'searchWord')
            const searchInput = wrapper.findComponent({name: 'v-text-field'})
            expect(searchInput.exists()).toBe(true)
            const searchBtn = wrapper.find('.search-btn')
            expect(searchBtn.exists()).toBe(true)
            await wrapper.setData({word: 'S'})

            // set default selected param
            await wrapper.setData({selectedlocations: [], selectedcategories: [], selectedowners: [], selectedtags: []})
            await searchBtn.trigger('click')
            await wrapper.vm.$nextTick()
            expect(spy).toHaveBeenCalled()
            expect(wrapper.vm.$route.path).toEqual('/result')
        })
    })

    describe('Condition List', () => {
        beforeEach(() => {
            wrapper.setData({
                owners: [{
                    "id": 123723888,
                    "label": "owner",
                    "Unnamed: 0": "1",
                    "name": "システム部門",
                    "language": "ja",
                    "email": "system@test.com"
                }, {
                    "id": 123723889,
                    "label": "owner",
                    "Unnamed: 0": "2",
                    "name": "システム部門2",
                    "language": "ja",
                    "email": "system2@test.com"
                }],
                tags: [{
                  "id": 241680,
                  "label": "tag",
                  "language": "ja",
                  "code": 2,
                  "name": "#販売",
                  "Unnamed: 0": 2
                },
                {
                    "id": 270424,
                    "label": "tag",
                    "language": "ja",
                    "code": 1,
                    "name": "#販売計画",
                    "Unnamed: 0": 1
                }],
                categories: [{
                  "id": 274520,
                  "label": "category",
                  "language": "ja",
                  "code": 2,
                  "name": "ビュー",
                  "Unnamed: 0": 2
                },
                {
                    "id": 282632,
                    "label": "category",
                    "language": "ja",
                    "code": 1,
                    "name": "テーブル",
                    "Unnamed: 0": 1
                }],
                locations: [{
                  "id": 205639896,
                  "label": "location",
                  "Unnamed: 0": "1",
                  "name": "PST_DWH",
                  "language": "ja"
                }]
              })
            })
        })
        it('Test case: when user not input to search input and to select all items of list, the warning dialog should be show', async () => {
          const searchInput = wrapper.findComponent({name: 'v-text-field'})
          expect(searchInput.exists()).toBe(true)
          const searchBtn = wrapper.find('.search-btn')
          expect(searchBtn.exists()).toBe(true)
          await wrapper.setData({word: null})

          // unset all params
          await wrapper.setData({selectedlocations: [], selectedcategories: [], selectedowners: [], selectedtags: []})
          await searchBtn.trigger('click')
          await wrapper.vm.$nextTick()
          const dialog = wrapper.findComponent({name: 'HelpDialog'})
          expect(dialog.exists()).toBe(true)
          expect(dialog.isVisible()).toBe(true)
          expect(dialog.props().alerttext).toEqual('search.S0007')
          expect(dialog.props().btntext).toEqual('search.S0008')
        })

        it('Test case: when user not input to search input and not to select any items of list, the warning dialog should be show', async () => {
          const searchInput = wrapper.findComponent({name: 'v-text-field'})
          expect(searchInput.exists()).toBe(true)
          const searchBtn = wrapper.find('.search-btn')
          expect(searchBtn.exists()).toBe(true)
          await wrapper.setData({word: null})

          // set default selected param
          await wrapper.setData({selectedlocations: [0], selectedcategories: [0, 1], selectedowners: [0, 1], selectedtags: [0, 1]})
          await searchBtn.trigger('click')
          await wrapper.vm.$nextTick()
          const dialog = wrapper.findComponent({name: 'HelpDialog'})
          expect(dialog.exists()).toBe(true)
          expect(dialog.isVisible()).toBe(true)
          expect(dialog.props().alerttext).toEqual('search.S0007')
          expect(dialog.props().btntext).toEqual('search.S0008')
        })

})
