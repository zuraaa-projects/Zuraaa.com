import config from '../config.json'

export function formatUrl (id: string, hash: string): string {
  return `${config.api.outerBase}/avatars/${id}/${hash}`
}
