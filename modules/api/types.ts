export interface Auth {
  access_token: string
}

export interface User {
  _id: string
  username: string
  discriminator: string
  avatar: string
  details: UserDetails
}

export interface UserDetails {
  description: string
  role: number
}

export interface Bot {
  _id: string
  username: string
  discriminator: string
}

export enum BotsTags {
  Anime = 'anime',
  Dashboard = 'dashboard',
  'Diversão' = 'diversao',
  Utilidades = 'utilidades',
  Social = 'social',
  Jogos = 'jogos',
  'Música' = 'musica',
  'Moderação' = 'moderacao',
  Economia = 'economia',
  Fortnite = 'fortnite',
  LOL = 'lol',
  Minecraft = 'minecraft',
  Hytale = 'hytale',
  NSFW = 'nsfw',
  Outros = 'outros'
}

export enum AppLibrary {
  discordjs = 'discord.js',
  discordpy = 'discord.py',
  discordCr = 'discordCr',
  discordio = 'discord.io',
  eris = 'eris',
  restCord = 'RestCord',
  discordia = 'discordia',
  nxy = 'nxy',
  serenity = 'serenity',
  discordie = 'discordie',
  discordPhp = 'DiscordPHP',
  sword = 'Sword',
  discordUnity = 'DiscordUnity',
  litcord = 'litcord',
  discordhs = 'discord-hs',
  discordrb = 'discordrb',
  discordNet = 'Discord.Net',
  jda = 'JDA',
  javaCord = 'Javacord',
  dSharpPlus = 'DSharpPlus',
  dscord = 'dscord',
  discordGo = 'DiscordGo',
  disGord = 'DisGord',
  discord4j = 'Discord4j',
  discordnim = 'discordnim',
  yasmin = 'Yasmin',
  disco = 'disco',
  ackCord = 'AckCord',
  botDesigner = 'Bot Designer',
  dbm = 'DBM',
  outro = 'Outro'
}

export interface SendBot {
  _id: string
  details: {
    prefix: string
    tags: BotsTags[]
    library: AppLibrary
    customInviteLink: string
    shortDescription: string
    longDescription?: string
    isHTML: boolean
    supportServer?: string
    website?: string
    otherOwners?: string[]
    donate?: string
    github?: string
    webhook: {
      authorization?: string
      url?: string
      type: number
    }
  }
}

export interface WebhookBody {
  authorization?: string
  url: string
  type: 1 | 2
}

export interface DeleteResult {
  deleted: boolean
}
