const mongoose = require('mongoose');

module.exports = class Mongo {
  constructor(config) {
    mongoose.connect(config.database.mongo.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    this.Users = mongoose.model('users', new mongoose.Schema({
      _id: String,
      username: String,
      discriminator: String,
      avatar: String,
      avatarBuffer: {
        data: Buffer,
        contentType: String,
      },
      dates: {
        firstSeen: {
          default: Date.now,
          type: Date,
        },
        lastBotAdd: Date,
        nextVote: Date,
      },
      details: {
        description: String,
        role: Number,
      },
    }));

    this.Bots = mongoose.model('bots', new mongoose.Schema({
      _id: String,
      username: String,
      discriminator: String,
      avatar: String,
      avatarBuffer: {
        data: Buffer,
        contentType: String,
      },
      status: String,
      owner: {
        ref: 'users',
        type: String,
      },
      dates: {
        sent: {
          default: Date.now,
          type: Date,
        },
        approved: Date,
      },
      details: {
        prefix: String,
        tags: Array,
        library: String,
        customInviteLink: String,
        shortDescription: String,
        longDescription: String,
        htmlDescription: String,
        supportServer: String,
        website: String,
        github: String,
        guilds: Number,
        otherOwners: [
          {
            ref: 'users',
            type: String,
          },
        ],
        customURL: String,
      },
      approvedBy: {
        ref: 'users',
        type: String,
      },
      votes: {
        current: {
          default: 0,
          type: Number,
        },
        voteslog: [
          {
            ref: 'users',
            type: String,
          },
        ],
      },
      count: {
        guild: Number,
      },
      tokens: {
        current: String,
      },
      webhook: {
        url: String,
        authorization: String,
      },
    }));
  }
};
