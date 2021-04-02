<template>
  <div>
    <Hero>
      <Profile
        :data="user"
        :description="description"
      />
    </Hero>
    <div class="bots">
      <h1 class="bots__title">
        Bots
      </h1>
      <div class="bots-">
        <div v-if="bots.length">
          <BotCard v-for="bot in bots" :key="bot._id" :bot="bot" />
        </div>
        <h4 v-else>
          O usuário não tem nenhum bot listado.
        </h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Bot } from '~/models/bots/bot'
import { User } from '~/models/users/user'

@Component({
  async asyncData ({ $axios, route }) {
    try {
      return {
        user: await $axios.$get(`/users/${route.params.id}`),
        bots: await $axios.$get(`/users/${route.params.id}/bots`)
      }
    } catch {
      // pagina de erro
    }
  }
})
export default class extends Vue {
  user!: User
  bots!: Bot[]
  get description () {
    return this.user.details.description ?? 'Esse usuário ainda não tem uma biografia definida.'
  }
}
</script>

<style lang="scss" scoped>
.bots {
  max-width: 1300px;
  width: 95%;
  margin: 0 auto;
}
</style>
