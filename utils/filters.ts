import { Bot } from '~/models/bots/bot'
import { User } from '~/models/users/user'

export function genAvatar (user: User | Bot | null) {
  if (user == null) { return '' }

  return `${process.env.apiUrl}/avatars/${user._id}/${user.avatar}`
}

export function altName (user: User | Bot | null) {
  if (user == null) { return '' }

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
