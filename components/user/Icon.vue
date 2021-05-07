<template>
  <div class="icon">
    <img
      class="icon__avatar"
      :src="user | genAvatar"
      :alt="user | altName"
    >
    <nuxt-link
      class="icon__name"
      :to="user | myPage"
    >
      {{ user.username }}#{{ user.discriminator }}
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import type { User } from '~/models/users/user'
import { altName, genAvatar, myPage } from '~/utils/filters'

@Component({
  filters: {
    genAvatar,
    altName,
    myPage
  }
})
export default class UserIcon extends Vue {
  @Prop({
    required: true
  })
  user!: User
}
</script>

<style lang="scss" scoped>
.icon {
  display: inline-block;
  height: 2rem;
  margin-left: 0.5rem;
  &__avatar {
    height: 2rem;
    border-radius: 50%;
  }
  &__name {
    height: 2rem;
    text-decoration: none;
    color: var(--text-light);
  }
}
</style>
