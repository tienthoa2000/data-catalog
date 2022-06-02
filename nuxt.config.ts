import { resolve } from 'path'
import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  ssr: false,
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    // titleTemplate: '%s - data-catalog-frontend',
    title: 'ATELAS（アトラス）',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon_32px.svg',
      },
    ],
  },
  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_API || 'http://localhost:3000/api/v1/',
      // baseURL: 'http://127.0.0.1:4010/api/v1' // APIモックサーバ
      // browserBaseURLというクライアント側からAPIリクエストする場合のURLを指定できるプロパティも存在するが、指定しない場合デフォルトでbaseURLが参照されるため省略とする
    },
    TAG_ASSIGN_LIMIT: process.env.TAG_ASSIGN_LIMIT || 200, // タグ付与/解除数の上限値
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'index_page',
          path: '/index',
          component: resolve(__dirname, 'pages/index/index.vue'),
        },
        {
          name: 'page_not_found',
          path: '*',
          component: resolve(__dirname, 'pages/error/404.vue'),
        }
      )
    },
  },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/style/Base', '~/assets/style/vuetifyCustom.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/CompositionApi',
    '@/plugins/axios-accessor',
    '@/plugins/renderedMixin',
    { src: '@/plugins/VueKonva', ssr: false },
    '@/plugins/VTooltip',
    '@/plugins/axios.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      '@/components',
      {
        path: '@/components/base/',
        prefix: 'Base',
      },
      {
        path: '@/components/result/',
        prefix: 'Result',
      },
      {
        path: '@/components/result/Tabs/DetailTab',
        prefix: 'Result',
      },
      {
        path: '@/components/result/Tabs/LineageTab',
        prefix: 'Result',
      },
      {
        path: '@/components/result/Tabs/RelationForceTab',
        prefix: 'Result',
      },
      {
        path: '@/components/tag/',
        prefix: 'Tag',
      },
      {
        path: '@/components/helpers/',
        prefix: 'Help',
      },
      {
        path: '@/components/common/',
        prefix: 'Common',
      },
      {
        path: '@/components/error/',
        prefix: 'Error',
      },
      {
        path: '@/components/clip/',
        prefix: 'Clip',
      },
      // ↓componentsディレクトリ配下のindexディレクトリは以下記述で認識されなかった為一旦コメントアウト。
      // ↓Nuxtの仕様として、ディレクトリを指定しない場合はindexディレクトリをデフォルトで参照している模様。
      // {
      //   path: '@/components/index/',
      //   prefix: 'Index'
      // }
    ],
  },
  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    [
      '@nuxt/typescript-build',
      { typeCheck: true, ignoreNotFoundWarnings: true },
    ],
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-i18n',
    '@nuxtjs/dayjs',
    '@nuxtjs/auth-next',
  ],
  loaders: { ts: { silent: true }, tsx: { silent: true } },
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    optionsPath: 'vuetify.option.js',
  },
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.js' },
      { code: 'ja', iso: 'ja-JP', file: 'ja.js' },
    ],
    defaultLocale: 'ja',
    strategy: 'prefix_and_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      onlyOnRoot: true,
    },
    lazy: true,
    langDir: 'locales/',
    vueI18n: {
      fallbackLocale: 'ja',
    },
  },
  dayjs: {
    locales: ['en', 'ja'],
    defaultLocale: 'ja',
    defaultTimeZone: 'Asia/Tokyo',
    plugins: [
      'utc', // import 'dayjs/plugin/utc'
      'timezone', // import 'dayjs/plugin/timezone',
      'isBetween',
    ],
  },
  extends: ['@nuxtjs/eslint-config-typescript'],
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config) {
      // @ts-ignore
      config?.module?.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
    transpile: ['vuex-composition-helpers', 'vue-demi'],
  },
  alias: {
    images: resolve(__dirname, './assets/images'),
    style: resolve(__dirname, './assets/style'),
    data: resolve(__dirname, './assets/json'),
    icon: resolve(__dirname, './assets/icons'),
  },
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true,
  },
  auth: {
    redirect: {
      login: '/',
      callback: '/',
    },
    strategies: {
      aad: {
        scheme: 'oauth2',
        endpoints: {
          authorization:
            'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize',
          token:
            'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
          userInfo: '',
          logout: '/',
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800,
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30,
        },
        responseType: 'code',
        grantType: 'authorization_code',
        accessType: 'offline',
        // ******** change this for your Application (Client) ID ********
        clientId: process.env.CLIENT_ID,
        codeChallengeMethod: 'S256',
        scope: ['openid', 'profile'],
        autoLogout: true,
      },
    },
  },
}
export default config
