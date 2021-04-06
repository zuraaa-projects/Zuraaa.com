<template>
  <div class="addbot">
    <h2 class="addbot__title">
      Adicionar Bot
    </h2>
    <b-form class="addbot__form">
      <b-container>
        <b-form-row>
          <b-col>
            <b-form-group
              id="bot-id-group"
              description="Insira o Id do bot"
              label="Bot Id *"
              label-for="bot-id"
              :validated="validateBotId"
            >
              <b-form-input
                id="bot-id"
                v-model="bot._id"
                placeholder="Bot Id"
                :state="validateBotId"
              />
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              id="bot-prefix-group"
              description="Insira o prefixo do bot"
              label="Prefixo *"
              label-for="bot-prefix"
              :validated="validatePrefix"
            >
              <b-form-input
                id="bot-prefix"
                v-model="bot.details.prefix"
                placeholder="Prefixo"
                :state="validatePrefix"
              />
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              id="bot-lib-group"
              description="Escolha a biblioteca que usou para fazer o bot"
              label="Biblioteca *"
              label-for="bot-lib"
              :validated="validateLib"
            >
              <b-form-select
                id="bot-lib"
                v-model="bot.details.library"
                :options="libs"
                :state="validateLib"
              />
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-form-group
            id="bot-owners-group"
            description="Adicione os outros donos do bot"
            label="Outros donos"
            label-for="bot-owners"
          >
            <b-form-tags
              id="bot-owners"
              v-model="bot.details.otherOwners"
              placeholder="Adicionar donos"
              tag-pills
              remove-on-delete
            />
          </b-form-group>
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
  },
  data () {
    const bot = new BotAdd()

    return {
      bot
    }
  }
})
export default class AddBot extends Vue {
  bot!: BotAdd

  libs!: any

  created () {
    this.libs = [
      { value: null, text: 'Escolha a biblioteca' },
      ...Object.entries(BotLibrary).map(lib => ({ value: lib[0], text: lib[1] }))
    ]
  }

  validateId (id: string) {
    if (id.length === 18 && !isNaN(Number(id))) {
      return true
    } else {
      return false
    }
  }

  get validateBotId () {
    if (this.bot._id == null || this.bot._id === '') {
      return null
    }
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
}
</script>

<style lang="scss" scoped>
.addbot {
  &__title {
    text-align: center;
  }
}
</style>
