<template>
  <div class="vote">
    <div class="vote__card">
      <h1>Vote em {{ bot.username }}</h1>
      <img src="" alt="" srcset="">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import type { Bot } from '~/models/bots/bot'

@Component
export default class extends Vue {
  @Prop({
    required: true
  })
  bot!: Bot
}
</script>

<style lang="scss" scoped>
.vote {
  width: 280px;
  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
