<template>
  <nuxt-link class="custombutton" :to="url">
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

  @Prop({
    required: true
  })
  url!: string
}
</script>

<style lang="scss" scoped>
.custombutton {
  margin: 0 0.2rem;
  color: var(--text-dark);
  padding: 2px 0.5rem;
  border-radius: 0.3rem;
  border: 1px solid var(--primary-color);
  border-left: 2px solid var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  font-size: 0.9rem;
  transition-property: color background-color;
  transition-duration: 400ms;
}

.custombutton:hover {
  background-color: var(--primary-color);
  color: var(--text-light);
}
</style>
