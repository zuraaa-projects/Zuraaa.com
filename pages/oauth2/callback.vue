<template>
  <div />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  async mounted () {
    const code = this.$route.query.code as string
    try {
      const result: {
        'access_token': string,
        role: number
      } = await this.$axios.$post('/auth/user', {
        type: 'code',
        identify: process.env.apiSecret,
        data: code
      })

      localStorage.setItem('token', result.access_token)
      this.$axios.setToken(result.access_token, 'Bearer')

      this.$router.push(localStorage.getItem('redirect') ?? '/')
    } catch (error) {
      // pagina de erro
    }
  }
}
</script>
