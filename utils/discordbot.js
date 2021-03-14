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
    const json = await response.json()
    if (response.status === 200) {
      return json
    } else {
      console.error('Error creating DM with', id, response.status, json)
    }
    return undefined
  }

  async function sendMessage (channelId, content, isDM = false, isEmbed = false, hasExtraText = false, extraText = '') {
    function send (id) {
      let body
      if (isEmbed) {
        if (hasExtraText) {
          body = {
            content: extraText,
            embed: content
          }
        } else {
          body = {
            embed: content
          }
        }
      } else {
        body = {
          content
        }
      }
      fetch(`${baseUrl}channels/${id}/messages`, {
        headers,
        method: 'POST',
        body: JSON.stringify(body)
      })
        .then(res => {
          if (res.status !== 200) {
            res.json().then(json => {
              console.error('Error sending message to', channelId, json)
            })
          }
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
      .then(res => {
        if (res.status >= 400) {
          console.error('Error deleting bot:', res.status)
        }
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
