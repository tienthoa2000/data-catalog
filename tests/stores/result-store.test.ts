import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

import axios from 'axios'
// @ts-ignore
import { Category } from '~/constants/Category'
import {
  describe,
  beforeEach,
  afterEach,
  expect,
  it,
  jest
} from '@jest/globals'

//Define Axios mock
jest.mock('~/utils/api', () => {
  return {
    $axios: {
      $get: jest.fn((url: string) => {
        if (
          !url ||
          typeof url !== 'string' ||
          url.indexOf('null') !== -1 ||
          url.indexOf('undefined') !== -1
        )
          return Promise.resolve({})
        if (url && url.indexOf('views') !== -1) {
          const id = (url.split('views/').pop() || '').split('/').shift() || ''
          if (+id === 0) return Promise.resolve({})
          return Promise.resolve({
            data: {
              label: Category.VIEW,
              values: {
                columns: [],
                owner: {},
                location: {},
                tags: [],
                module: {}
              }
            }
          })
        }
        if (url && url.indexOf('tables') !== -1) {
          const id = (url.split('tables/').pop() || '').split('/').shift() || ''
          if (+id === 0) return Promise.resolve({})
          return Promise.resolve({
            data: {
              label: Category.TABLE,
              values: {
                columns: [],
                owner: {},
                location: {},
                tags: [],
                module: {}
              }
            }
          })
        }
        if (url && url.indexOf('searchs') !== -1) {
          return Promise.resolve({
            data: {
              label: Category.TABLE,
              values: [{ label: Category.TABLE }, { label: Category.VIEW }]
            }
          })
        }
        return Promise.resolve({})
      })
    }
  }
})

const localVue = createLocalVue()
localVue.use(Vuex)

// @ts-ignore
import ResultModule from '~/store/result/results'

describe('ResultStoreModule', () => {
  it('@Mutation SET_SELECTED_ITEM', () => {
    // 2. Execute mutation
    const VALUE: any = { id: 1, label: Category.TABLE }
    ResultModule.SET_SELECTED_ITEM(VALUE)

    // 3. Assert the expected changes
    expect(ResultModule.selectedItem).toEqual(VALUE)
  })

  describe('@Action fetchTableDetail', () => {
    it('Test case: when id param not null', async () => {
      // 2. Execute and await action
      await ResultModule.fetchTableDetail(1)

      // 3. Assert the expected changes
      expect(ResultModule.selectedItem).not.toBeNull()
      expect(ResultModule.selectedItem.label).toEqual(Category.TABLE)
    })
    it('Test case: when id param is 0', async () => {
      // 2. Execute and await action
      await ResultModule.fetchTableDetail(0)

      // 3. Assert the expected changes
      expect(ResultModule.selectedItem).not.toBeNull()
      expect(ResultModule.selectedItem.label).toBeUndefined()
    })
  })

  describe('@Action fetchViewDetail', () => {
    it('Test case: when id param not null', async () => {
      // 2. Execute and await action
      await ResultModule.fetchViewDetail(1)

      // 3. Assert the expected changes
      expect(ResultModule.selectedItem).not.toBeNull()
      expect(ResultModule.selectedItem.label).toEqual(Category.VIEW)
    })

    it('Test case: when id param is 0', async () => {
      // 2. Execute and await action
      await ResultModule.fetchViewDetail(0)

      // 3. Assert the expected changes
      expect(ResultModule.selectedItem).not.toBeNull()
      expect(ResultModule.selectedItem.label).toBeUndefined()
    })
  })
  describe('@Action fetchSearch', () => {
    it('Test case: when id param is null', async () => {
      // 2. Execute and await action
      await ResultModule.fetchSearch(null)

      // 3. Assert the expected changes
      expect(ResultModule.resultList.length).toBe(0)
    })
    it('Test case: when id param is not string', async () => {
      // 2. Execute and await action
      await ResultModule.fetchSearch(1)

      // 3. Assert the expected changes
      expect(ResultModule.resultList.length).toBe(0)
    })
    it('Test case: when id param not null', async () => {
      // 2. Execute and await action
      await ResultModule.fetchSearch(
        '/searchs?categoryNames[]=table&keyword=ZZM&locationIds[]=82190536&categoryNames[]=view&tagIds[]=125018176&locationIds[]=165761240&tagIds[]=247730304&ownerIds[]=83808304'
      )

      // 3. Assert the expected changes
      expect(ResultModule.resultList).not.toBeNull()
      expect(ResultModule.resultList.length).toBe(2)
    })
  })

  describe('get columns', () => {
    it('returns empty array for null value', () => {
      // 1. Prepare the state
      ResultModule.SET_SELECTED_ITEM(null)

      // 2. Assert the return value
      expect(ResultModule.columns).toEqual([])
    })

    it('returns empty string for null value', () => {
      // 1. Prepare the state
      ResultModule.SET_SELECTED_ITEM({ columns: [{ id: 1, name: 'column 1' }] })

      // 2. Assert the return value
      expect(ResultModule.columns).not.toBeNull()
      expect(ResultModule.columns.length).toBe(1)
    })
  })
})
