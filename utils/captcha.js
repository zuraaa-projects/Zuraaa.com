const fetch = require("node-fetch");

async function getCaptchaResponse(secret, response) {
     return await (await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: `secret=${secret}&response=${response}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })).json();
}

module.exports = {
    getCaptchaResponse
};