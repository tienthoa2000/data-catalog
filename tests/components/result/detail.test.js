import Detail from '@/components/result/Detail'
import {
  addHelpers,
  addVuetify,
  addVuex,
  addI18n,
  bootstrapVueContext,
  compositeConfiguration,
  customWrapper
} from '~/tests/utils'

import {describe, beforeEach, afterEach, expect} from "@jest/globals"

describe('ResultDetail', () => {
  let vueContext = null
  let wrapper = null

  beforeEach(() => {
    vueContext = bootstrapVueContext(
      compositeConfiguration(addVuex, addVuetify, addI18n, addHelpers())
    )
    wrapper = customWrapper(Detail, vueContext)
  })

  afterEach(() => {
    vueContext.teardownVueContext()
  })

  // Test Props, Data and Computed
  test('Test case: the :isExpanded property value is not set', () => {
    expect(wrapper.props().isExpanded).toBe(false)
    const resizeButton = wrapper.find('.result-detail .resize-btn')
    expect(resizeButton.exists()).toBe(true)
    expect(resizeButton.element.className).toContain('expand')
  })

  test('Test case: the :isExpanded property value is true', async () => {
    await wrapper.setProps({isExpanded: true})
    expect(wrapper.props().isExpanded).toBe(true)
    const resizeButton = wrapper.find('.result-detail .resize-btn')
    expect(resizeButton.exists()).toBe(true)
    expect(resizeButton.element.className).toContain('collapse')
  })

  //Test Events


})
