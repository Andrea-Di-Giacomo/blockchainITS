function check(input) {
    if (input.value != document.getElementById('psw').value) {
        input.setCustomValidity('Le password non coincidono');
    } else {
        input.setCustomValidity('');
    }
}
$('#regForm').on('submit',function (ev){
    ev.preventDefault();
    $.ajax({
        url: '/users/signup',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            nome: $("#nome").val(),
            cognome: $("#cognome").val(),
            psw: $("#psw").val(),
            email: $("#email").val()
        }),
        contentType: "application/json;charset=UTF-8",
        success: function (response) {
            showJumbo($("#email").val())
        },
        error: function (xhr, resp) {
            console.log(xhr);
            console.log(resp);
            if (xhr.status === 400) {
                alert("Email già in uso");
            }
            if (xhr.status === 500) {
                alert("Servizio momentaneamente non disponibile")
            }else{
                alert("I campi non sono inseriti correttamente")
            }
        }
    });


});
function showJumbo(mail) {
    document.getElementsByClassName("jumbotron")[0].style.display="block";
    document.getElementById("emailSpan").innerHTML=mail;
    document.getElementsByClassName("container")[0].style.display="none";
}

