import Axios, { AxiosInstance } from 'axios'
import config from '../../config.json'
import { Auth, Avatar, Bot, User } from './types'
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
    try {
      return (await this.api.post('/auth/user', {
        type: 'code',
        identify: config.api.secret,
        data: code
      })).data
    } catch (error) {
      console.error('error during login:', error.response.data)
    }
  }

  async getAvatar (id: string): Promise<Avatar> {
    const avatar = await this.api.get('/avatars/' + id, {
      responseType: 'arraybuffer'
    })
    return {
      data: avatar.data,
      type: avatar.headers['content-type'],
      length: avatar.headers['content-length']
    }
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

  async getBot (id: string): Promise<Bot> {
    return (await this.api.get('/bots/' + id)).data
  }

  async getUser (id: string): Promise<User> {
    return (await this.api.get('/users/' + id)).data
  }
}
