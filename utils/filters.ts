import { Bot } from '~/models/bots/bot'

export function genAvatar (bot: Bot) {
  return `${process.env.apiUrl}/avatars/${bot._id}/${bot.avatar}`
}
