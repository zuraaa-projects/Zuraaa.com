export interface UserDetails {
  description: string
}

export interface User {
  _id: number
  username: string
  discriminator: string
  avatar: string
  details: UserDetails
}
