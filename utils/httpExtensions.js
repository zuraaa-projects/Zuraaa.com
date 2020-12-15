const fetch = require("node-fetch");

module.exports = () => {
    async function enviarVoto(url, authorization, usuario, totalVotos){
        
            await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authorization
                },
                method: "POST",
                body: JSON.stringify({
                    user: {
                        _id: usuario.id,
                        username: usuario.username,
                        discriminator: usuario.discriminator,
                        avatar: usuario.avatar
                    },
                    total_votes: totalVotos
                })
            });
    }

    return {
        enviarVoto
    };
};