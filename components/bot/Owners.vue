<template>
  <div>
    <UserIcon
      v-for="owner in owners"
      :key="owner._id"
      :user="owner"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { User } from '~/models/users/user'

@Component
export default class BotOwners extends Vue {
  @Prop({
    required: true
  })
  owners!: User[]
}
</script>
