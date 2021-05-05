<template>
  <div class="vote">
    <div class="vote__card">
      <img class="vote__image" :src="bot | genAvatar" :alt="bot | altName">
      <h1 class="vote__text">
        Vote em {{ bot.username }}
      </h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { genAvatar, altName } from '~/utils/filters'
import type { Bot } from '~/models/bots/bot'

@Component({
  filters: {
    genAvatar,
    altName
  }
})
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
  margin: 0 auto;

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__image {
    border-radius: 50%;
    width: 10rem;
  }
}
</style>
