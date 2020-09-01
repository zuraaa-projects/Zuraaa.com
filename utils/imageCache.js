const bot = require("./discordbot");
const formatter = require("./user");
const fetch = require("node-fetch");

module.exports = (config) => {
    const app = bot(config);

    async function saveCached(element){
        const user = await app.fetchUser(element.id);
        if(user.avatar != element.avatar || !element.avatarBuffer.length){
            const response = await fetch(formatter.avatarFormat(user));
            const image = Buffer.from(await response.buffer())
            element.avatarBuffer = {
                contentType: response.headers.get("content-type"),
                data: image.toString("base64")
            }
        }
        return element;
    }

    return{
        saveCached
    }
}