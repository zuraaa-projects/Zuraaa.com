const { NotFound } = require("http-errors");
const fetch = require("node-fetch");

module.exports = (config) => {
    const baseUrl = "https://discord.com/api/";
    const headers = {
        Authorization: `Bot ${config.discord.bot.token}`,
        "Content-Type": "application/json"
    };

    async function fetchUser(id) {
        const response = await fetch(`${baseUrl}users/${id}`, {headers});
        if (response.status == 200)
            return await response.json();
    }

    function sendMessage(channelId, content) {
        fetch(`${baseUrl}channels/${channelId}/messages`, {
            headers,
            method: "POST",
            body: JSON.stringify({
                content: content
            })
        });
    }

    function addRole(guildId, memberId, roleId) {
        fetch(`${baseUrl}guilds/${guildId}/members/${memberId}/roles/${roleId}`, {
            headers,
            method: "PUT"
        });
    }

    function removeBot(guildId, memberId){
        fetch(`${baseUrl}guilds/${guildId}/members/${memberId}`, {
            headers,
            method: "DELETE"
        })
    }

    return {
        fetchUser,
        sendMessage,
        addRole,
        removeBot
    };
};