<template>
  <div class="botcard">
    <img
      class="botcard__image"
      :src="bot | genAvatar"
      :alt="bot | altBotImage"
    >
    <div class="botcard__details">
      <p class="botcard__details__datas">
        {{ bot.details.tags[Math.floor(Math.random() * bot.details.tags.length)] }} |
        ±{{ bot.details.guilds }} servidores |
        {{ bot.votes.current }} votos
      </p>
      <div class="botcard__details__info">
        <img
          class="botcard__details__info__status"
          :src="bot | botStatus"
          :alt="bot.status"
        >
        <p class="botcard__details__info__name">
          {{ bot.username }}
        </p>
        <font-awesome-icon
          class="botcard__details__info__link"
          icon="link"
        />
      </div>
      <p class="botcard__details__description">
        {{ bot.details.shortDescription }}
      </p>
      <div class="botcard__details__button">
        <CustomButton name="Página" />
        <CustomButton name="Adicionar" />
        <CustomButton name="Votar" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { genAvatar, altBotImage, botStatus } from '~/utils/filters'
import { Bot } from '~/models/bots/bot'

@Component({
  filters: {
    genAvatar,
    altBotImage,
    botStatus
  }
})
export default class extends Vue {
  @Prop({
    required: true
  })
  bot!: Bot
}
</script>

<style lang="scss" scoped>
.botcard {
  width: 380px;
  height: 230px;
  margin: 0.5rem;
  display: flex;
  box-shadow: 2px 2px 3px 1px rgba(0,0,0,.6);
  @media (max-width: 380px) {
    flex-direction: column;
    height: 340px;
  }

  &__image {
    width: 80px;
    object-fit: cover;
    @media (max-width: 380px) {
      width: 100%;
      height: 240px;
    }
  }

  &__details {
    padding: 10px 8px;
    width: calc(100% - 80px);
    @media (max-width: 380px) {
      width: 100%;
    }

    &__datas {
      font-size: 0.7rem;
      text-transform: uppercase;
      margin-bottom: 0.2rem;
    }

    &__info {
      display: flex;
      align-items: center;

      &__status {
        width: 26px;
        display: inline;
      }

      &__name {
        font-size: 1.5rem;
        display: inline;
        margin-bottom: 0;
        @media (max-width: 380px) {
          font-size: 1.2rem;
          text-decoration: underline;
        }
      }

      &__link {
        display: none;
        @media (max-width: 380px) {
          margin-left: 0.5rem;
          display: initial;
          width: 0.8rem;
        }
      }
    }

    &__description {
      overflow: auto;
      height: 107px;
      margin-bottom: 0;
      @media (max-width: 380px) {
        display: none;
      }
    }

    &__button {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      height: 37px;
      margin-top: 10px;
    }
  }
}
</style>
