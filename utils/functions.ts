export function genAddBot (id: string) {
  return `https://discord.com/oauth2/authorize?client_id=${id}&permissions=0&scope=bot`
}
