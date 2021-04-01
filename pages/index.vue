<template>
  <div class="index">
    <h2 class="index__title">
      Bots mais votados do mês
    </h2>
    <p class="index__subtitle">
      Os bots que receberam mais votos nesse mês
    </p>
    <div class="cards">
      <BotCard
        v-for="bot in topBots"
        :key="bot._id"
        :bot="bot"
      />
    </div>
    <h2 class="index__title">
      Bots recentemente adicionados
    </h2>
    <p class="index__subtitle">
      Novos bots que foram recentemente adicionados e aprovados em nosso site
    </p>
    <div class="cards">
      <BotCard
        v-for="bot in recentBots"
        :key="bot._id"
        :bot="bot"
      />
    </div>
    <h2 class="index__title">
      Bots aleatórios
    </h2>
    <p class="index__subtitle">
      Seleção aleatória de bots que estão em nosso sistema
    </p>
    <div class="cards">
      <BotCard
        v-for="bot in randomBots"
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
    try {
      return {
        topBots: await $axios.$get('/bots?type=top&limit=6'),
        recentBots: await $axios.$get('/bots?limit=6'),
        randomBots: await $axios.$get('/bots?type=random&limit=12')
      }
    } catch (error) {
      // Pagina de erro
    }
  }
})
export default class extends Vue {
  topBots!: Bot[]
  recentBots!: Bot[]
  randomBots!: Bot[]
}
</script>

<style lang="scss" scoped>
.index {
  max-width: 1300px;
  width: 95%;
  margin: 0 auto;

  &__title {
    text-align: center;
    margin: 0;
    margin-top: 1rem;
  }

  &__subtitle {
    text-align: center;
  }

  .cards {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
  }
}

@media (min-width: 992px) {

}
</style>
