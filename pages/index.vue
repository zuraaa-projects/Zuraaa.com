<template>
  <div class="index">
    <BotCard />
    <BotCard />
    <BotCard />
    <BotCard />
    <BotCard />
    <BotCard />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Index extends Vue {

}
</script>

<style lang="scss" scoped>
.index {
  width: 98%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

@media (min-width: 992px) {

}
</style>
