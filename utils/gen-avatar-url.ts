import { api } from '../config.json'

export function genAvatarUrl (id: string, avatarHash: string): string {
  return `${api.outerBase}/avatars/${id}/${avatarHash}`
}
