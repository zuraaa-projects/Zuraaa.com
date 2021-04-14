<template>
  <div class="botcards">
    <h2
      v-if="title !== undefined"
      class="botcards__title"
    >
      {{ title }}
    </h2>
    <p
      v-if="subtitle !== undefined"
      class="botcards__subtitle"
    >
      {{ subtitle }}
    </p>
    <div class="botcards__cards">
      <BotCard
        v-for="bot in bots"
        :key="bot._id"
        :bot="bot"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Bot } from '~/models/bots/bot'

@Component
export default class BotCards extends Vue {
  @Prop({
    required: true
  })
  bots!: Bot[]

  @Prop({
    required: false
  })
  title?: string

  @Prop({
    required: false
  })
  subtitle?: string
}
</script>

<style lang="scss" scoped>
.botcards {
  width: 100%;
  max-width: 1300px;

  &__title {
    text-align: center;
    margin: 0;
    margin-top: 1rem;
  }

  &__cards {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
  }

  &__subtitle {
    text-align: center;
  }
}
</style>
