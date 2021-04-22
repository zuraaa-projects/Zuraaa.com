$(function () {
  const addOwner = $('#addOwner')
  const remOwner = $('#remOwner')
  const owners = $('#owners')
  addOwner.click(function () {
    owners.prepend($("<input class='input owner-input' name='owners' maxlength='18' placeholder='Insira o ID do usuário'>"))
    const childLen = owners.children('.input').length
    if (childLen === 5) {
      addOwner.toggleClass('is-hidden')
    } else if (childLen === 1) {
      remOwner.toggleClass('is-hidden')
    }
  })
  remOwner.click(function () {
    owners.children('.input').last().remove()
    const childLen = owners.children('.input').length
    if (!childLen) {
      remOwner.toggleClass('is-hidden')
    } else if (childLen === 4) {
      addOwner.toggleClass('is-hidden')
    }
  })

  $('#tags').click(function tagClick () {
    const tags = $(this).val()
    if (tags.length >= 6) {
      $('#limite').css('display', 'block')
    } else {
      $('#limite').css('display', 'none')
    }

    if (tags.length > 6) {
      console.log($('option:selected').last().prop('selected', false))
    }
  })

  $('#webhook').change(function () {
    switch (this.value) {
      case '1':
        $('#webhook-url')
          .removeClass('is-hidden')
        $('#webhook-header')
          .addClass('is-hidden')
        break
      case '2':
        $('#webhook-url')
          .removeClass('is-hidden')
        $('#webhook-header')
          .removeClass('is-hidden')
        break
      default:
        $('#webhook-url')
          .addClass('is-hidden')
        $('#webhook-header')
          .addClass('is-hidden')
        break
    }
  }).trigger('change')
  $('#webhookurl').keydown(function () {
    resetClasses(this)
    changeWebhookText('')
  })
  $('#test').click(function () {
    window.testWebhook()
  })
})

window.onSubmit = function onSubmit () {
  $('#form').submit()
}

function changeWebhookText (text, className) {
  resetClasses('#message')
  const sel = $('#message')
  sel.addClass(className)
  if (text) {
    sel.text(text)
  } else {
    sel.empty()
  }
}

function resetClasses (selector) {
  $(selector).removeClass(['is-warning', 'is-success', 'is-danger'])
}

window.testWebhook = function testWebhook () {
  resetClasses('#webhookurl')
  changeWebhookText('Testando Webhook...', 'is-warning')
  $('#webhookurl').addClass('is-warning')
  fetch('/testwebhook', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      authorization: $('#authorization').val(),
      type: Number.parseInt($('#webhook').val()),
      url: $('#webhookurl').val()
    })
  }).then(res => {
    const toAddClass = res.ok ? 'is-success' : 'is-danger'
    let msg
    if (res.ok) {
      msg = 'Webhook enviado com sucesso!'
    } else {
      msg = res.status === 429 ? 'Aguarde um pouco para testar novamente.' : 'Erro ao enviar o Webhook.'
    }
    changeWebhookText(msg, toAddClass)
    $('#webhookurl')
      .removeClass('is-warning')
      .addClass(toAddClass)
  })
}
