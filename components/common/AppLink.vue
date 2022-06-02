<template lang="pug">
  a(v-if="isEmail" :href="href")
    slot
  nuxt-link(v-else :to="to")
    slot
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { Regex } from "../../constants/Regex";
export default defineComponent({
  setup() {
    return {  }
  },
  props: {
    to: {type: String, default: '/'}
  },
  computed: {
    isEmail() {
      if (!this.to) return false
      return (Regex.EMAIL.test(String(this.to.trim()).toLowerCase()))
    },
    href() {
      if (!this.to) return '/'
      if (this.isEmail)
        return `mailto:${this.to.trim()}`
      return this.to
    }
  }
})
</script>

