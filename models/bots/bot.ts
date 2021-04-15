export interface BotDetails {
  shortDescription: string
  customInviteLink: string,
  htmlDescription: string
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
