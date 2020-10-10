function check(input) {
    if (input.value != document.getElementById('password').value) {
        input.setCustomValidity('Le password non coincidono');
    } else {
        input.setCustomValidity('');
    }
}
$('#changeForm').on('submit',function (ev){
    ev.preventDefault();
    $.ajax({
        url: '/users/password',
        type: 'PATCH',
        dataType: 'json',
        data: JSON.stringify({
            password_vecchia: $("#password_vecchia").val(),
            password: $("#password").val()
        }),
        contentType: "application/json;charset=UTF-8",
        success: function (data,textStatus,xhr) {
            if(xhr.status===400){
                alert("La password corrente inserita non è valida, reinseriscila.")
            }else {
                alert("Password modificata con successo!");
                location.href="/mainPage";
            }
        },
        error: function (xhr, resp) {
            console.log(xhr);
            console.log(resp);
            if (xhr.status === 400) {
                alert("Il veicolo è gia presente nel sistema.");
            }
            if (xhr.status === 500) {
                alert("Servizio momentaneamente non disponibile")
            }
        }
    });


});

$('#deleteAcc').on("click",function (ev) {
    ev.preventDefault();
    $.ajax({
        url: '/users',
        type: 'DELETE',
        dataType: 'json',
        contentType: "application/json;charset=UTF-8",
        success: function (data,textStatus,xhr) {
                alert("Account eliminato con successo!");
                sessionStorage.clear();
                location.href="/";
        },
        error: function (xhr, resp) {
            if (xhr.status === 500) {
                alert("Servizio momentaneamente non disponibile")
            }
        }
    });
});
