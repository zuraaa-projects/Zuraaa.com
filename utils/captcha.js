const fetch = require("node-fetch");

async function captchaIsValid(config, response) {
  if (!config.enabled) return true; // Ativar/Desativar verificação do captcha nas configs para testar add bot rapidamente.

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: `secret=${config.secret}&response=${response}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then((res) => res.json());

  return res.sucess && res.score >= 0.5;
}

module.exports = {
  captchaIsValid,
};
