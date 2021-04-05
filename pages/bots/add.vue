<template>
  <div class="addbot">
    <b-form class="addbot__form">
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
            v-model="bot.details.prefix"
            description="Insira o prefixo do bot"
            label="Prefixo *"
            label-for="bot-prefix"
          >
            <b-form-input
              id="bot-prefix"
              placeholder="Prefixo"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            id="bot-lib-group"
            description="Escolha a biblioteca que usou para fazer o bot"
            label="Biblioteca *"
            label-for="bot-lib"
          >
            <b-form-select
              id="bot-lib"
              v-model="bot.details.library"
              :options="libs"
            />
          </b-form-group>
        </b-col>
      </b-form-row>
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

  get validateBotId () {
    if (this.bot._id == null || this.bot._id === '') { return null }
    return !isNaN(Number(this.bot._id))
  }
}
</script>

<style lang="scss" scoped>
.addbot {

  &__form {
    width: 80%;
    margin: 0 auto;
  }
}
</style>
