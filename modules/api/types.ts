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

export interface UserDetails {
  description: string
  role: number
}

export interface Bot {
  _id: string
  username: string
  discriminator: string
}
