<template>
  <nuxt-link class="custombutton" to="/">
    {{ name }}
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Prop({
    required: true
  })
  name!: string
}
</script>

<style lang="scss" scoped>
.custombutton {
  margin: 0 0.2rem;
  color: var(--text-ligth);
  background-color: var(--secondary-color);
  padding: 2px 0.5rem;
  border-radius: 5px;
}
</style>
