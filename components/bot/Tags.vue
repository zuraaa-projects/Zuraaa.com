<template>
  <div class="tags">
    <BotTag
      v-for="tag in tags"
      :key="tag.value"
      :tag-info="tag"
      :color="color"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { BotTag } from '~/models/bots/bot-enum'
import type { EnumInfo } from '~/models/info/enum-info'

@Component
export default class BotTags extends Vue {
  @Prop({
    default: Object.entries(BotTag)
      .map(
        ([key, value]) => ({
          value: key,
          text: value
        })
      ),
    required: true
  })
  tags!: EnumInfo[]

  @Prop({
    default: false
  })
  color!: boolean

  click (value: string) {
    this.$emit('click', value)
  }
}
</script>

<style lang="scss" scoped>
.tags {
  display: flex;
  flex-flow: row wrap;
}
</style>
