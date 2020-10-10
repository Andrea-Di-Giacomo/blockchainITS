$(function () {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get("t")!==null) {
        console.log(urlParams.get('t'))
        send_data(urlParams.get('t'))
    }else{
        location.href="/"
    }
});

function send_data(token) {
    $.ajax({
        url: '/users/confirmation?t='+token,
        type: 'PATCH',
        dataType: 'json',
        contentType: "application/json;charset=UTF-8",
        success: function (response) {
            document.getElementsByClassName("jumbotron")[0].style.display="block";
        },
        error: function (xhr, resp) {
            document.getElementsByClassName("jumbotron")[1].style.display="block";
        }
    });
}
