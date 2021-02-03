$(() => {
  const addOwner = $('#addOwner');
  const remOwner = $('#remOwner');
  const owners = $('#owners');
  addOwner.click(() => {
    owners.prepend($("<input class='input owner-input' name='owners' maxlength='18' placeholder='Insira o ID do usuário'>"));
    const childLen = owners.children('.input').length;
    if (childLen === 5) { addOwner.toggleClass('is-hidden'); } else if (childLen === 1) { remOwner.toggleClass('is-hidden'); }
  });
  remOwner.click(() => {
    owners.children('.input').last().remove();
    const childLen = owners.children('.input').length;
    if (!childLen) { remOwner.toggleClass('is-hidden'); } else if (childLen === 4) { addOwner.toggleClass('is-hidden'); }
  });
});

$(document).ready(() => {
  $('#tags').click(function tagClick() {
    const tags = $(this).val();
    if (tags.length >= 6) {
      $('#limite').css('display', 'block');
    } else {
      $('#limite').css('display', 'none');
    }

    if (tags.length > 6) {
      console.log($('option:selected').last().prop('selected', false));
    }
  });
});

/*
function nomeLegal(token) {
  const form = $('#form');
  $.post(
    '/bots/testarwebsoco',
    form.serialize().replace('&g-recaptcha-response=',
    `&g-recaptcha-response=${token}`
    ), (data) => {
    const sim = $('#sim');
    sim.css('display', 'block');
    if (data.sucesso) {
      sim.css('color', 'green');
    } else {
      sim.css('color', 'red');
    }
    sim.text(data.msg);
  });
}
*/

// function isId(st) {
//   return !Number.isNaN(st) && st.length === 18;
// }

// function onSubmit() {
//   $('#form').submit();
// }
