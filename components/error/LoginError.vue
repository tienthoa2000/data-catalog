<template>
  <div class="error-content">
    <div>
      <div class="status-content">
        <h1 class="status">401</h1>
      </div>
      <div>
        <span class="text"
          >アクセスしようとしたページは表示できませんでした</span
        >
        <span class="text"
          >認証に失敗したか、アクセス権限が無い可能性があります</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts"></script>

<style lang="stylus" scoped>
.error-content
    display flex
    justify-content center
    align-items center
    position fixed
    width 100vw
    height 100vh
    z-index 10
    left 0
    background-color white
    .status-content
        display flex
        justify-content center
    .status
        color #A8B7BA
        font-size 7.5rem
        font-weight bold
        margin-bottom 40px
    .text
        display flex
        justify-content center
        font-size 1.125rem
</style>
