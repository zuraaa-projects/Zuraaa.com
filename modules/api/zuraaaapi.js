const Axios = require('axios');
const { api: { zuraaa: { url, secret } } } = require('../../config.json');

class ZuraaaApi {
  // 'this.api' Deveria ser PRIVATE E READONLY
  constructor() {
    this.api = Axios.create({
      baseURL: url,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  async addBot(bot, token) {
    try {
      return (await this.api.post('/bots', {
        bot,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async updateBot(botID, bot, token) {
    try {
      return (await this.api.patch(`/bots/${botID}`, {
        bot,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data;
    } catch {
      return undefined;
    }
  }

  async vote(id, token) {
    try {
      return (await this.api.post(`/bots/${id}/votes`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data;
    } catch (error) {
      if (error.response.status === 429) {
        return {
          cooldown: true,
          nextVote: new Date(error.response.data),
        };
      }
      return undefined;
    }
  }

  async getMe(token) {
    try {
      return (await this.api.get('/users/@me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })).data;
    } catch {
      return undefined;
    }
  }

  async login(code, type) {
    try {
      return (await this.api.post('/auth/user', {
        code,
        identify: secret,
        type,
      })).data;
    } catch {
      return undefined;
    }
  }

  async getBots(search = '', page) {
    try {
      return (await this.api.get('/bots', {
        params: {
          search,
          page,
          type: 'page',
        },
      })).data;
    } catch {
      return [];
    }
  }

  async getAvatar(id) {
    try {
      const response = await this.api.get(`avatars/${id}`, {
        responseType: 'arraybuffer',
      });
      return {
        image: response.data,
        contentType: response.headers['content-type'],
      };
    } catch {
      return undefined;
    }
  }

  async getBot(id) {
    try {
      return (await this.api.get(`bots/${id}`)).data;
    } catch {
      return undefined;
    }
  }

  async getTopBots() {
    return (await this.api.get('bots?type=top')).data;
  }

  async getUserBots(id) {
    return (await this.api.get(`users/${id}/bots`)).data;
  }

  async getUser(id) {
    return (await this.api.get(`users/${id}`)).data;
  }

  // async removeBot(botId, requestId) {
  //   return (await this.api.delete(`/bots/${botId}`, {
  //     headers: {
  //       Authorization: `Bearer ${(await this.getUserToken(requestId)).access_token}`,
  //     },
  //   })).data;
  // }

  // async resetVotes(requestId) {
  //   const token = (await this.getUserToken(requestId)).access_token;
  //   console.log(token);
  //   const result = await this.api.put('/bots?type=resetVotes', null, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   return result.status === 200;
  // }

  async getBotCount() {
    return (await this.api.get('/bots?type=count')).data;
  }
}

module.exports = { ZuraaaApi };
