<template>
  <div class="bots">
    <div class="cards">
      <BotCard
        v-for="bot in bots"
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
        bots: await $axios.$get('/bots')
      }
    } catch (error) {
      // pagina de erro
    }
  }
})
export default class extends Vue {
  bots!: Bot[]
}
</script>

<style lang="scss" scoped>
.bots {
  max-width: 1300px;
  width: 95%;
  margin: 0 auto;

  .cards {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}
}
</style>
