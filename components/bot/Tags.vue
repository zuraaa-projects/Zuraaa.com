<template>
  <div class="tags">
    <BotTag
      v-for="tag in tags"
      :key="tag.value"
      :tag-info="tag"
      @click="click"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { BotTag } from '~/models/bots/bot-enum'
import type { EnumInfo } from '~/models/info/enum-info'

@Component
export default class BotTags extends Vue {
  tags!: EnumInfo[]

  created () {
    this.tags = Object.entries(BotTag)
      .map(
        ([key, value]) => ({
          value,
          text: key
        })
      )
  }

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
