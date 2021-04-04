export interface BotDetails {
  shortDescription: string
  customInviteLink: string
}

export interface Bot {
  _id: string
  username: string
  discriminator: string
  avatar: string
  details: BotDetails
  status: string
}

export interface BotCount {
  'bots_count': number
}
