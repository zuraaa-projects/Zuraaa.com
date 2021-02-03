function userToString(user) {
  return `${user.username}#${user.discriminator}`;
}

function avatarFormat(user) {
  const avatarHash = user.avatar;

  if (!avatarHash) {
    const number = user.discriminator % 5;
    return `https://cdn.discordapp.com/embed/avatars/${number}.png`;
  }

  const isAnimatedAvatar = avatarHash.startsWith('a_');
  const avatarExtension = isAnimatedAvatar ? '.gif' : '.webp?size=1024';
  const userId = (user.id || user._id);

  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}${avatarExtension}`;
}

module.exports = {
  userToString,
  avatarFormat,
};
