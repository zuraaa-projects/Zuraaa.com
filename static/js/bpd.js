window.avatarUrl = function avatarUrl (user) {
  if (user.buffer) { return user.buffer }
  const { avatar } = user
  if (!avatar) { return 'https://cdn.discordapp.com/embed/avatars/4.png' }
  return `https://cdn.discordapp.com/avatars/${user.id}/${avatar}${avatar.startsWith('a_') ? '.gif' : '.webp?size=1024'}`
}

$.get('/userdata', (user) => {
  $(() => {
    const navuser = $('#navuser')
    if (user) {
      $('#navavatar').prop('src', window.avatarUrl(user))
      $('#navusername').text(user.username)
      $('#navprofile').prop('href', `/user/${user.id}`)
      if (user.role) {
        const divider = $('#divider')
        if (user.role > 0) { divider.before($("<a class='navbar-item' href='/staff/bots'>Bots</a>")) }
        if (user.role > 1) { divider.before($("<a class='navbar-item' href='/staff/edit'>Editar staff</a>")) }
      }
    } else {
      navuser.empty()
      navuser.append($('<a class="navbar-item" href="/oauth2/login">Login</a>'))
    }
    navuser.removeClass('is-invisible')
  })
})

$(() => {
  $('.navbar-on').each((index, item) => {
    if (window.location.href.replace('#', '') === item.href) { item.classList += ' is-active' }
  })
  const navbar = $('.navbar')
  const initialNavbarBG = navbar.css('background')
  const initialNavbarBS = navbar.css('box-shadow')
  let transparentNavbar = false

  console.log(transparentNavbar)
  console.log(initialNavbarBS)
  console.log(initialNavbarBG)

  if (window.scrollY > 18) {
    navbar.css('background', 'rgba(0, 0, 0, 0.6)')
    navbar.css('box-shadow', '0 4px #710f4b')
    transparentNavbar = true
  }

  $(window).scroll(() => {
    console.log(window.scrollY)
    if (window.scrollY > 18) {
      if (!transparentNavbar) {
        navbar.css('background', 'rgba(0, 0, 0, 0.6)')
        navbar.css('boxShadow', '0 4px #710f4b')
        transparentNavbar = true
      }
    } else if (transparentNavbar) {
      navbar.css('background', initialNavbarBG)
      navbar.css('boxShadow', initialNavbarBS)
      transparentNavbar = false
    }
  })

  const navbarBurger = $('.navbar-burger')
  const navbarMenu = $('.navbar-menu')

  navbarBurger.click(() => {
    navbarBurger.toggleClass('is-active')
    navbarMenu.toggleClass('is-active')
  })

  const navbarSearch = $('#navbar-search')
  const searchButton = $('#search-button')
  const navbarClose = $('#search-close')
  const navbarMid = $('#navbar-mid')
  const mobile = window.screen.width < 1024;
  [navbarClose, searchButton].forEach((el) => {
    el.click(() => {
      if (navbarMid.css('display') === 'none') {
        if (!mobile) { navbarMid.css('display', 'flex') }

        navbarSearch.css('display', 'none')
      } else {
        if (!mobile) { navbarMid.css('display', 'none') }

        navbarSearch.css('display', 'flex')
      }
    })
  })
})
