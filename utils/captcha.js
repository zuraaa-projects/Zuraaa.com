const fetch = require("node-fetch");

async function captchaIsValid(config, response) {
  if (!config.enabled) return true; // Ativar/Desativar verificação do captcha nas configs para testar add bot rapidamente.
  const res = await (await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${config.secret}&response=${response}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })).json();
  return (res.success) && (res.score >= 0.5);
}

module.exports = {
  captchaIsValid,
};
