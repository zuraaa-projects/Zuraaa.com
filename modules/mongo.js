const mongoose = require('mongoose')

module.exports = class Mongo {
  constructor (config) {
    mongoose.connect(config.database.mongo.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })

    this.Users = mongoose.model('users', new mongoose.Schema({
      _id: String,
      username: String,
      discriminator: String,
      avatar: String,
      dates: {
        firstSeen: {
          default: Date.now,
          type: Date
        },
        nextVote: {
          default: null,
          type: Date
        }
      },
      details: {
        description: {
          default: null,
          type: String
        },
        role: {
          default: null,
          type: Number
        }
      }
    }))

    this.Bots = mongoose.model('bots', new mongoose.Schema({
      _id: String,
      username: String,
      discriminator: String,
      avatar: {
        default: null,
        type: String
      },
      status: String,
      owner: {
        ref: 'users',
        type: String
      },
      dates: {
        sent: {
          default: Date.now,
          type: Date
        },
        approved: {
          default: null,
          type: Date
        }
      },
      details: {
        prefix: String,
        tags: Array,
        library: String,
        customInviteLink: {
          default: null,
          type: String
        },
        shortDescription: String,
        longDescription: {
          default: null,
          type: String
        },
        htmlDescription: {
          default: null,
          type: String
        },
        supportServer: {
          default: null,
          type: String
        },
        website: {
          default: null,
          type: String
        },
        github: {
          default: null,
          type: String
        },
        donate: {
          default: null,
          type: String
        },
        otherOwners: {
          default: [],
          type: [
            {
              ref: 'users',
              type: String
            }
          ]
        },
        customURL: {
          default: null,
          type: String
        }
      },
      approvedBy: {
        ref: 'users',
        type: String
      },
      votes: {
        current: {
          default: 0,
          type: Number
        },
        voteslog: [
          {
            ref: 'users',
            type: String
          }
        ]
      },
      webhook: {
        authorization: {
          default: null,
          type: String
        },
        url: {
          default: null,
          type: String
        },
        type: {
          default: 0,
          type: Number
        },
        lastError: {
          default: false,
          type: Boolean
        }
      }
    }))
  }
}
