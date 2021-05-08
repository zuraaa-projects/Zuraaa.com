<template>
  <div
    class="bottag"
    :class="{ 'color': color }"
    @click="click"
  >
    <span v-if="color" class="bottag__color" :style="{ 'background-color': getColor }" />
    <span class="bottag__name">
      {{ tagInfo.text }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { BotTagColor } from '~/models/bots/bot-enum'
import type { EnumInfo } from '~/models/info/enum-info'

@Component
export default class BotTag extends Vue {
  @Prop({
    required: true
  })
  tagInfo!: EnumInfo

  @Prop({
    default: false
  })
  color!: boolean

  get getColor () {
    return BotTagColor[this.tagInfo.value as keyof typeof BotTagColor]
  }

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
  font-size: 0.9rem;
  transition-property: color, background-color;
  transition-duration: 400ms;
  cursor: pointer;
}

.bottag:not(.color) {
  border-radius: 0.3rem;
  border-width: 1px;
  border-style: solid;
  border-left-width: 2px;
  border-bottom-width: 2px;
  border-color: var(--primary-color);
  color: var(--text-dark);
}

.bottag:hover:not(.color) {
  background-color: var(--primary-color);
  color: var(--text-light);
}

.bottag.color {
  display: flex;
  margin: 0;
  .bottag{
    &__color {
      width: 5px;
      height: 100%;
      border-bottom-left-radius: 5px;
      border-top-left-radius: 5px;
    }
    &__name {
      padding: 0 4px;
      background-color: var(--light-color);
      color: var(--text-dark);
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
    }
  }
}

</style>
