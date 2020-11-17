window.avatarUrl = function(user) {
    if (user.buffer)
        return user.buffer;
    var avatar = user.avatar;
    if (!avatar)
        return "https://cdn.discordapp.com/embed/avatars/4.png";
    return "https://cdn.discordapp.com/avatars/" + user.id + "/" + avatar + (avatar.startsWith("a_") ? ".gif" : ".webp?size=1024");
    
};

$.get("/userdata", function(user) {
    $(function() {
        var navuser = $("#navuser");
        if (user) {
            $("#navavatar").prop("src", avatarUrl(user));
            $("#navusername").text(user.username);
            $("#navprofile").prop("href", "/user/" + user.id);
            if (user.role) {
                var divider = $("#divider");
                if (user.role > 0)
                    divider.before($("<a class='navbar-item' href='/staff/bots'>Bots</a>"));
                if (user.role > 1)
                    divider.before($("<a class='navbar-item' href='/staff/edit'>Editar staff</a>"));

            }
        }
        else
        {
            navuser.empty();
            navuser.append($('<a class="navbar-item" href="/oauth2/login">Login</a>'));
        }
        navuser.removeClass("is-invisible");
    });
});

$(function() {
    $(".navbar-on").each(function (index, item) {
        if (location.href.replace("#", "") == item.href)
            item.classList += " is-active"
    })
    var navbar = $(".navbar");
    var initialNavbarBG = navbar.css("background");
    var initialNavbarBS = navbar.css("boxShadow");
    var transparentNavbar = initialNavbarBG === 'transparent';

    if (window.scrollY > 18) {
        navbar.css("background", "rgba(0, 0, 0, 0.6)");
        navbar.css("boxShadow", "0 4px #710f4b");
        transparentNavbar = false;
    }

    $(window).scroll(function() {
        if (window.scrollY > 18) {
            if (transparentNavbar) {
                navbar.css("background", "rgba(0, 0, 0, 0.6)");
                navbar.css("boxShadow", "0 4px #710f4b");
                transparentNavbar = false;
            }
        } else if (!transparentNavbar) {
            navbar.css("background", initialNavbarBG);
            navbar.css("boxShadow", initialNavbarBS);
            transparentNavbar = true;
        }
    });


    var navbarBurger = $(".navbar-burger");
    var navbarMenu = $(".navbar-menu");

    navbarBurger.click(function () {
        navbarBurger.toggleClass('is-active');
        navbarMenu.toggleClass('is-active');
    });


    var navbarSearch = $('#navbar-search');
    var searchButton = $('#search-button');
    var navbarClose = $('#search-close');
    var navbarMid = $('#navbar-mid');
    var mobile = screen.width < 1024;
    [navbarClose, searchButton].forEach(function(el) {
        el.click(function() {
            if (navbarMid.css("display") === "none") {
                if (!mobile)
                    navbarMid.css("display", "flex");
                
                navbarSearch.css("display", "none");
            } else {
                if (!mobile)
                    navbarMid.css("display", "none");
    
                navbarSearch.css("display", "flex");
            }
        });
    });
});