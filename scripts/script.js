var valorPendentes;
var valorTodas;
var valorOk;


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


//globais


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

function contaTodas() {
    firestore.collection("Tasks").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        console.log(list.length)
        valorTodas = list.length;
        document.getElementById('total').innerHTML = valorTodas;
        console.log("Todas " + valorTodas);
    });
    return valorTodas;
}


function contaPendentes() {
    firestore.collection("Tasks").where("status", "==", "pendente").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        console.log(list.length)
        valorPendentes = list.length;
        document.getElementById('pendentes').innerHTML = valorPendentes;
        console.log("Pendentes " + valorPendentes)
    });
    return valorPendentes;
}

function contaOk() {
    firestore.collection("Tasks").where("status", "==", "resolvido").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        console.log(list.length)
        valorOk = list.length;
        document.getElementById('concluidos').innerHTML = valorOk;
        console.log("Ok " + valorOk)
    });
    return valorOk;
}

function buscar() {
    firestore.collection("Tasks").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        var dataSet = [];
        $.each(list, function (index, data) {
            dataSet.push([data.id, data.status, data.tipo, data.urgencia, data.description]);
        });

        //criação da tabela via javascript
        $('#tb_dados').DataTable({
            data: dataSet,
            paging: false,
            ordering: false,
            info: false,
            bDestroy: true,
            columns: [
                { title: 'Protocolo' },
                { title: 'Status' },
                { title: 'Tipo' },
                { title: 'Urgencia' },
                { title: 'Descrição' },
            ]
        });
    });
}

$(document).ready(function () {
    contaOk();
    contaPendentes();
    contaTodas();
    buscar();
});