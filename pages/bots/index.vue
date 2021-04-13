<template>
  <div class="bots">
    <BotTags class="bots__tags" @click="tagClick" />
    <BotCards :bots="bots" />
    <div class="buttons">
      <nuxt-link
        v-if="page > 1"
        :to="`?page=${page + 1}`"
      >
        <font-awesome-icon
          class="buttons__icon"
          icon="angle-left"
        />
      </nuxt-link>
      <nuxt-link
        v-if="page >= 0 && page * 18 < count.bots_count + 18"
        :to="`?page=${page + 1}`"
      >
        <font-awesome-icon
          class="buttons__icon"
          icon="angle-right"
        />
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component, Vue } from 'nuxt-property-decorator'
import type { Bot, BotCount } from '~/models/bots/bot'

@Component({
  head: {
    title: 'Zuraaa! | Bots'
  },
  async asyncData ({ $axios, route }: Context) {
    try {
      const page = parseInt(route.query.page as string)
      const tags = route.query.tags as string

      const currentPage = isNaN(page) ? 1 : page

      return {
        bots: await $axios.$get('/bots', {
          params: {
            page: currentPage,
            tags: route.query.tags
          }
        }),
        page: currentPage,
        count: await $axios.$get('/bots?type=count'),
        tags
      }
    } catch (error) {
      // pagina de erro
    }
  }
})
export default class extends Vue {
  bots!: Bot[]
  page!: number
  count!: BotCount
  tags!: string

  tagClick (value: string) {
    this.tags = value

    const query = {
      tags: this.tags,
      page: '1'
    }

    this.$router.push({ query })

    this.$nuxt.refresh()
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

  .buttons {

    &__icon {
      color: var(--text-dark);
    }
  }
}
</style>
