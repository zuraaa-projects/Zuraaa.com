export interface BotDetails {
  shortDescription: string
}

export interface Bot {
  _id: number
  username: string
  discriminator: string
  avatar: string
  details: BotDetails
  status: string
}

export interface BotCount {
  'bots_count': number
}
