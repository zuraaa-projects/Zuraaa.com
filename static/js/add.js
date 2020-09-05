$(function() {
    var addOwner = $("#addOwner");
    var remOwner = $("#remOwner");
    var owners = $("#owners");
    addOwner.click(function() {
        owners.prepend($("<input class='input owner-input' name='owners' maxlength='18' placeholder='Insira o ID do usuário'>"));
        var childLen = owners.children(".input").length;
        if (childLen == 5)
            addOwner.toggleClass("is-hidden");
        else if (childLen == 1)
            remOwner.toggleClass("is-hidden");
    });
    remOwner.click(function() {
        owners.children(".input").last().remove();
        var childLen = owners.children(".input").length;
        if (!childLen)
            remOwner.toggleClass("is-hidden");
        else if (childLen == 4)
            addOwner.toggleClass("is-hidden");
    });
    

    $("#form").submit(function(event) {
        var error;
        var id = $("#id");
        if (!isId(id.val()))
            error = id;
        else {
            for (owner of $(".owner-input")) {
                if (!isId(owner.value)) {
                    error = $(owner);
                    break;
                }
            };
            if (!error) {
                var lib = $("#library");
                if (!lib.val())
                    error = lib;
                else {
                    var prefix = $("#prefix");
                    if (!prefix.val())
                        error = prefix;
                    else {
                        var shortdesc = $("#shortdesc");
                        if (!shortdesc.val())
                            error = shortdesc;
                        else {
                            var tags = $("#tags");
                            var len = tags.val().length;
                            if (!len || len > 6)
                                error = tags;
                        }
                    }
                }
            }
        }
        if (error) {
            error.focus();
            $("#addtitle").get(0).scrollIntoView();
            error.addClass("is-danger");
            setTimeout(function(){error.removeClass("is-danger")}, 2000)
            event.preventDefault();
        }
    });
});

function isId(st) {
    return !isNaN(st) && st.length == 18
}

function onSubmit(token) {
    $("#form").submit();
}