<template>
  <div class="botdetail">
    <span
      class="botdetail__name"
    >
      {{ name }}:
    </span>
    <span class="botdetail__value">
      {{ value }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class BotDetail extends Vue {
  @Prop({
    required: true
  })
  name!: string

  @Prop({
    required: true
  })
  value!: string
}
</script>

<style lang="scss" scoped>
.botdetail {
  display: inline;
  margin-left: 0.5rem;
  &__name {
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }
  &__value {
    background-color: var(--text-light);
    color: var(--text-dark);
    padding: 0.05rem 0.5rem;
    border-radius: 1rem;
    margin-left: 0.2rem;
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }
}
</style>
