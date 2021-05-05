<template>
  <div class="bot">
    <Hero class="hero">
      <b-container fluid class="hero__container">
        <b-row align-h="center" class="hero__profile">
          <Profile
            class="hero__profile__items"
            :data="bot"
            :description="bot.details.shortDescription"
          />
        </b-row>
        <b-row align-h="center" class="hero__buttons">
          <b-button v-b-modal.vote variant="light" class="hero__buttons__button">
            Votar
          </b-button>
        </b-row>
      </b-container>
    </Hero>
    <b-container class="longdesc">
      <b-card class="longdesc__card">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <b-card-body class="longdesc__card__body" v-html="bot.details.htmlDescription" />
      </b-card>
    </b-container>

    <b-modal id="vote" hide-header class="bot__vote">
      <BotVote class="bot__vote__content" :bot="bot" />

      <template #modal-footer="{ ok, cancel }">
        <b-button variant="light" @click="cancel">
          Cancelar
        </b-button>
        <b-button variant="light" @click="ok">
          Votar
        </b-button>
      </template>
    </b-modal>
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
.hero {
  &__buttons {
    padding-top: 1rem;
  }
}

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
