import { Bot } from '~/models/bots/bot'

export function genAvatar (bot: Bot) {
  return `${process.env.apiUrl}/avatars/${bot._id}/${bot.avatar}`
}

export function altBotImage (bot: Bot) {
  return `${bot.username}#${bot.discriminator} Image`
}

export function botName (bot: Bot) {
  return `${bot.username}#${bot.discriminator}`
}

export function botStatus (bot: Bot) {
  return require(`~/assets/status/${bot.status}.png`)
}
