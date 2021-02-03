window.showModal = function showModal(id) {
  $('#frame').attr('src', `/bots/${id}?frame=sim`);
  $('#botmodal').addClass('is-clipped').addClass('is-active');
};
