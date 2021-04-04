<template>
  <div class="cards">
    <BotCard
      v-for="bot in bots"
      :key="bot._id"
      :bot="bot"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Bot } from '~/models/bots/bot'

@Component
export default class extends Vue {
  @Prop({
    required: true
  })
  bots!: Bot[]
}
</script>

<style lang="scss" scoped>
.cards {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  max-width: 1300px;
}
</style>
