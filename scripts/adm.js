//variaveis globais
var valorPendentes;
var valorTodas;
var valorOk;
var i = 0;
var data = new Date();
var dia = String(data.getDate()).padStart(2, '0');
var mes = String(data.getMonth() + 1).padStart(2, '0');
var ano = data.getFullYear();
var dataAtual = dia + '/' + mes + '/' + ano;
var atual = null;
var idAtual = null;
var longitude = null;
var latitude = null;

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
const firestore = firebase.firestore();
const storage = firebase.storage();


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
    console.log(usuario);
    if (usuario == null || usuario == "" || usuario == "deslogado") {
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

function buscar() {
    firestore.collection("Tasks").where("status", "==", "pendente").onSnapshot((query) => {
        var list = [];
        var conta = 1;
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        var dataSet = [];
        $.each(list, function (index, data) {
            dataSet.push([conta, data.id, data.status, data.tipo, data.urgencia]);
            conta++;
        });
        console.log(list)

        var conta2 = 1;
        //criação da tabela via javascript
        $('#tb_dados').DataTable({
            data: dataSet,
            rowId: conta2,
            paging: false,
            ordering: false,
            info: false,
            bDestroy: true,
            columns: [
                { title: ' Nº ' },
                { title: 'Protocolo', className: 'protocolo', name: "protocolo" },
                { title: 'Status', className: 'status' },
                { title: 'Tipo', className: 'tipo' },
                { title: 'Urgencia', className: 'urgencia' },
            ]
        })
    });
}

$(document).ready(function () {
    $('#tb_dados').click(function (e) {
        function mouseEventHandler(mEvent) {
            var ultimo = atual;
            // Internet Explorer || Demais navegadores
            atual = mEvent.srcElement || mEvent.target;

            if (ultimo !== atual) {
                //console.log('id do elemento atual:', atual.parentNode.id);
                idAtual = atual.parentNode.id;

                firestore.collection("Tasks").doc(idAtual).get().then((doc) => {
                    if (doc.exists) {
                        var dado = doc.data();
                        console.log(dado);
                        console.log(dado.local.origin.longitude);
                        console.log(dado.local.origin.latitude);

                        longitude = dado.local.origin.longitude;
                        latitude = dado.local.origin.latitude;

                        //document.getElementById("map").src = `https://www.google.com/maps/embed?pb=(${latitude},${longitude})`;
                        document.getElementById("map").src = `https://maps.google.com.br/maps?q=(${latitude},${longitude})&output=embed&dg=oo`

                        document.getElementById('textData').innerHTML = dado.data;
                        document.getElementById('textProtocolo').innerHTML = idAtual;
                        document.getElementById('textStatus').innerHTML = dado.status;
                        document.getElementById('textTipo').innerHTML = dado.tipo;
                        document.getElementById('textUrgencia').innerHTML = dado.urgencia;
                        document.getElementById('textDescricao').innerHTML = dado.description;


                        storage.ref(dado.image).getDownloadURL().then((url) => {
                            console.log(url);
                            document.getElementById("image").src = url;
                        })


                    } else {

                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
                document.getElementById('modal').style.display = 'block';
            }
        }
        document.body.onclick = mouseEventHandler;
    });
});

function fechaModal() {
    document.getElementById('modal').style.display = 'none';
}

function statusConcluida() {
    firestore.collection("Tasks").doc(idAtual).update({
        status: 'concluido',
        uidfunc: localStorage.getItem('usuario'),
        databaixa: dataAtual,
    })
    console.log("Dado baixa")
    //recaregar a pagina
    document.getElementById('modal').style.display = 'none';
    idAtual = null;
}

function statusTrote() {
    firestore.collection("Tasks").doc(idAtual).update({
        status: 'trote',
        uidfunc: localStorage.getItem('usuario'),
        databaixa: dataAtual,
    })
    console.log("Dado baixa")
    //recaregar a pagina
    document.getElementById('modal').style.display = 'none';
    idAtual = null;
}

function deslogar() {
    window.location.assign("/PortalSip");
    localStorage.setItem("usuario", "deslogado");
}

$(document).ready(function () {
    validaUsuarioLogado();
    contaPendentes();
    buscar();
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