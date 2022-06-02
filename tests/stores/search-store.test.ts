import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

// @ts-ignore
import SearchModule from '~/store/search/searches'

// @ts-ignore
import { Category } from '~/constants/Category'
import { describe, beforeAll, afterEach, expect, it } from '@jest/globals'

describe('SearchStoreModule', () => {
  //-- LOCATIONS
  it('@Mutation SET_LOCATIONS', () => {
    // 2. Execute mutation
    const VALUE: any = { id: 205639896, name: 'PST_DWH' }
    SearchModule.SET_LOCATIONS(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule._locations).toEqual(VALUE)
  })

  it('@Mutation SET_SELECT_LOCATIONS', () => {
    // 2. Execute mutation
    const VALUE: any = []
    SearchModule.SET_SELECT_LOCATIONS(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule.selectLocations).toEqual(VALUE)
  })

  it('@Mutation SET_SELECT_LOCATIONS', () => {
    // 2. Execute mutation
    const VALUE: any = [0]
    SearchModule.SET_SELECT_LOCATIONS(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule.selectLocations).toEqual(VALUE)
  })

  it('@Action fetchLocations', async () => {
    // 2. Execute and await action
    await SearchModule.fetchLocations()

    // 3. Assert the expected changes
    expect(SearchModule._locations).not.toBeNull()
    expect(SearchModule._locations.id.exists()).toBe(true)
    expect(SearchModule._locations.name.exists()).toBe(true)
  })

  describe('get location', () => {
    it('returns empty array for null value', () => {
      // 1. Prepare the state
      const VALUE: any = []
      SearchModule.SET_SELECT_LOCATIONS(VALUE)

      // 2. Assert the return value
      expect(SearchModule.selectLocations).toEqual(VALUE)
    })

    it('returns location values', () => {
      // 1. Prepare the state
      const VALUE: any = [0]
      SearchModule.SET_SELECT_LOCATIONS(VALUE)

      // 2. Assert the return value
      expect(SearchModule.selectLocations).toEqual(VALUE)
    })
  })

  //-- CATEGORIES
  it('@Mutation SET_CATEGORIES', () => {
    // 2. Execute mutation
    const VALUE: any = {
      id: 274520,
      name: Category.getCategoryUCC(Category.VIEW)
    }
    SearchModule.SET_CATEGORIES(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule._categories).toEqual(VALUE)
  })

  it('@Mutation SET_SELECT_CATEGORIES', () => {
    // 2. Execute mutation
    const VALUE: any = []
    SearchModule.SET_SELECT_CATEGORIES(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule.selectCategories).toEqual(VALUE)
  })

  it('@Mutation SET_SELECT_CATEGORIES', () => {
    // 2. Execute mutation
    const VALUE: any = [0]
    SearchModule.SET_SELECT_CATEGORIES(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule.selectCategories).toEqual(VALUE)
  })

  it('@Action fetchLocations', async () => {
    // 2. Execute and await action
    await SearchModule.fetchCategories()

    // 3. Assert the expected changes
    expect(SearchModule._categories).not.toBeNull()
    expect(SearchModule._categories.id.exists()).toBe(true)
    expect(SearchModule._categories.label.exists()).toBe(true)
    expect(SearchModule._categories.name.exists()).toBe(true)
  })

  describe('get category', () => {
    it('returns empty array for null value', () => {
      // 1. Prepare the state
      const VALUE: any = []
      SearchModule.SET_SELECT_CATEGORIES(VALUE)

      // 2. Assert the return value
      expect(SearchModule.selectCategories).toEqual(VALUE)
    })

    it('returns location values', () => {
      // 1. Prepare the state
      const VALUE: any = [0]
      SearchModule.SET_SELECT_CATEGORIES(VALUE)

      // 2. Assert the return value
      expect(SearchModule.selectCategories).toEqual(VALUE)
    })
  })

  //-- OWNER
  it('@Mutation SET_OWNERS', () => {
    // 2. Execute mutation
    const VALUE: any = {
      id: 311320,
      email: 'system@test.com',
      name: 'システム部門'
    }
    SearchModule.SET_OWNERS(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule._owners).toEqual(VALUE)
  })

  it('@Mutation SET_SELECT_OWNERS', () => {
    // 2. Execute mutation
    const VALUE: any = []
    SearchModule.SET_SELECT_OWNERS(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule.selectOwners).toEqual(VALUE)
  })

  it('@Mutation SET_SELECT_OWNERS', () => {
    // 2. Execute mutation
    const VALUE: any = [0]
    SearchModule.SET_SELECT_OWNERS(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule.selectOwners).toEqual(VALUE)
  })

  it('@Action fetchOwners', async () => {
    // 2. Execute and await action
    await SearchModule.fetchOwners()

    // 3. Assert the expected changes
    expect(SearchModule._owners).not.toBeNull()
    expect(SearchModule._owners.id.exists()).toBe(true)
    expect(SearchModule._owners.email.exists()).toBe(true)
    expect(SearchModule._owners.name.exists()).toBe(true)
  })

  describe('get owner', () => {
    it('returns empty array for null value', () => {
      // 1. Prepare the state
      const VALUE: any = []
      SearchModule.SET_SELECT_OWNERS(VALUE)

      // 2. Assert the return value
      expect(SearchModule.selectOwners).toEqual(VALUE)
    })

    it('returns owner values', () => {
      // 1. Prepare the state
      const VALUE: any = [0]
      SearchModule.SET_SELECT_OWNERS(VALUE)

      // 2. Assert the return value
      expect(SearchModule.selectOwners).toEqual(VALUE)
    })
  })

  //-- TAG
  it('@Mutation SET_TAGS', () => {
    // 2. Execute mutation
    const VALUE: any = { id: 241680, name: '#販売' }
    SearchModule.SET_TAGS(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule._tags).toEqual(VALUE)
  })

  it('@Mutation SET_SELECT_TAGS', () => {
    // 2. Execute mutation
    const VALUE: any = []
    SearchModule.SET_SELECT_TAGS(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule._tags).toEqual(VALUE)
  })

  it('@Mutation SET_SELECT_TAGS', () => {
    // 2. Execute mutation
    const VALUE: any = [0]
    SearchModule.SET_SELECT_TAGS(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule.selectTags).toEqual(VALUE)
  })

  it('@Action fetchOwners', async () => {
    // 2. Execute and await action
    await SearchModule.fetchOwners()

    // 3. Assert the expected changes
    expect(SearchModule._tags).not.toBeNull()
    expect(SearchModule._tags.id.exists()).toBe(true)
    expect(SearchModule._tags.name.exists()).toBe(true)
  })

  describe('get tag', () => {
    it('returns empty array for null value', () => {
      // 1. Prepare the state
      const VALUE: any = []
      SearchModule.SET_SELECT_TAGS(VALUE)

      // 2. Assert the return value
      expect(SearchModule.selectTags).toEqual(VALUE)
    })

    it('returns owner values', () => {
      // 1. Prepare the state
      const VALUE: any = [0]
      SearchModule.SET_SELECT_TAGS(VALUE)

      // 2. Assert the return value
      expect(SearchModule.selectTags).toEqual(VALUE)
    })
  })

  //-- INPUT WORD
  it('@Mutation SET_INPUT_WORD', () => {
    // 2. Execute mutation
    const VALUE: any = 'ZZM'
    SearchModule.SET_INPUT_WORD(VALUE)

    // 3. Assert the expected changes
    expect(SearchModule.inputWord).toEqual(VALUE)
  })

  describe('get word', () => {
    it('returns owner values', () => {
      // 1. Prepare the state
      const VALUE: any = 'ZZM'
      SearchModule.SET_INPUT_WORD(VALUE)

      // 2. Assert the return value
      expect(SearchModule.inputWord).toEqual(VALUE)
    })
  })
})
