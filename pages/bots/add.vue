<template>
  <div class="botform">
    <h2 class="botform__title">
      Adicionar Bot
    </h2>
    <b-form class="botform__form">
      <b-container class="botform__container">
        <b-form-row class="botform__id">
          <b-col class="botform__id__col">
            <b-form-group
              id="bot-id-group"
              class="botform__id__group"
              description="Insira o ID do bot"
              label="ID do bot *"
              label-for="bot-id"
              :validated="validateBotId"
            >
              <b-form-input
                id="bot-id"
                v-model="bot._id"
                class="botform__id__input"
                placeholder="ID do bot"
                maxlength="18"
                :state="validateBotId"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="auto" class="botform__prefix">
            <b-form-group
              id="bot-prefix-group"
              class="botform__prefix__group"
              description="Insira o prefixo do bot"
              label="Prefixo *"
              label-for="bot-prefix"
              :validated="validatePrefix"
            >
              <b-form-input
                id="bot-prefix"
                v-model="bot.details.prefix"
                class="botform__prefix__input"
                placeholder="Prefixo"
                maxlength="15"
                :state="validatePrefix"
              />
            </b-form-group>
          </b-col>
          <b-col class="botform__lib">
            <b-form-group
              id="bot-lib-group"
              class="botform__lib__group"
              description="Escolha a biblioteca que usou para fazer o bot"
              label="Biblioteca *"
              label-for="bot-lib"
              :validated="validateLib"
            >
              <b-form-select
                id="bot-lib"
                v-model="bot.details.library"
                class="botform__lib__select"
                :options="libs"
                :state="validateLib"
              />
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row class="botform__owners">
          <b-col class="botform__owners__col">
            <b-form-group
              id="bot-owners-group"
              class="botform__owners__group"
              description="Adicione os outros donos do bot"
              label="Outros donos"
              label-for="bot-owners"
            >
              <b-form-tags
                id="bot-owners"
                v-model="bot.details.otherOwners"
                class="botform__owners__tags"
                placeholder="Adicionar donos"
                tag-pills
                remove-on-delete
                :tag-validator="validateId"
                :limit="5"
                duplicate-tag-text="Dono já adicionado:"
                invalid-tag-text="Dono inválido:"
                limit-tags-text="Limite de donos atingido."
                maxlength="18"
              />
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row class="botform__short-desc">
          <b-col class="botform__col">
            <b-form-group
              class="botform__short-desc__group"
              description="Descrição curta do seu bot, de 3 a 300 caracteres."
              label="Descrição curta *"
              label-for="bot-short-description"
              :validated="validateShortDescription"
            >
              <b-form-textarea
                id="bot-short-description"
                v-model="bot.details.shortDescription"
                class="botform__short-desc__textarea"
                placeholder="Descrição curta"
                maxlength="300"
                max-rows="5"
                :state="validateShortDescription"
              />
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row class="botform__long-desc">
          <b-col class="botform__long-desc__col">
            <b-form-group
              class="botform__long-desc__group"
              description="Descrição longa do seu bot, até 100.000 caracteres."
              label="Descrição longa"
              label-for="bot-long-description"
              :validated="validateLongDescription"
            >
              <b-input-group class="botform__long-desc__input-group">
                <b-form-textarea
                  id="bot-long-description"
                  v-model="bot.details.longDescription"
                  class="botform__long-desc__textarea"
                  placeholder="Descrição longa"
                  rows="3"
                  max-rows="20"
                  maxlength="100000"
                  :state="validateLongDescription"
                />
                <b-input-group-append is-text class="botform__long-desc__html">
                  <b-form-radio-group
                    id="bot-is-html"
                    v-model="bot.details.isHTML"
                    :options="longDescriptionOptions"
                    class="botform__long-desc__html__radio"
                  />
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-form-row>
      </b-container>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { BotAdd } from '~/models/bots/bot-add'
import { BotLibrary } from '~/models/bots/bot-enum'

@Component({
  head: {
    title: 'Zuraaa! | Adicionar bot'
  }
})
export default class AddBot extends Vue {
  bot: BotAdd = new BotAdd()

  libs!: any

  longDescriptionOptions!: any

  created () {
    this.libs = [
      { value: null, text: 'Escolha a biblioteca' },
      ...Object.entries(BotLibrary).map(lib => ({ value: lib[0], text: lib[1] }))
    ]

    this.longDescriptionOptions = [
      {
        text: 'Modo Markdown',
        value: false
      },
      {
        text: 'Modo HTML e CSS',
        value: true
      }
    ]
  }

  validateId (id: string | null) {
    if (id == null) {
      return null
    }
    return !!id.match(/^[0-9]{18}$/)
  }

  get validateBotId () {
    return this.validateId(this.bot._id)
  }

  get validatePrefix () {
    if (this.bot.details.prefix == null) {
      return null
    }

    if (this.bot.details.prefix === '' || this.bot.details.prefix.length > 15) {
      return false
    } else {
      return true
    }
  }

  get validateLib () {
    if (this.bot.details.library == null) {
      return null
    } else {
      return true
    }
  }

  get validateShortDescription () {
    if (this.bot.details.shortDescription == null) {
      return null
    }
    return this.bot.details.shortDescription.length >= 3
  }

  get validateLongDescription () {
    if (this.bot.details.longDescription == null) {
      return null
    }

    return true
  }
}
</script>

<style lang="scss" scoped>
.botform {
  &__title {
    text-align: center;
  }
  &__long-desc {
    &__html {
      width: 100%;
      display: block;
    }
  }
}
</style>
