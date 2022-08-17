//configurações de endereço de banco firestore database Firebase
var firebaseConfig = {
    apiKey: "AIzaSyDtTxUWqB07R-ZvIA6V6SRvm1vbOuAMS2s",
    authDomain: "authentication-7808c.firebaseapp.com",
    databaseURL: "https:/authentication-7808c-default-rtdb.firebaseio.com/",
    projectId: "authentication-7808c",
    storageBucket: "authentication-7808c.appspot.com",
    messagingSenderId: "1040322467580",
    appId: "1:1040322467580:web:4e19c3a14d5a5b37932979"
};

// inicialização do banco Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore()
const database = firebase.firestore();


function validaUsuarioLogado() {
    const usuario = localStorage.getItem('usuario');
    console.log(usuario);

    if (usuario == null || usuario == "") {
        window.location.assign("/PortalSip");
    } else {
        //document.getElementById('iduser').innerHTML = usuario;
        firestore.collection("SuperUser").where("iduser", "==", usuario).onSnapshot((query) => {
            var list = [];
            query.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id });
            });
            const firstElement = list.shift();
            document.getElementById('nomeuser').innerHTML = firstElement.nome;
            //document.getElementById('areauser').innerHTML = firstElement.area;
            console.log(list)
        });
    }
}

$(document).ready(function () {
    validaUsuarioLogado();
});