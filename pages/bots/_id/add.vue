<template>
  <div />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import type { Bot } from '~/models/bots/bot'
import { genAddBot } from '~/utils/functions'

@Component({
  async asyncData ({ $axios, redirect, route }) {
    try {
      const bot: Bot = await $axios.$get(`/bots/${route.params.id}`)

      if (bot.details.customInviteLink != null) {
        redirect(bot.details.customInviteLink)
      } else {
        redirect(genAddBot(bot._id))
      }
    } catch (error) {
      // pagina de erro
    }
  }
})
export default class extends Vue {

}
</script>
