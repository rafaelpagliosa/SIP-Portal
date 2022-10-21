var valorPendentes;
var valorTodas;
var valorOk;
var map;
var contaLatitude = 0;
var contaLongitude = 0;

//Banco 1 padrao das tasks
var firebaseConfig = {
    apiKey: "AIzaSyDtTxUWqB07R-ZvIA6V6SRvm1vbOuAMS2s",
    authDomain: "authentication-7808c.firebaseapp.com",
    databaseURL: "https:/authentication-7808c-default-rtdb.firebaseio.com/",
    projectId: "authentication-7808c",
    storageBucket: "authentication-7808c.appspot.com",
    messagingSenderId: "1040322467580",
    appId: "1:1040322467580:web:4e19c3a14d5a5b37932979"
};
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore()

//Banco 2 padrao dos usuários
var secondaryAppConfig = {
    apiKey: "AIzaSyDnrnf7XGJ7WIlxdvdhn3AyUMVQBoYIURo",
    authDomain: "authentication-adm.firebaseapp.com",
    projectId: "authentication-adm",
    storageBucket: "authentication-adm.appspot.com",
    messagingSenderId: "131427913576",
    appId: "1:131427913576:web:2c20f8041572173c1810dd"
};
const secondaryApp = firebase.initializeApp(secondaryAppConfig, "secondary");
const data2 = secondaryApp.firestore()

//função para deslogar o usuário
function deslogar() {
    window.location.assign("/PortalSip");
    localStorage.setItem("usuario", "deslogado");
}

/*
    função para validar se o usuário está logado, se o localStorage CACHE estever o usuário o sistema continua em execução,
    caso esteja vazio ou null e sistema se direciona para tela de login
*/
function validaUsuarioLogado() {
    const usuario = localStorage.getItem('usuario');
    if (usuario == null || usuario == "") {
        window.location.assign("/PortalSip");
    } else {
        data2.collection("SuperUser").where("iduser", "==", usuario).onSnapshot((query) => {
            var list = [];
            query.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id });
            });
            const firstElement = list.shift();
            document.getElementById('nomeuser').innerHTML = firstElement.nome;
        });
    }
}

//função que conta todos os chamados realizado que estão registrados na base de dados
function contaTodas() {
    firestore.collection("Tasks").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        valorTodas = list.length;
        document.getElementById('total').innerHTML = valorTodas;
    });
    return valorTodas;
}

//função que conta quantos chamados pendentes estão registrados na base de dados
function contaPendentes() {
    firestore.collection("Tasks").where("status", "==", "pendente").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        valorPendentes = list.length;
        document.getElementById('pendentes').innerHTML = valorPendentes;
    });
    return valorPendentes;
}

//função que conta quantos chamados concluidos estão registrados na base de dados
function contaOk() {
    firestore.collection("Tasks").where("status", "==", "concluido").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        valorOk = list.length;
        document.getElementById('concluidos').innerHTML = valorOk;
    });
    return valorOk;
}

//função que busca todos os registro da base de dados e cria uma tabela dinamicamente
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

/*
    função que utiliza a API de mapa leaflet
    ela buscar somente as localizações no banco de cada relato
    monta um array
    e vai populando o mapa com marcador pelo sua localização
*/
function carregaMapa() {
    map = L.map('mapid').setView([-26.404026, -52.346901], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    firestore.collection("Tasks").where("status", "==", "pendente").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        var dataSet = [];
        $.each(list, function (index, data) {
            dataSet.push(data.local);
        });

        for (var i = 0; i < dataSet.length; i++) {
            var latitudeMap = dataSet[i].origin.latitude;
            var longitudeMap = dataSet[i].origin.longitude;

            L.marker([latitudeMap, longitudeMap]).addTo(map).bindPopup("Solicitação Pendente");
        }
    });
}

//funções que são executadas ao carregar a pagina
$(document).ready(function () {
    validaUsuarioLogado()
    contaOk();
    contaPendentes();
    contaTodas();
    buscar();
    carregaMapa();
});



//altera para o modo escuro da pagina
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







