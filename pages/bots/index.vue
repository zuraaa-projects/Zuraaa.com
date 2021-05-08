<template>
  <div class="bots">
    <BotTags class="bots__tags" />
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
      const search = route.query.search as string

      return {
        bots: await $axios.$get('/bots', {
          params: {
            page,
            tags: route.query.tags,
            search
          }
        }),
        page,
        count: await $axios.$get('/bots', {
          params: {
            type: 'count',
            tags,
            search
          }
        }),
        tags,
        search
      }
    } catch (error) {
      // pagina de erro
    }
  },
  watchQuery: ['page', 'tags', 'search']
})
export default class PageBots extends Vue {
  bots!: Bot[]
  page!: string
  count!: BotCount
  tags!: string
  search!: string

  linkGen (page: string) {
    return {
      query: {
        tags: this.tags,
        page,
        search: this.search
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
