window.onSubmit = function onSubmit () {
  $('#form').submit()
}
$(function () {
  $('#file').change(function () {
    const files = this.files
    if (files.length > 5) {
      this.value = ''
      $('#file').change()
    } else {
      if (files.length) {
        $('#name').text(`${files.length} arquivo(s) selecionados.`)
      } else {
        $('#name').text('Nenhum arquivo selecionado.')
      }
    }
  })
})
