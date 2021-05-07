export interface BotDetails {
  shortDescription: string
  customInviteLink: string
  htmlDescription: string
  website: string | null
  github: string | null
  supportServer: string | null
  donate: string | null
  otherOwners: number[] | null
  tags: string[]
  prefix: string
  library: string
  guilds: number
}

export interface BotVotes {
  current: number
}

export interface Bot {
  _id: string
  username: string
  discriminator: string
  avatar: string
  details: BotDetails
  status: string
  owner: number
  votes: BotVotes
}

export interface BotCount {
  'bots_count': number
}
