# Zuraaa.com

Site que tem como objetivo divulgar aplicações (bots, servers e serviços) para Discord, atualmente focado no mercado brasileiro de desenvolvedores.

Agradecimento especial ao Naegin pela base do Designer

Acompanhe o desenvolvimento [clicando aqui](https://github.com/zuraaa-projects)

## Baixar e inicializar a aplicação:
Baixe o codigo fonte usando o [Git](https://git-scm.com/downloads)
```sh
$ git clone https://github.com/zuraaa-projects/Zuraaa.com.git
```

Na pasta da aplicação crie um arquivo chamado config.json
```js
{
    "server": {
        "root": "https://zuraaa.com/",
        "port": 80,
        "session": {
            "secret": "Insira a chave para criptografar a session aqui"
        }
    },

    "database": {
        "mongo": {
            "url": "url do seu mongodb"
        }
    },

    "oauth": {
        "urls": {
            "authorization": "https://discord.com/api/oauth2/authorize",
            "token": "https://discord.com/api/oauth2/token",
            "redirect": "http://localhost/oauth2/callback"
        },
        "client": {
            "id": "id da aplicação do discord",
            "secret": "secret da aplicação do discord"
        }
    },
    "recaptcha": {
        "enabled": false,
        "secret": "secret do recaptcha"
    },
    "discord": {
        "bpdId": "guild da botlist",
        "addId": "guild do servidor de teste de bot",
        "bot": {
            "token": "token bot",
            "channels": {
                "botLogs": "canal de log de eventos do site"
            },
            "roles": {
                "developer": "developper role"
            }
        },
        "ownerId": "",
        "endpoints": {
            "userMe": "https://discord.com/api/users/@me"
        },
        "servers": {
            "support": "https://discord.gg/t5qzWQB"
        }
    }
}
```

Após configurar a aplicação basta baixar as dependências e rodar a aplicação:

```sh
$ npm i
$ npm start
```

## Complementos da comunidade

- [Verificador de Votos Zuraaa](https://github.com/sayuribotbr/votosZuraaa), permite você obtenha os votos do seu bot a partir da guild do Bots Para Discord (Javascript)
- [Async-zuraaa-wrapper](https://github.com/NiumXp/Async-zuraaa-wrapper), simples wrapper para pegar usuario a partir da API do Zuraaa (Python)
