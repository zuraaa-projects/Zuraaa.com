import Axios, { AxiosInstance } from 'axios'
import config from '../../config.json'
import { Auth, Bot, DeleteResult, SendBot, User, WebhookBody } from './types'
import FormData from 'form-data'

export default class Api {
  private readonly api: AxiosInstance
  constructor () {
    this.api = Axios.create({
      baseURL: config.api.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async report (token: string, id: string, topic: string, reason: string, files: any[] | undefined): Promise<{bot: Bot}> {
    const data = new FormData()
    if (files !== undefined) {
      if (!Array.isArray(files)) {
        files = [files]
      }
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        data.append('files', file.data, {
          filename: file.name,
          knownLength: file.size
        })
      }
    }
    data.append('topic', topic)
    data.append('reason', reason)

    return (await this.api.post(`/bots/${id}/reports`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`
      }
    })).data
  }

  async login (code: string): Promise<Auth | undefined> {
    return (await this.api.post('/auth/user', {
      type: 'code',
      identify: config.api.secret,
      data: code
    })).data
  }

  async ban (token: string, id: string, reason: string): Promise<User> {
    return (await this.api.put(`/users/${id}`,
      {
        banned: true,
        banReason: reason
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })).data
  }

  async unban (token: string, id: string): Promise<User> {
    return (await this.api.put(`/users/${id}`,
      {
        banned: false
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })).data
  }

  async updateMe (token: string, newBio: string): Promise<User> {
    return (await this.api.put('/users/@me',
      {
        bio: newBio
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })).data
  }

  async getMe (token: string): Promise<User> {
    return (await this.api.get('/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })).data
  }

  async getBot (id: string, token?: string): Promise<Bot> {
    const headers = token != null
      ? {
          Authorization: `Bearer ${token}`
        }
      : {}
    return (await this.api.get('/bots/' + id, { headers })).data
  }

  async getUser (id: string): Promise<User> {
    return (await this.api.get('/users/' + id)).data
  }

  async sendBot (token: string, bot: SendBot): Promise<Bot> {
    return (await this.api.post(
      '/bots',
      bot,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })).data
  }

  async editBot (token: string, id: string, bot: SendBot): Promise<Bot> {
    return (await this.api.put(
      `/bots/${id}`,
      bot,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })).data
  }

  async testWebhook (token: string, body: WebhookBody): Promise<number> {
    try {
      const res = await this.api.post(
        '/webhook',
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      return res.status
    } catch (err) {
      return err.response?.status ?? 500
    }
  }

  async removeBot (token: string, id: string): Promise<DeleteResult> {
    return (await this.api.delete(`/bots/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })).data
  }

  async removeBotReason (token: string, id: string, reason?: string): Promise<DeleteResult> {
    return (await this.api.post(`/bots/${id}/reason-remove`, {
      reason
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })).data
  }
}
