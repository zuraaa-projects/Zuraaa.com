<template>
  <div class="botcard">
    <img
      class="botcard__image"
      :src="bot | genAvatar"
      alt=""
      srcset=""
    >
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Bot } from '~/models/bots/bot'
import { genAvatar } from '~/utils/filters'

@Component({
  filters: {
    genAvatar
  }
})
export default class extends Vue {
  @Prop({
    required: true
  })
  bot!: Bot
}
</script>

<style lang="scss" scoped>
.botcard {
  width: 380px;
  height: 230px;
  margin: 0.5rem;
  display: flex;
  box-shadow: 2px 2px 3px 1px rgba(0,0,0,.6);

  &__image {
    width: 80px;
    object-fit: cover;
  }
}
</style>
