//variaveis globais
var valorTodas = 0;
var valorOk;
var valorPendentes;
var valortrote;
var valorOk;
var map;


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
        });
    }
}

function deslogar() {
    window.location.assign("/PortalSip");
    localStorage.setItem("usuario", "deslogado");
}

function contaConcluidas() {
    firestore.collection("Tasks").where("status", "==", "concluido").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        valorOk = list.length;
    });
    return valorOk;
}

function contaPendentes() {
    firestore.collection("Tasks").where("status", "==", "pendente").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        valorPendentes = list.length;
    });
    return valorPendentes;
}

function contaTrote() {
    firestore.collection("Tasks").where("status", "==", "trote").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        valortrote = list.length;
        document.getElementById('trotes').innerHTML = valortrote;

        var conta = (valortrote * 100) / valorTodas;
        console.log("Conta", conta);

        teste = conta.toString()

        stringExemplo = teste;
        resultado = stringExemplo.substring(0, 2);


        var b = '%';
        resultado = resultado.concat(b);

        document.getElementById('trotes').innerHTML = resultado;

        document.getElementById('progress').setAttribute("style", "width:" + resultado);
    });
    return valortrote;
}

function contaTodas() {
    firestore.collection("Tasks").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        valorTodas = list.length;
        document.getElementById('todas').innerHTML = valorTodas;
    });
    return valorTodas;
}

function contaUsuarios() {
    firestore.collection("Users").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        var valorUsuario = list.length;
        //console.log(valorUsuario);
        document.getElementById('usuarios').innerHTML = valorUsuario;
    });
}

function contaSuperUsuarios() {
    data2.collection("SuperUser").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        valorSuperUsuario = list.length;
        document.getElementById('superUser').innerHTML = valorSuperUsuario;
    });
}

function graficoPizza() {
    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';

    //console.log(valorOk + "." + valorPendentes + "." + valortrote);

    // Pie Chart Example
    var ctx = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Concluidos", "Pendentes", "Trote"],
            datasets: [{
                data: [valorOk, valorPendentes, valortrote],
                backgroundColor: ['#0E4BF1', '#FEF401', '#D80C0C'],
                hoverBackgroundColor: ['#2BC90C', '#C0F10D', '#DD2F03'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },
    });

}

function contaChamadosData() {
    var jan = 0, fev = 0, mar = 0, abr = 0, mai = 0, jun = 0, jul = 0, ago = 0, set = 0, out = 0, nov = 0, dez = 0;
    // Set new default font family and font color to mimic Bootstrap's default styling
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';

    function number_format(number, decimals, dec_point, thousands_sep) {
        // *     example: number_format(1234.56, 2, ',', ' ');
        // *     return: '1 234,56'
        number = (number + '').replace(',', '').replace(' ', '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    firestore.collection("Tasks").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });

        tmn = list.length;

        for (i = 0; i < tmn; i++) {
            var unixTimestamp = list[i].hora;
            var date = new Date(unixTimestamp * 1000);
            var mes = date.getMonth() + 1
            //console.log("Date: " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear());
            //console.log("mes: " + mes)

            if (mes == 1) {
                jan = jan + 1;
            } else if (mes == 2) {
                fev = fev + 1;
            } else if (mes == 3) {
                mar = mar + 1;
            } else if (mes == 4) {
                abr = abr + 1;
            } else if (mes == 5) {
                mai = mai + 1;
            } else if (mes == 6) {
                jun = jun + 1;
            } else if (mes == 7) {
                jul = jul + 1;
            } else if (mes == 8) {
                ago = ago + 1;
            } else if (mes == 9) {
                set = set + 1;
            } else if (mes == 10) {
                out = out + 1;
            } else if (mes == 11) {
                nov = nov + 1;
            } else if (mes == 10) {
                dez = dez + 1;
            } else {
                console.log("Erro")
            }

            //console.log(jan, fev, mar, abr, mai, jun, jul, ago, set, out, nov, dez)
        }

        var ctx = document.getElementById("myAreaChart");
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                datasets: [{
                    label: "Relatos",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: [jan, fev, mar, abr, mai, jun, jul, ago, set, out, nov, dez],
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'date'
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return '' + number_format(value);
                            }
                        },
                        gridLines: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }],
                },
                legend: {
                    display: false
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                    callbacks: {
                        label: function (tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
                        }
                    }
                }
            }
        });
    });
}

function contaUrgencia() {
    firestore.collection("Tasks").where("status", "==", "pendente").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        valorPendentes = list.length;

        tmn = list.length;
        var baixa = 0, media = 0, urgente = 0;

        for (i = 0; i < tmn; i++) {
            if (list[i].urgencia == "urgente" || list[i].urgencia == "Urgente") {
                urgente = urgente + 1;
            } else if (list[i].urgencia == "media" || list[i].urgencia == "Média") {
                media = media + 1;
            } else if (list[i].urgencia == "baixa" || list[i].urgencia == "Baixa") {
                baixa = baixa + 1;
            } else {
                console.log("erro")
            }
        }
        console.log(valorPendentes)

        var contaUrgente = (urgente * 100) / valorPendentes;
        var contaMedia = (media * 100) / valorPendentes;
        var contaBaixa = (baixa * 100) / valorPendentes;
        console.log("Urgente", contaUrgente, "Media", contaMedia, "Baixa", contaBaixa);

        urg = contaUrgente.toString();
        med = contaMedia.toString();
        bai = contaBaixa.toString()

        urgOk = urg.substring(0, 4);
        medOk = med.substring(0, 4);
        baiOk = bai.substring(0, 4);

        var b = '%';

        resulUrg = urgOk.concat(b);
        resulMed = medOk.concat(b);
        resulBai = baiOk.concat(b);


        console.log("Urg", resulUrg, "Med", resulMed, "Bai", resulBai)

        document.getElementById('progressUrgente').setAttribute("style", "width:" + resulUrg);
        document.getElementById('urgente').innerHTML = resulUrg;
        document.getElementById('progressMedia').setAttribute("style", "width:" + resulMed);
        document.getElementById('media').innerHTML = resulMed;
        document.getElementById('progressBaixa').setAttribute("style", "width:" + resulBai);
        document.getElementById('baixa').innerHTML = resulBai;


        console.log("Urgente", urgente, "Media", media, "baixa", baixa)
    });
    return valorPendentes;
}

function contaLocalProblematico() {
    firestore.collection("Tasks").onSnapshot((query) => {
        var list = [];
        query.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
        });
        var dataSet = [];
        $.each(list, function (index, data) {
            dataSet.push(data.local);
        });


        var contaLat = 0;
        var contaLong = 0;

        for (var i = 0; i < dataSet.length; i++) {
            var latitudeMap = dataSet[i].origin.latitude;
            var longitudeMap = dataSet[i].origin.longitude;

            contaLat = contaLat + latitudeMap;
            contaLong = contaLong + longitudeMap;
        }

        var contaLatitude = 0;
        var contaLongitude = 0;

        contaLatitude = contaLat / dataSet.length;
        contaLongitude = contaLong / dataSet.length;

        map = L.map('mapid2').setView([contaLatitude, contaLongitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        var circle = L.circle([contaLatitude, contaLongitude], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 900
        }).addTo(map);


    });
}

$(document).ready(function () {
    validaUsuarioLogado();
    contaTodas();
    contaPendentes();
    contaConcluidas();
    contaTrote();
    contaChamadosData();
    contaUsuarios();
    contaSuperUsuarios()
    contaUrgencia();
    contaLocalProblematico();

    setTimeout(() => {
        graficoPizza();
    }, 3000);
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