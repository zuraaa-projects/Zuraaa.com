const mongoose = require("mongoose");

module.exports = class Mongo {
    constructor(config) {
        mongoose.connect(config.database.mongo.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        this.Votes = mongoose.model("votes", new mongoose.Schema({
            user: {
                ref: "users",
                type: String
            },
            bot: {
                ref: "bots",
                type: String
            },
            date: {
                default: Date.now,
                type: Date
            }
        }));

        this.Users = mongoose.model("users", new mongoose.Schema({
            _id: String,
            username: String,
            discriminator: String,
            avatar: String,
            avatarBuffer: {
                data: Buffer,
                contentType: String
            },
            dates: {
                firstSeen: Date,
                lastBotAdd: Date,
                nextVote: Date
            },
            details: {
                customURL: String,
                bio: String
            },
            permissions: Array
        }));

        this.Bots = mongoose.model("bots", new mongoose.Schema({
            _id: String,
            username: String,
            discriminator: String,
            avatar: String,
            avatarBuffer: {
                data: Buffer,
                contentType: String
            },
            status: String,
            owner: {
                ref: "users",
                type: String
            },
            dates: {
                sent: Date,
                approved: Date
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
                otherOwners: [
                    {
                        ref: "users",
                        type: String
                    }
                ],
                customURL: String
            },
            approvedBy: {
                ref: "users",
                type: String
            },
            votes: {
                current: {
                    type: Number,
                    default: 0
                },
            },
            count: {
                guild: Number
            },
            tokens: {
                current: String
            }
        }));
    }
}