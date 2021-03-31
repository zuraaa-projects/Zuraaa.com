/* global secret, apiBaseUrl */

function login (secret, apiBaseUrl) {
  const params = new URLSearchParams(document.location.search.substring(1))
  const code = params.get('code')

  fetch(`${apiBaseUrl}/auth/user`, {
    body: JSON.stringify({
      type: 'code',
      data: code,
      identify: secret
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    if (res.status === 201) {
      res.json().then(({ access_token: token, role }) => {
        localStorage.setItem('token', token)
      })
    } else {
      // Shiba coloca algo aqui caso de errado
    }
  })
}

login(secret, apiBaseUrl)
