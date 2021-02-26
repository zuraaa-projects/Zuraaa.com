function userToString(user) {
  return `${user.username}#${user.discriminator}`;
}

module.exports = {
  userToString,
};
