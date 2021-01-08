const fetch = require("node-fetch");

async function captchaIsValid(config, response) {
  console.log(response);
  if (!config.enabled) return true; // Ativar/Desativar verificação do captcha nas configs para testar add bot rapidamente.
  const params = new URLSearchParams();
  params.append("secret", config.secret);
  params.append("response", response);
  const res = await (await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params
  })).json();
  console.log(res);
  return res.success;
}

module.exports = {
  captchaIsValid,
};
