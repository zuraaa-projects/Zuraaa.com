<template>
  <Hero>
    <Profile
      :data="user"
      :description="description"
    />
  </Hero>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { User } from '~/models/users/user'

@Component({
  async asyncData ({ $axios, route }) {
    try {
      return {
        user: await $axios.$get(`/users/${route.params.id}`)
      }
    } catch {
      // pagina de erro
    }
  }
})
export default class extends Vue {
  user!: User

  get description () {
    return this.user.details.description ?? 'Esse usuário ainda não tem uma biografia definida.'
  }
}
</script>
