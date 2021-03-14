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

export interface UserMe extends User {
  banned: boolean
}

export interface UserDetails {
  description: string
  role: number
  customURL: string
}

export interface Bot {
  _id: string
  username: string
  discriminator: string
}

export interface Avatar {
  type: string
  length: string
  data: Buffer
}
