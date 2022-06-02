<template>
  <div class="error-content">
    <div>
      <div class="status-content">
        <span class="error-status">404</span>
      </div>
      <div class="text-content">
        <span class="error-text">お探しのページが見つかりませんでした</span>
      </div>
      <div class="btn-content">
        <button class="btn">
          <NuxtLink to="/" class="btn-link">
            ホームに戻る
          </NuxtLink>
        </button>
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
  .status-content
    display flex
    justify-content center
    .error-status
      color #A8B7BA
      font-size 7.5rem
      font-weight bold
  .text-content
    margin-bottom 40px
    .error-text
      display flex
      justify-content center
      font-size 1.125rem
  .btn-content
    display flex
    justify-content center
    .btn
      background-color #43A5C4
      padding 10px 20px
      border-radius 4px
      .btn-link
        color white
        text-decoration none
        font-size 1rem
</style>
