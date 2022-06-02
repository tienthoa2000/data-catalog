import vueCompositionApi from '@vue/composition-api'
import VueRouter from 'vue-router'

const dayjs = require('dayjs')

export const wait = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const addVuetify = (context) => {
  context.vuetify = require('vuetify')
  context.vue.use(context.vuetify)
  // eslint-disable-next-line new-cap
  context.vuetifyInstance = new context.vuetify()

}

export const addVuex = (context) => {
  context.vuex = require('vuex')
  context.vue.use(context.vuex)
}

export const addComponent = (name, component) => {
  return (context) => {
    context.vue.component(name,component)
  }
}

export const addKonva = (context) => {
  context.vue.component('v-stage', {
    template: '<p>v-stage</p>'
  })
}

export const addDirective = (name, directive) => {
  return (context) => {
    context.vue.directive(name,directive)
  }
}

export const addHelpers = () => {
  return (context) => {
    context.vue.prototype.$helpers = {}
  }
}

export const addI18n = (options) => {
  return (context) => {
    context.i18n = require('vue-i18n')
    context.vue.use(context.i18n)
    // eslint-disable-next-line new-cap
    context.i18nInstance = new context.i18n({
      locales: [
        { code: 'en', iso: 'en-US', file: 'en.js' },
        { code: 'ja', iso: 'ja-JP', file: 'ja.js' }
      ],
      defaultLocale: 'ja',
      strategy: 'prefix_and_default',
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected',
        onlyOnRoot: true
      },
      lazy: true,
      langDir: 'locales/',
      vueI18n: {
        fallbackLocale: 'ja'
      }
    })
  }
}

export const addFilter = (name, lambda) => {
  return context => context.vue.filter(name, lambda)
}

export const compositeConfiguration = (...configs) => {
  return context => configs.forEach(config => config(context))
}

export const bootstrapVueContext = (configureContext) => {
  const context = {}
  const teardownVueContext = () => {
    jest.unmock('vue')
    Object.keys(context).forEach(key => delete context[key])
    jest.resetModules()
  }

  jest.isolateModules(() => {
    context.vueTestUtils = require('@vue/test-utils')
    context.vueTestUtils.config.stubs.nuxt = { template: '<div />' }
    context.vueTestUtils.config.stubs['nuxt-link'] = { template: '<a><slot /></a>' }
    context.vueTestUtils.config.stubs['no-ssr'] = { template: '<span><slot /></span>' }
    context.vue = context.vueTestUtils.createLocalVue()
    context.vue.use(vueCompositionApi)
    context.vue.use(VueRouter)


    jest.doMock('vue', () => context.vue)

    configureContext && configureContext(context)
  })

  return {
    teardownVueContext,
    ...context
  }
}

export const customWrapper = (component, context) => {
  const router = new VueRouter()
  return context.vueTestUtils.mount(component, {
    localVue: context.vue,
    vuetify: context.vuetifyInstance,
    router,
    mocks: {
      ...(context.mocks || {}),
      $dayjs: dayjs,
      $t: (msg) => msg
    }
  })
}

export const shallowWrapper = (component, context) => {
  const router = new VueRouter()
  return context.vueTestUtils.shallowMount(component, {
    localVue: context.vue,
    vuetify: context.vuetifyInstance,
    router,
    mocks: {
      ...(context.mocks || {}),
      $dayjs: dayjs,
      $t: (msg) => msg
    }
  })
}
