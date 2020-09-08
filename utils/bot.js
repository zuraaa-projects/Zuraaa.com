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
    guilds: bot.count ? bot.count.guilds : undefined,
    baseUrl: `/bots/${bot.details.customURL || bot.id || bot._id}/`
  };
}

module.exports = {
  partialBotObject,
};
