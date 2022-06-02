const express = require('express')
const consola = require('consola')
const { loadNuxt } = require('nuxt-start')
const app = express()
const isDev = process.env.NODE_ENV !== 'production'

async function start() {
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')
  await nuxt.listen(process.env.PORT, process.env.HOST)
}

start()
