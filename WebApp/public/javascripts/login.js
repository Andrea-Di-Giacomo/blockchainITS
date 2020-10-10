$('#loginForm').on('submit',function (ev){
    ev.preventDefault();
    $.ajax({
        url: '/users/login',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            email: $("#email").val(),
            password: $("#password").val()
        }),
        contentType: "application/json;charset=UTF-8",
        success: function (data,textStatus,xhr) {
            if (xhr.status === 400) {
                alert("Dati inseriti non validi.");
            }else {
                location.href = "/mainPage";
            }
        },
        error: function (xhr, resp) {
            console.log(xhr);
            console.log(resp);
            if (xhr.status === 400) {
                alert("Dati inseriti non validi.");
            }
            if (xhr.status === 500) {
                alert("Servizio momentaneamente non disponibile")
            }
        }
    });


});
