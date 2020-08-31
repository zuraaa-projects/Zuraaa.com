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

    return {
        fetchUser,
        sendMessage
    };
};