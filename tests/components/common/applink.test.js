import AppLink from '@/components/common/AppLink'
import {
  addHelpers,
  addVuetify,
  addVuex,
  bootstrapVueContext,
  compositeConfiguration,
  customWrapper
} from '~/tests/utils'

import {describe, beforeEach, afterEach, expect, jest} from "@jest/globals"

describe('AppLink', () => {
  let vueContext = null
  let wrapper = null

  beforeEach(() => {
    vueContext = bootstrapVueContext(
      compositeConfiguration(addVuex, addVuetify, addHelpers())
    )
    wrapper = customWrapper(AppLink, vueContext)
  })

  afterEach(() => {
    vueContext.teardownVueContext()
  })

  // Test Props, Data and Computed
  test('Test case: :to property value is null', () => {
    expect(wrapper.props().to).toBe('/')
  })

  test('Test case: :to property type should be String', async() => {
    const spy = jest.spyOn(console, 'error')
    await wrapper.setProps({to: 'mail@test.test'})
    expect(spy).not.toHaveBeenCalledWith(expect.stringContaining('[Vue warn]: Invalid prop: type check failed for prop "to"'))
  })

  test('Test case: :to property type is Number should be failed !', async() => {
    const spy = jest.spyOn(console, 'error')
    await wrapper.setProps({to: 8383})
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[Vue warn]: Invalid prop: type check failed for prop "to"'))
  })

  test('Test case: :to property value is not null', async () => {
    await wrapper.setProps({to: 'mail@test.test'})
    expect(wrapper.props().to).toBe('mail@test.test')
  })

  test('Test case: :to property value is a Email address', async () => {
    await wrapper.setProps({to: 'mail@test.test'})
    expect(wrapper.vm.href).toBe('mailto:mail@test.test')
  })

  test('Test case: :to property value is a URL address', async () => {
    await wrapper.setProps({to: '/test'})
    expect(wrapper.vm.href).toBe('/test')
  })

  //Test Events


})
