const bot = require('./discordbot');

module.exports = (config) => {
  const app = bot(config);

  async function saveCached(element) {
    const user = await app.fetchUser(element.id || element._id);
    element.username = user?.nome;
    element.discriminator = user?.discriminator;
    if (user && (
      user.avatar !== element.avatarHash
      || !(element.avatarBuffer && element.avatarBuffer.contentType)
    )) {
      element.avatarBuffer = {
        contentType: `image/${user.avatarHash.startsWith('a_') ? 'gif' : 'webp'}`,
        data: user.avatar,
      };
      element.avatar = user.avatarHash;
      return element;
    }
    return undefined;
  }
  return {
    saveCached,
  };
};
