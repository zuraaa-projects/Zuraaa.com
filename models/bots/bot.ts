export interface BotDetails {
  shortDescription: string
  customInviteLink: string
  htmlDescription: string
  website: string | null
  github: string | null
  supportServer: string | null
  donate: string | null
}

export interface Bot {
  _id: string
  username: string
  discriminator: string
  avatar: string
  details: BotDetails
  status: string
  owner: number
}

export interface BotCount {
  'bots_count': number
}
