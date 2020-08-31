function userToString(user) {
    return `${user.username}#${user.discriminator}`; 
};

function avatarFormat(user) {
    const avatar = user.avatar;
    if (!avatar)
        return "https://cdn.discordapp.com/embed/avatars/4.png";
    return "https://cdn.discordapp.com/avatars/" + (user.id || user._id) + "/" + avatar + (avatar.startsWith("a_") ? ".gif" : ".webp?size=1024");
}

module.exports = {
    userToString,
    avatarFormat
};