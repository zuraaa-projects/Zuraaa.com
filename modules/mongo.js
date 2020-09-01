const mongoose = require("mongoose");

module.exports = class Mongo{
    constructor(config){
        mongoose.connect(config.database.mongo.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        this.Users = mongoose.model("users", new mongoose.Schema({
            _id: String,
            username: String,
            discriminator: String,
            avatar: String,
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
                otherOwners: Array,
                customURL: String
            },
            approvedBy: {
                ref: "users",
                type: String
            },
            votes: {
                current: Number
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