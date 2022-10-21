var valorUsuario;
var valorTodas;
var posicao;






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
    console.log(usuario);
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
    data2.collection("SuperUser").onSnapshot((query) => {
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
    data2.collection("SuperUser").orderBy("posicao", "desc").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        var dataSet = [];
        $.each(list, function (index, data) {
            dataSet.push([data.posicao, data.id, data.nome, data.area, data.email, data.contato, data.iduser]);
        });

        //criação da tabela via javascript
        $('#tb_dados').DataTable({
            data: dataSet,
            paging: false,
            ordering: false,
            info: false,
            bDestroy: true,
            columns: [
                { title: 'Nº' },
                { title: 'Id' },
                { title: 'Nome' },
                { title: 'area' },
                { title: 'Email' },
                { title: 'Contato' },
                { title: 'Id User' },
            ]
        });
    });
}

function validaPosicaoProxLivre() {
    data2.collection("SuperUser").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        console.log(list.length)
        //posição recebe o tamanho do banco de dados (quantidade) e incrementa + 1 para ser a proxima posição a ser cadastrada
        posicao = list.length + 1;
    });
    return posicao;
}

function salvar() {
    validaPosicaoProxLivre();
    data2.collection("SuperUser").add({
        nome: document.getElementById('nome').value,
        area: document.getElementById('area').value,
        cpf: document.getElementById('cpf').value,
        contato: document.getElementById('contato').value,
        endereco: document.getElementById('endereco').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        email: document.getElementById('email').value,
        posicao: posicao,
        iduser: "pendente"
    }).then(() => {
        console.log("Document successfully written!");
        document.getElementById('modal').classList.remove('active');
        alert(codigo)
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });
}

function validaCPF() {
    if (valida_cpf(document.getElementById('cpf').value)) {
        document.getElementById('cpf').style.borderColor = 'green';
        limpaCpf();
    } else {
        document.getElementById('cpf').style.borderColor = 'red';
        document.getElementById('cpf').value = ''; // Limpa o campo
        document.getElementById('cpf').placeholder = "CPF Inválido. Digite Novamente";
    }
}

function valida_cpf(cpfinput) {
    var cpf1 = document.querySelector("#cpf");
    var value = cpf1.value;
    var validageral = value.replace(/[^0-9]/g, '');
    var cpfinput = value.replace(/[^0-9,]*/g, '').replace(',', '.');

    if (validageral < 11) {
        document.getElementById('cpf').style.borderColor = 'red';
        document.getElementById('cpf').value = ''; // Limpa o campo
        document.getElementById('cpf').placeholder = "CPF Inválido. Digite Novamente";
    } else {
        var numeros, digitos, soma, i, resultado, digitos_iguais;
        digitos_iguais = 1;
        if (cpfinput.length < 11)
            return false;
        for (i = 0; i < cpfinput.length - 1; i++)
            if (cpfinput.charAt(i) != cpfinput.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        if (!digitos_iguais) {
            numeros = cpfinput.substring(0, 9);
            digitos = cpfinput.substring(9);
            soma = 0;
            for (i = 10; i > 1; i--)
                soma += numeros.charAt(10 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
                return false;
            numeros = cpfinput.substring(0, 10);
            soma = 0;
            for (i = 11; i > 1; i--)
                soma += numeros.charAt(11 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
                return false;
            return true;
        } else
            return false;
    }
}

function deslogar() {
    window.location.assign("/PortalSip");
    localStorage.setItem("usuario", "deslogado");
}

function buscaCep() {
    let cep = $("#cep").val().replace("-", "");
    console.log(cep);
    if (cep.length == 8) {
        $.ajax(
            {
                url: "https://webservice.sigacred.com.br/api/cep/" + cep + "",
                dataType: "json",
                type: "GET",
                crossDomain: true,
            }
        ).done(function (endereco, statusText, xhr) {
            let status = xhr.status;
            console.log('httpCode: ' + status);
            if (!endereco.erro) {
                $("label[for=cepres]").html("CEP:");
                console.log('Sucesso da Chamada');
                $("#bairro").val(endereco.bairro);
                $("#endereco").val(endereco.logradouro);
                $("#cidade").val(endereco.localidade);
            } else {
                document.getElementById('cep').placeholder = "CPF Inválido. Digite Novamente";
                $("#bairro").val("");
                $("#endereco").val("");
                $("#cidade").val("");
            }
        });
    }
}
$("#cep").keyup(function () {
    buscaCep();
});


//Eventos e ações javascript para o modal de cadastro de mensagens
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('remetente').dataset.index = 'new'
}
'use strict'
const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

function fechaModal() {
    document.getElementById('modal').classList.remove('active');
}
document.getElementById('cadastrarCliente').addEventListener('click', openModal)
document.getElementById('cancelar').addEventListener('click', closeModal)


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