<template>
  <Hero>
    <Profile
      :data="bot"
      :description="bot.details.shortDescription"
    />
  </Hero>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Bot } from '~/models/bots/bot'

@Component({
  async asyncData ({ $axios, route }) {
    try {
      return {
        bot: await $axios.$get(`/bots/${route.params.id}`)
      }
    } catch {
      // pagina de erro
    }
  }
})
export default class extends Vue {
  bot!: Bot
}
</script>
