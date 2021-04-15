<template>
  <div class="bot">
    <Hero class="hero">
      <Profile
        class="hero__profile"
        :data="bot"
        :description="bot.details.shortDescription"
      />
    </Hero>
    <b-container class="longdesc">
      <b-card class="longdesc__card">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <b-card-body class="longdesc__card__body" v-html="bot.details.htmlDescription" />
      </b-card>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Bot } from '~/models/bots/bot'

@Component({
  async asyncData ({ $axios, route }) {
    try {
      return {
        bot: await $axios.$get(`/bots/${route.params.id}`)
      }
    } catch {
      // pagina de erro
    }
  }
})
export default class extends Vue {
  bot!: Bot

  head () {
    return {
      title: this.bot.username
    }
  }
}
</script>

<style lang="scss">
.longdesc {
  margin-bottom: 1rem;

  &__card {
    &__body {
      table {
        width: 100%;
        margin-bottom: 1rem;
        color: #212529;

        th,
        td {
          padding: 0.75rem;
          vertical-align: top;
          border-top: 1px solid #dee2e6;
        }

        thead th {
          vertical-align: bottom;
          border-bottom: (2 * 1px) solid #dee2e6;
        }

        tbody + tbody {
          border-top: (2 * 1px) solid #dee2e6;
        }
      }

      blockquote {
        border-left: 5px solid #dbdbdb;
        padding: 0.002rem 0.75rem;

        p {
          margin: 0.5rem 0;
        }
      }

      img {
        max-width: 100%;
      }
    }
  }
}
</style>
