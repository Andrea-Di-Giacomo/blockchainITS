function logged(sessione) {
    if (sessione !== "") {
        document.getElementById("searchCar").style.display = "block";
        document.getElementById("annunci").style.display = "block";
        document.getElementById("userPanel").style.display = "block";
        document.getElementById("login").style.display = "none";
        document.getElementById("signup").style.display = "none";
        document.getElementById("logout").style.display = "block";
        document.getElementById("home").href = "/mainPage";
        document.getElementById("brand").href = "/mainPage"
    }
}
