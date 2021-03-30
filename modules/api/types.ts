export interface FindBotQuery {
  search?: string
  type?: string
  page?: string
  tags?: string
  limit?: string
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

export const libraries = [
  'discord.js',
  'discord.py',
  'discordCr',
  'discord.io',
  'eris',
  'RestCord',
  'discordia',
  'nxy',
  'serenity',
  'discordie',
  'DiscordPHP',
  'Sword',
  'DiscordUnity',
  'litcord',
  'discord-hs',
  'discordrb',
  'Discord.Net',
  'JDA',
  'Javacord',
  'DSharpPlus',
  'dscord',
  'DiscordGo',
  'DisGord',
  'Discord4j',
  'discordnim',
  'Yasmin',
  'disco',
  'AckCord',
  'Bot Designer',
  'DBM',
  'Outro'
] as const

export type Libraries = typeof libraries

export interface Bot {
  _id: string
  username: string
  discriminator: string
  avatar: string
  status: string
  owner: string
  approvedBy?: string
  dates: {
    sent: string
  }
  details: {
    prefix: string
    tags: BotsTags
    library: Libraries[keyof Libraries]
    customInviteLink?: string
    shortDescription: string
    longDescription?: string
    htmlDescription: string
    isHTML: boolean
    supportServer?: string
    website?: string
    customURL? : string
    otherOwners: string[] // todo
    donate?: string
    github?: string
    guilds?: number
  }
  votes: {
    current: number
    votesLog?: string[]
  }
}
