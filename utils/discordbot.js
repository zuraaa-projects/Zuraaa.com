const { NotFound } = require("http-errors");
const fetch = require("node-fetch");

module.exports = (config) => {
    const baseUrl = "https://discord.com/api/v8/";
    const headers = {
        Authorization: `Bot ${config.discord.bot.token}`,
        "Content-Type": "application/json"
    };

    async function fetchUser(id) {
        const response = await fetch(`http://localhost:5001/users/${id}`);
        if (response.status == 200)
            return await response.json();
    }

    async function criarDm(id){
        const response = await fetch(`${baseUrl}users/@me/channels`, {
            headers,
            method: "POST",
            body: JSON.stringify({
                recipient_id: id
            })
        });
        if(response.status == 200){
            return await response.json();
        }
    }

    async function sendMessageDm(id, content) {
        const dmCriada = await criarDm(id);
        if(dmCriada){
            fetch(`${baseUrl}channels/${dmCriada.id}/messages`, {
                headers,
                method: "POST",
                body: JSON.stringify({
                    embed: content
                })
            });
        }
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
        removeBot,
        criarDm,
        sendMessageDm
    };
};