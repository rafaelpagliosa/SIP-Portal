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


//função para validar se a mensagem tem palavras improprias
function validaMsg() {
    var verifica0;
    var verifica1;
    var verifica2;
    var verifica3;

    const frase = document.getElementById('msg').value;
    console.log(verifica0 = frase.indexOf("bolsonaro"));
    console.log(verifica1 = frase.indexOf("Bolsonaro"));
    console.log(verifica2 = frase.indexOf("lula"));
    console.log(verifica3 = frase.indexOf("Lula"));

    if (verifica0 >= 0 || verifica1 >= 0 || verifica2 >= 0 || verifica3 >= 0) {
        const frase = document.getElementById('msg').value = '';
        console.log("Palavras Inválidas");
    } else {
        console.log("Ok");
    }

}



//função para salvar as mensagens no banco de dados
function salvar() {
    //recupera os dados do formulario HTML
    var remetente = document.getElementById('remetente').value;
    var curso_remetente = document.getElementById('curso_remetente').value;
    var destinatario = document.getElementById('destinatario').value;
    var curso_destinatario = document.getElementById('curso_destinatario').value;
    var tipo = document.getElementById('tipo').value;
    var status = "pendente";
    var msg = document.getElementById('msg').value;

    //faz uma verificação se todos campos foram preenchidos
    if (remetente != "" && curso_remetente != "" && curso_remetente != "nd" && destinatario != "" && destinatario != "nd" && curso_destinatario != "" && status != "" && msg != "" && tipo != "" && tipo != "nd") {
        firestore.collection("Mensagens").add({
            remetente: document.getElementById('remetente').value,
            curso_remetente: document.getElementById('curso_remetente').value,
            destinatario: document.getElementById('destinatario').value,
            curso_destinatario: document.getElementById('curso_destinatario').value,
            tipo: document.getElementById('tipo').value,
            status: "pendente",
            msg: document.getElementById('msg').value,
            posicao: posicao
        })

        var nameRemetente = document.getElementById('remetente').value;

        //executa a função para saber a hora de exebição
        hora();

        //alert informando o sucesso no cadastro + informando a hora de exebição
        alert("" + "\n" + nameRemetente + " " + "sua mensagem foi salva com sucesso! " + "\n" + "Ela será exibida as " + horasExib + "h" + minutosExib + "⏰" + "\n" + "\n" + "Obrigado");

        //limpa os campos para a proxima mensagens
        document.getElementById('remetente').value = '';
        document.getElementById('curso_remetente').value = 'nd';
        document.getElementById('destinatario').value = '';
        document.getElementById('curso_destinatario').value = 'nd';
        document.getElementById('msg').value = '';
        document.getElementById('tipo').value = 'nd',
            document.getElementById('modal').classList.remove('active');

    }
    //else para caso algum campo não seja preenchido
    else {
        alert("Preencha todos os Campos Obrigatórios");

    }
}



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


//funcoes do formulario modal
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
