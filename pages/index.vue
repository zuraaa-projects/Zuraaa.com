<template>
  <div class="index">
    <h2 class="index__title">
      Bots mais votados do mês
    </h2>
    <p class="index__subtitle">
      Os bots que receberam mais votos nesse mês.
    </p>
    <div class="cards">
      <BotCard
        v-for="bot in topBots"
        :key="bot._id"
        :bot="bot"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component, Vue } from 'nuxt-property-decorator'
import { Bot } from '~/models/bots/bot'

@Component({
  async asyncData ({ $axios }: Context) {
    const bots = await $axios.$get('/bots?type=top&limit=6')

    return {
      topBots: bots
    }
  }
})
export default class extends Vue {
  topBots!: Bot[]
}
</script>

<style lang="scss" scoped>
.index {
  width: 98%;

  &__title {
    text-align: center;
    margin: 0;
    margin-top: 1rem;
  }

  &__subtitle {
    text-align: center;
  }
}

.cards {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

@media (min-width: 992px) {

}
</style>
