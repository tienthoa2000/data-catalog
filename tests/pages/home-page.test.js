import constants from '~/tests/constants'
import {describe, beforeAll, afterAll, expect} from "@jest/globals"
const nuxtConfig = require('~/nuxt.config.js')
const { Nuxt } = require('nuxt')
let nuxt = null

beforeAll(async () => {
  nuxt = new Nuxt({ ...nuxtConfig, buildDir: constants.buildDir })

  await nuxt.server.listen(constants.port, 'localhost')

}, 300000)

describe('GET /', () => {
  test('Route / exits and render HTML', async () => {
    const { html } = await nuxt.server.renderRoute('/', {})

    expect(html).toContain('Vuetify')
  })
})

afterAll(() => {
  nuxt.close()
})
