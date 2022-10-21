function logouAlgumaVez() {
    const usuario = localStorage.getItem('usuario');
    console.log(usuario);
    if (usuario == null) {
        console.log("Sem dados de login anterior");
    }else {
        console.log("Com dados de login anterior");
        
    }
}

$(document).ready(function () {
    logouAlgumaVez();
});