import { BotLibrary, BotTag } from './bot-enum'

export class BotAddDetails {
  prefix: string
  tags: BotTag[]
  library: BotLibrary | null
  customInviteLink: string
  shortDescription: string
  longDescription: string
  isHTML: boolean
  supportServer: string
  website: string
  otherOwners: string[] | null
  donate: string
  github: string

  constructor () {
    this.prefix = ''
    this.tags = []
    this.library = null
    this.customInviteLink = ''
    this.shortDescription = ''
    this.longDescription = ''
    this.isHTML = false
    this.supportServer = ''
    this.website = ''
    this.otherOwners = null
    this.donate = ''
    this.github = ''
  }
}

export class BotAdd {
  _id: string
  details: BotAddDetails

  constructor () {
    this._id = ''
    this.details = new BotAddDetails()
  }
}
