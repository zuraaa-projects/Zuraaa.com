<template>
  <div class="bottag" @click="click">
    {{ tagInfo.text }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import type { EnumInfo } from '~/models/info/enum-info'

@Component
export default class extends Vue {
  @Prop({
    required: true
  })
  tagInfo!: EnumInfo

  click () {
    this.$emit('click', this.tagInfo.value)
  }
}
</script>

<style lang="scss" scoped>
.bottag {
  height: 1.5rem;
  margin: 0.3rem;
  padding: 0 0.2rem;
  border-radius: 0.3rem;
  border: 1px solid var(--primary-color);
  border-left: 2px solid var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  color: var(--text-dark);
  font-size: 0.9rem;
  transition-property: color background-color;
  transition-duration: 400ms;
  cursor: pointer;
}

.bottag:hover {
  background-color: var(--primary-color);
  color: var(--text-light);
}
</style>
