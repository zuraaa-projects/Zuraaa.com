function partialBotObject(bot) {
    return {
        tags: bot.details.tags,
        avatar: bot.avatarBuffer && bot.avatarBuffer.contentType ?
            "data:" + bot.avatarBuffer.contentType + ";base64, " + bot.avatarBuffer.data :
            "https://cdn.discordapp.com/embed/avatars/4.png",
        name: bot.username,
        id: bot.id || bot._id,
        status: bot.status,
        description: bot.details.shortDescription,
        votes: bot.votes ? bot.votes.current : -1,
        guilds: bot.details.guilds ? "±" + bot.details.guilds : undefined,
        baseUrl: `/bots/${bot.details.customURL || bot.id || bot._id}/`
    };
}

function botObjectSender(bot) {
    return {
        _id: bot._id,
        username: bot.username,
        discriminator: bot.discriminator,
        owner: bot.owner,
        avatar: bot.avatar,
        status: bot.status,
        dates: {
            sent: bot.dates.sent
        },
        details: bot.details,
        votes: {
            current: bot.votes.current,
            voteslog: bot.votes.voteslog
        },

    }
}

module.exports = {
    partialBotObject,
    botObjectSender
};
