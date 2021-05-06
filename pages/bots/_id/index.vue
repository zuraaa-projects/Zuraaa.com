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
          <b-button
            variant="light"
            class="hero__buttons__button"
            :to="`/bots/${bot._id}/add`"
          >
            Adicionar
          </b-button>
          <b-button
            v-b-modal.vote
            variant="light"
            class="hero__buttons__button"
          >
            Votar
          </b-button>
          <b-button
            variant="light"
            class="hero__buttons__button"
          >
            Denunciar
          </b-button>
          <b-button
            v-if="bot.details.website !== null"
            variant="light"
            class="hero__buttons__button"
            :href="bot.details.website"
          >
            Site
          </b-button>
          <b-button
            v-if="bot.details.donate !== null"
            variant="light"
            class="hero__buttons__button"
            :href="bot.details.donate"
          >
            Doar
          </b-button>
          <b-button
            v-if="bot.details.github !== null"
            variant="light"
            class="hero__buttons__button"
            :href="bot | botGitHub"
          >
            GitHub
          </b-button>
          <b-button
            v-if="bot.details.supportServer !== null"
            variant="light"
            class="hero__buttons__button"
            :href="bot | botSuportServer"
          >
            Suporte
          </b-button>
          <b-button
            v-if="permision(1)"
            variant="light"
            class="hero__buttons__button"
            :to="`/bots/${bot._id}/edit`"
          >
            Editar
          </b-button>
          <b-button
            v-if="permision(1)"
            variant="light"
            class="hero__buttons__button"
            :to="`/bots/${bot._id}/remove`"
          >
            Remover
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
import { Component, getModule, Vue } from 'nuxt-property-decorator'
import { Bot } from '~/models/bots/bot'
import UserModule from '~/store/user'
import { botGitHub, botSuportServer } from '~/utils/filters'

@Component({
  filters: {
    botGitHub,
    botSuportServer
  },
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
export default class BotPage extends Vue {
  bot!: Bot
  me = getModule(UserModule, this.$store).data

  head () {
    return {
      title: this.bot.username
    }
  }

  permision (roleLevel: number) {
    return (this.me !== null && (this.me._id === this.bot.owner || this.me.details.role > roleLevel))
  }
}
</script>

<style lang="scss">
.hero {
  &__buttons {
    padding-top: 1rem;
    &__button {
      margin: 0 0.3rem;
    }
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
