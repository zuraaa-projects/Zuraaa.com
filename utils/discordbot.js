const fetch = require('node-fetch')
const NodeCache = require('node-cache')

const cache = new NodeCache()

module.exports = (config) => {
  const baseUrl = 'https://discord.com/api/v8/'
  const headers = {
    Authorization: `Bot ${config.discord.bot.token}`,
    'Content-Type': 'application/json'
  }

  async function fetchUserDiscord (id) {
    let user = cache.get(id)
    if (!user) {
      const response = await fetch(`${baseUrl}users/${id}`, {
        headers
      })
      if (response.status === 200) {
        user = await response.json()
        cache.set(id, user, 3600)
      }
    }
    return user
  }

  async function criarDm (id) {
    const response = await fetch(`${baseUrl}users/@me/channels`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        recipient_id: id
      })
    })
    if (response.status === 200) {
      return response.json()
    }
    return undefined
  }

  async function sendMessage (channelId, content, isDM = false, isEmbed = false, hasExtraText = false, extraText = '') {
    function send (id) {
      if (isEmbed) {
        if (hasExtraText) {
          fetch(`${baseUrl}channels/${id}/messages`, {
            headers,
            method: 'POST',
            body: JSON.stringify({
              content: extraText,
              embed: content
            })
          })
          return
        }
        fetch(`${baseUrl}channels/${id}/messages`, {
          headers,
          method: 'POST',
          body: JSON.stringify({
            embed: content
          })
        })
        return
      }

      fetch(`${baseUrl}channels/${id}/messages`, {
        headers,
        method: 'POST',
        body: JSON.stringify({
          content
        })
      })
    }

    if (isDM) {
      const dm = await criarDm(channelId)
      send(dm.id)
    } else {
      send(channelId)
    }
  }

  function addRole (guildId, memberId, roleId) {
    fetch(`${baseUrl}guilds/${guildId}/members/${memberId}/roles/${roleId}`, {
      headers,
      method: 'PUT'
    })
  }

  function removeBot (guildId, memberId) {
    fetch(`${baseUrl}guilds/${guildId}/members/${memberId}`, {
      headers,
      method: 'DELETE'
    })
  }

  return {
    fetchUser: fetchUserDiscord,
    sendMessage,
    addRole,
    removeBot,
    criarDm,
    fetchUserDiscord
  }
}
