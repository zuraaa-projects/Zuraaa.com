import { BotLibrary, BotTag } from './bot-enum'

export class BotAddDetails {
  prefix: string | null
  tags: BotTag[]
  library: BotLibrary | null
  customInviteLink: string
  shortDescription: string | null
  longDescription: string | null
  isHTML: boolean
  supportServer: string
  website: string
  otherOwners: string[]
  donate: string
  github: string

  constructor () {
    this.prefix = null
    this.tags = []
    this.library = null
    this.customInviteLink = ''
    this.shortDescription = null
    this.longDescription = null
    this.isHTML = false
    this.supportServer = ''
    this.website = ''
    this.otherOwners = []
    this.donate = ''
    this.github = ''
  }
}

export class BotAdd {
  _id: string | null
  details: BotAddDetails

  constructor () {
    this._id = null
    this.details = new BotAddDetails()
  }
}
