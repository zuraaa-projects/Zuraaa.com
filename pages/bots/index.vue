<template>
  <div class="bots">
    <BotTags class="bots__tags" @click="tagClick" />
    <BotCards :bots="bots" />
    <b-pagination-nav
      v-model="page"
      :number-of-pages="(count.bots_count / 18) + 1"
      align="center"
      :link-gen="linkGen"
      use-router
    />
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component, Vue } from 'nuxt-property-decorator'
import type { Bot, BotCount } from '~/models/bots/bot'

@Component({
  head: {
    title: 'Bots'
  },
  async asyncData ({ $axios, route }: Context) {
    try {
      const page = route.query.page as string ?? '1'
      const tags = route.query.tags as string

      return {
        bots: await $axios.$get('/bots', {
          params: {
            page,
            tags: route.query.tags
          }
        }),
        page,
        count: await $axios.$get('/bots', {
          params: {
            type: 'count',
            tags
          }
        }),
        tags
      }
    } catch (error) {
      // pagina de erro
    }
  },
  watchQuery: ['page', 'tags']
})
export default class PageBots extends Vue {
  bots!: Bot[]
  page!: string
  count!: BotCount
  tags!: string

  async tagClick (value: string) {
    this.tags = value

    await this.$router.push(this.linkGen('1'))
  }

  linkGen (page: string) {
    return {
      query: {
        tags: this.tags,
        page
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bots {
  max-width: 1300px;
  width: 95%;
  margin: 0 auto;

  &__tags {
    display: flex;
    justify-content: center;
    margin: 0.5rem 0;
  }

  .cards {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
  }
}
</style>
