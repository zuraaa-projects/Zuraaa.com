function userToString(user) {
  return `${user.username}#${user.discriminator}`;
}

function avatarFormat(user) {
  const avatar = user.avatar;
  if (!avatar) return "https://cdn.discordapp.com/embed/avatars/4.png";
  return (
    "https://cdn.discordapp.com/avatars/" +
    (user.id || user._id) +
    "/" +
    avatar +
    (avatar.startsWith("a_") ? ".gif" : ".webp?size=1024")
  );
}

function userToJson(user) {
  return {
    id: user._id,
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar,
    dates: user.dates,
    details: user.details,
  };
}

module.exports = {
  userToString,
  avatarFormat,
  userToJson,
};
