<template>
  <div />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  mounted () {
    this.setRedirect()
    location.href = process.env.oauth2UrlAuth as string
  }

  setRedirect () {
    if (this.$route.redirectedFrom != null) {
      localStorage.setItem('redirect', this.$route.redirectedFrom)
    }
  }
}
</script>
