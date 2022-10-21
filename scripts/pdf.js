
function novoPdf() {
    var generateData = function (amount) {
        var result = [];
        var data = {
            protocolo: "100",
            status: "GameGroup",
            tipo: "XPTO2",
            descricao: "25",
            data: "20485861",
        };
        for (var i = 0; i < amount; i += 1) {
            data.id = (i + 1).toString();
            result.push(Object.assign({}, data));
        }
        return result;
    };

    function createHeaders(keys) {
        var result = [];
        for (var i = 0; i < keys.length; i += 1) {
            result.push({
                id: keys[i],
                name: keys[i],
                prompt: keys[i],
                width: 65,
                align: "center",
                padding: 0
            });
        }
        return result;
    }

    var headers = createHeaders([
        "id",
        "Protocolo",
        "Status",
        "Tipo",
        "Descrição",
        "data",
    ]);

    
    var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
    doc.addImage("/../PortalSip/Images/icon.png", "JPEG", 15, 40, 180, 180);
    doc.table(1, 1, generateData(100), headers, { autoSize: true });

    console.log("CLicou")
    doc.save('a4.pdf')
}
