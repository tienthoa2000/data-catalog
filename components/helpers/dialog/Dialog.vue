<template lang="pug">
v-dialog(v-model="showalert" :width="width" @click:outside="onClose")
  v-card.dialog-container
    v-card-text(class="padding-top")
      div(class="row-wrapper")
        v-img(:src="alerticon" max-width="2em" max-height="2em")
        p(class="padding-left-small") {{ alerttext }}
    v-divider(class='divider-color')
    v-card-actions
      v-spacer
      v-btn(color="primary" @click="onClose") {{ btntext }}
</template>

<script>
import { defineComponent, reactive } from '@nuxtjs/composition-api'

export default defineComponent({
  setup(props, { emit }) {
    const onClose = () => emit('close')
    return {
      props,
      onClose
    }
  },
  props: {
    showalert: { type: Boolean, default: false },
    alerticon: { type: String, dafault: '' },
    alerttext: { type: String, default: '' },
    btntext: { type: String, default: '' },
    width: { type: String, default: '436px' }
  }
})
</script>

<style lang="stylus" scoped>
.dialog-container.v-sheet.v-card:not(.v-sheet--outlined)
  box-shadow: none;
.v-dialog__content
  align-items start !important
.v-overlay.v-overlay--active.theme--dark
  .v-overlay__scrim
    opacity 0 !important
.v-dialog
  box-shadow 0 3px 6px #00000033 !important
  margin-top 0 !important
  .v-card
    .v-card__text
      padding 30px 0 30px 20px !important
      min-height calc(2em + 30px * 2)
.row-wrapper
  display flex
  flex-direction row
  flex-wrap nowrap
.padding-left-small
  padding 4px 20px 0 16px
  font-weight bold
  margin-bottom: 0 !important;
.v-dialog
  .v-card
    .v-card__actions
      padding 10px 20px !important
      .v-btn
        padding 0 25px !important
.divider-color
  border-color #EAEAEA !important
</style>
