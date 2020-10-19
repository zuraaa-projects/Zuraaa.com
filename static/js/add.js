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
});

function isId(st) {
    return !isNaN(st) && st.length == 18
}

function onSubmit(token) {
    $("#form").submit();
}