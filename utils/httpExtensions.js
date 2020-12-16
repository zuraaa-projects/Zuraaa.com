const fetch = require("node-fetch");

module.exports = () => {
    async function enviarVoto(url, authorization, usuario, totalVotos){
        console.log("Enviando(ou tentando) Webhook para: " + url);
        try{
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
            return true;
        }catch{
            return false;
        }
    }

    return {
        enviarVoto
    };
};