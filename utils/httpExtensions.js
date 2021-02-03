const fetch = require('node-fetch');

module.exports = () => {
  async function enviarVoto(url, authorization, usuario, totalVotos) {
    console.log(`Enviando(ou tentando) Webhook para: ${url}`);
    try {
      await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
        method: 'POST',
        body: JSON.stringify({
          user: {
            _id: usuario.id,
            username: usuario.username,
            discriminator: usuario.discriminator,
            avatar: usuario.avatar,
          },
          total_votes: totalVotos,
        }),
      });
      return true;
    } catch {
      return false;
    }
  }

  async function pegarServidores(id) {
    const response = await fetch(`http://127.0.0.1:5000/api/bots/${id}`);
    if (response.status === 200) {
      return (await response.json()).guildCount;
    }
    return undefined;
  }

  return {
    enviarVoto,
    pegarServidores,
  };
};
