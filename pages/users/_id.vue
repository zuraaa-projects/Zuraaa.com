<template>
  <div>
    <Hero>
      <Profile
        :data="user"
        :description="description"
      />
    </Hero>
    <div class="bots">
      <div class="bots-">
        <div v-if="bots.length">
          <BotCards
            :bots="bots"
            title="Bots"
          />
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

  head () {
    return {
      title: this.user.username
    }
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
