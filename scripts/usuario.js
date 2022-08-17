var valorUsuario;


//modo black
const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
})



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

function contaUsuarios() {
    firestore.collection("Users").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        valorUsuario = list.length;
        document.getElementById('usuarios').innerHTML = valorUsuario;
    });
    return valorTodas;
}


function buscarTotalUser() {
    firestore.collection("Users").orderBy("nome", "asc").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        var dataSet = [];
        $.each(list, function (index, data) {
            dataSet.push([data.nome, data.cpf, data.email, data.contato]);
        });

        //criação da tabela via javascript
        $('#tb_dados').DataTable({
            data: dataSet,
            paging: false,
            ordering: false,
            info: false,
            bDestroy: true,
            columns: [
                { title: 'Nome' },
                { title: 'CPF' },
                { title: 'Email' },
                { title: 'Contato' },
            ]
        });
    });
}


$(document).ready(function () {
    buscarTotalUser();
    contaUsuarios();
});