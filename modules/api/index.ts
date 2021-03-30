import axios from 'axios'
import config from '../../config.json'
import { FindBotQuery, Bot } from './types'

export default class ZuraaaApi {
  private readonly api = axios.create({
    baseURL: config.api.baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  async getBots (query: FindBotQuery): Promise<Bot[]> {
    return (await this.api.get('/bots', {
      params: query
    })).data
  }
}
