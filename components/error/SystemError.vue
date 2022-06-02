<template>
  <div class="error-content">
    <div>
      <div class="text-content">
        <span class="error-text">システムエラーが発生しました</span>
        <span class="error-text">再度お試しの上改善されないようであれば</span>
        <span class="error-text">しばらく時間を空けてからお試しください</span>
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
