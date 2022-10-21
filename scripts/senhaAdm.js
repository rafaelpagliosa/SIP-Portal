var posicao;

//configurações de endereço de banco firestore database Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDnrnf7XGJ7WIlxdvdhn3AyUMVQBoYIURo",
    authDomain: "authentication-adm.firebaseapp.com",
    projectId: "authentication-adm",
    storageBucket: "authentication-adm.appspot.com",
    messagingSenderId: "131427913576",
    appId: "1:131427913576:web:2c20f8041572173c1810dd"
};

// inicialização do banco Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore()
const database = firebase.firestore();


function validaCadastro() {
    var codigo = document.getElementById('codigo').value;
    let button = document.querySelector(".button");
    button.disabled = true;

    firestore.collection("SuperUser").doc(codigo).get().then((doc) => {
        if (doc.exists) {
            var dado = doc.data();
            button.disabled = false;
            console.log(dado);

            if (dado.iduser == "pendente") {
                document.getElementById('email').value = dado.email;
                button.disabled = false;
            } else {
                alert("Funcionário já Cadastrado");
                document.getElementById('codigo').value = '';
                button.disabled = true;
            }
        } else {
            console.log("Codigo Invalido");
            document.getElementById('codigo').value = '';
            alert("Codigo inválido")
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function desabilitaBotao() {
    let button = document.querySelector(".button");
    button.disabled = true;
}

$(document).ready(function () {
    desabilitaBotao();
});
