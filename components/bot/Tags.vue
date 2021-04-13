<template>
  <div class="tags">
    <BotTag
      v-for="tag in tags"
      :key="tag.value"
      :name="tag.text"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { BotTag } from '~/models/bots/bot-enum'

@Component
export default class BotTags extends Vue {
  tags!: any

  created () {
    this.tags = Object.entries(BotTag)
      .map(
        ([key, value]) => ({
          value,
          text: key
        })
      )
  }
}
</script>

<style lang="scss" scoped>
.tags {
  display: flex;
  flex-flow: row wrap;
}
</style>
