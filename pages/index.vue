<template>
  <div class="index">
    <h2 class="index__title">
      Bots mais votados do mês
    </h2>
    <p class="index__subtitle">
      Os bots que receberam mais votos nesse mês
    </p>
    <BotCards :bots="topBots" />
    <h2 class="index__title">
      Bots recentemente adicionados
    </h2>
    <p class="index__subtitle">
      Novos bots que foram recentemente adicionados e aprovados em nosso site
    </p>
    <BotCards :bots="recentBots" />
    <h2 class="index__title">
      Bots aleatórios
    </h2>
    <p class="index__subtitle">
      Seleção aleatória de bots que estão em nosso sistema
    </p>
    <BotCards :bots="randomBots" />
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component, Vue } from 'nuxt-property-decorator'
import { Bot } from '~/models/bots/bot'

@Component({
  head: {
    title: 'Zuraaa! | Início'
  },
  async asyncData ({ $axios }: Context) {
    try {
      const [
        top,
        recent,
        random
      ] = await Promise.all([
        $axios.$get('/bots?type=top&limit=6'),
        $axios.$get('/bots?limit=6'),
        $axios.$get('/bots?type=random&limit=12')
      ])

      return {
        topBots: top,
        recentBots: recent,
        randomBots: random
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
}

@media (min-width: 992px) {

}
</style>
