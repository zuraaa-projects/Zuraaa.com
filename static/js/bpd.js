$.get('/userdata', (user) => {
  $(() => {
    const navuser = $('#navuser');
    if (user) {
      $('#navavatar').prop('src', `/avatars/${user._id}`);
      $('#navusername').text(user.username);
      $('#navprofile').prop('href', `/user/${user._id}`);
      if (user.details.role) {
        const divider = $('#divider');
        if (user.details.role > 0) { divider.before($("<a class='navbar-item' href='/staff/bots'>Bots</a>")); }
        if (user.details.role > 1) { divider.before($("<a class='navbar-item' href='/staff/edit'>Editar staff</a>")); }
      }
    } else {
      navuser.empty();
      navuser.append($('<a class="navbar-item" href="/oauth2/login">Login</a>'));
    }
    navuser.removeClass('is-invisible');
  });
});

$(() => {
  $('.navbar-on').each((index, item) => {
    if (window.location.href.replace('#', '') === item.href) { item.classList += ' is-active'; }
  });
  const navbar = $('.navbar');
  const initialNavbarBG = navbar.css('background');
  const initialNavbarBS = navbar.css('boxShadow');
  let transparentNavbar = initialNavbarBG === 'transparent';

  if (window.scrollY > 18) {
    navbar.css('background', 'rgba(0, 0, 0, 0.6)');
    navbar.css('boxShadow', '0 4px #710f4b');
    transparentNavbar = false;
  }

  $(window).scroll(() => {
    if (window.scrollY > 18) {
      if (transparentNavbar) {
        navbar.css('background', 'rgba(0, 0, 0, 0.6)');
        navbar.css('boxShadow', '0 4px #710f4b');
        transparentNavbar = false;
      }
    } else if (!transparentNavbar) {
      navbar.css('background', initialNavbarBG);
      navbar.css('boxShadow', initialNavbarBS);
      transparentNavbar = true;
    }
  });

  const navbarBurger = $('.navbar-burger');
  const navbarMenu = $('.navbar-menu');

  navbarBurger.click(() => {
    navbarBurger.toggleClass('is-active');
    navbarMenu.toggleClass('is-active');
  });

  const navbarSearch = $('#navbar-search');
  const searchButton = $('#search-button');
  const navbarClose = $('#search-close');
  const navbarMid = $('#navbar-mid');
  const mobile = window.screen.width < 1024;
  [navbarClose, searchButton].forEach((el) => {
    el.click(() => {
      if (navbarMid.css('display') === 'none') {
        if (!mobile) { navbarMid.css('display', 'flex'); }

        navbarSearch.css('display', 'none');
      } else {
        if (!mobile) { navbarMid.css('display', 'none'); }

        navbarSearch.css('display', 'flex');
      }
    });
  });
});
