<template>
  <div class="index">
    <BotCards
      class="index__cards"
      :bots="topBots"
      title="Bots mais votados do mês"
      subtitle="Os bots que receberam mais votos nesse mês"
    />
    <BotCards
      class="index__cards"
      :bots="recentBots"
      title="Bots recentemente adicionados"
      subtitle="Novos bots que foram recentemente adicionados e aprovados em nosso site"
    />
    <BotCards
      class="index__cards"
      :bots="randomBots"
      title="Bots aleatórios"
      subtitle="Seleção aleatória de bots que estão em nosso sistema"
    />
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
  width: 95%;
  margin: 0 auto;
  &__cards {
    margin: 0 auto;
  }
}
</style>
