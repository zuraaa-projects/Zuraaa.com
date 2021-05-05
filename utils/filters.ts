import { Bot } from '~/models/bots/bot'
import { User } from '~/models/users/user'

export function genAvatar (bot: User | Bot) {
  return `${process.env.apiUrl}/avatars/${bot._id}/${bot.avatar}`
}

export function altName (user: User | Bot) {
  return `${user.username}#${user.discriminator} Image`
}

export function botStatus (bot: Bot) {
  return require(`~/assets/status/${bot.status}.png`)
}

export function myPage (user: User) {
  return `/users/${user._id}`
}

export function botGitHub (bot: Bot) {
  return `https://github.com/${bot.details.github}`
}

export function botSuportServer (bot: Bot) {
  return `https://discord.gg/${bot.details.supportServer}`
}
