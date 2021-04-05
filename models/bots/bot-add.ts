import { BotLibrary, BotTag } from './bot-enum'

export class BotAddDetails {
  prefix!: string
  tags!: BotTag[]
  library!: BotLibrary | null
  customInviteLink!: string
  shortDescription!: string
  longDescription!: string
  isHTML!: boolean
  supportServer!: string
  website!: string
  otherOwners!: string[]
  donate!: string
  github!: string
}

export class BotAdd {
  _id!: string
  details!: BotAddDetails
}
