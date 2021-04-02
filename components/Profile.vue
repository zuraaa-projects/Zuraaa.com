<template>
  <div class="profile">
    <img :src="data | genAvatar" :alt="data | altName" class="profile__avatar">
    <div class="profile__tag">
      <h1 class="profile__tag__name" v-text="data.username" />
      <p class="profile__tag__discriminator" v-text="'#' + data.discriminator" />
    </div>
    <span class="profile__description">
      {{ description }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { altName, genAvatar } from '~/utils/filters'
import type { Bot } from '~/models/bots/bot'
import type { User } from '~/models/users/user'

@Component({
  filters: {
    altName,
    genAvatar
  }
})
export default class extends Vue {
  @Prop()
  data!: Bot | User

  @Prop()
  description!: string
}
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__avatar {
    border-radius: 50%;
    width: 14rem;
  }

  &__tag {
    display: flex;
    align-items: flex-end;

    &__name {
      margin: 0;
    }

    &__discriminator {
      margin-bottom: 0.1rem;
      font-size: 14pt;
    }
  }

  &__description {
    text-align: justify;
    max-width: 60rem;
  }
}
</style>
