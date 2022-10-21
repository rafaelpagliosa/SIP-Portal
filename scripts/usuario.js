var valorUsuario;
var atual = null;
var idAtual = null;
var firstElement = null;

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


function validaUsuarioLogado() {
    const usuario = localStorage.getItem('usuario');
    //console.log(usuario);
    if (usuario == null || usuario == "") {
        window.location.assign("/PortalSip");
    } else {
        //document.getElementById('iduser').innerHTML = usuario;
        data2.collection("SuperUser").where("iduser", "==", usuario).onSnapshot((query) => {
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

function contaUsuarios() {
    firestore.collection("Users").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        valorUsuario = list.length;
        document.getElementById('usuarios').innerHTML = valorUsuario;
    });
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

        var conta2 = 1;
        //criação da tabela via javascript
        $('#tb_dados').DataTable({
            data: dataSet,
            paging: false,
            ordering: false,
            info: false,
            rowId: conta2,
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

function deslogar() {
    window.location.assign("/PortalSip");
    localStorage.setItem("usuario", "deslogado");
}

function fechaModal() {
    document.getElementById('modal').style.display = 'none';
}

$(document).ready(function () {
    $('#tb_dados').click(function (e) {
        function mouseEventHandler(mEvent) {
            var ultimo = atual;
            // Internet Explorer || Demais navegadores
            atual = mEvent.srcElement || mEvent.target;

            if (ultimo !== atual) {
                idAtual = atual.parentNode.id;

                firestore.collection("Users").where("cpf", "==", idAtual).onSnapshot((query) => {
                    var list = [];
                    query.forEach((doc) => {
                        list.push({ ...doc.data(), id: doc.id });
                    });
                    const firstElement = list.shift();
                    document.getElementById('textID').innerHTML = firstElement.id;
                    //document.getElementById('textUID').innerHTML = firstElement.uid;
                    document.getElementById('textNome').innerHTML = firstElement.nome;
                    //document.getElementById('textCPF').innerHTML = firstElement.cpf;
                    document.getElementById('textEmail').innerHTML = firstElement.email;
                    document.getElementById('textContato').innerHTML = firstElement.contato;

                    firestore.collection("Tasks")
                        .where("user", "==", firstElement.uid).onSnapshot((query) => {
                            var list = [];
                            query.forEach((doc) => {
                                list.push({ ...doc.data(), id: doc.id });
                            });
                            console.log(list);
                            const first = list.length;

                            if (first != null) {
                                document.getElementById('textQtda').innerHTML = first;
                            } else {
                                document.getElementById('textQtda').innerHTML = "0";
                            }
                        });
                    document.getElementById('textQtda').innerHTML = "0";
                });
                document.getElementById('modal').style.display = 'block';
            }
        }
        document.body.onclick = mouseEventHandler;
    });
});

$(document).ready(function () {
    validaUsuarioLogado();
    buscarTotalUser();
    contaUsuarios();
});

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









