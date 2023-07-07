// Declaración de variables
const clp = document.getElementById("input");
const urlAPI = "https://mindicador.cl/api";
const dolar = "https://mindicador.cl/api/dolar";
const euro = "https://mindicador.cl/api/euro";
const resultado = document.getElementById("resultado");
const moneda = document.getElementById("selector");
const chartDOM = document.getElementById("grafico").getContext("2d");

// Request a la API
async function getMonedas(urlAPI) {
    const endpoint = urlAPI;
    try {
        const res = await fetch(endpoint);
        const monedas = await res.json();
        return monedas;
    } catch (e) {
        alert(e.message);
    }
}

// Función para convertir USD y Euro
async function convertir() {
    if (clp.value == "" || isNaN(clp.value) || clp.value < 0.1)
        alert("Ingrese un monto válido");
    else {
        try {
            const divisas = await getMonedas(urlAPI);

            if (moneda.value == "dolar") {
                resultado.innerHTML = `Resultado: ${new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "USD",
                }).format((clp.value / divisas.dolar.valor).toFixed(2))}`;
                renderGrafica();
            } else if (moneda.value == "euro") {
                resultado.innerHTML = `Resultado: ${new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                }).format((clp.value / divisas.euro.valor).toFixed(2))}`;
                renderGrafica();
            }
        } catch (err) {
            alert("Algo no funciona. Intenta la consulta nuevamente");
            console.log(err.message);
        }
    }
}

// Función para cargar los datos en el gráfico
async function cargarDatos(moneda) {
    const tipoDeGrafica = "line";
    const titulo = "Histórico " + moneda.value.toUpperCase();
    const colorDeLinea = "#" + randomHex(6);

    const divisas = await getMonedas(urlAPI + "/" + moneda.value);

    const fechas = divisas.serie.map((elemento) => elemento.fecha);
    const etiquetas = divisas.serie.map((etiq) => etiq.valor);

    const config = {
        type: tipoDeGrafica,
        data: {
            labels: fechas.reverse().slice(-10),
            datasets: [
                {
                    label: titulo,
                    borderColor: colorDeLinea,
                    backgroundColor: colorDeLinea,
                    data: etiquetas.reverse().slice(-10),
                },
            ],
        },
    };

    // Función para refrescar el gráfico
    if (window.chartDOM) {
        window.chartDOM.destroy();
    }
    window.chartDOM = new Chart(chartDOM, config);
}

async function renderGrafica() {
    await cargarDatos(moneda);
}

// Generar colores de líneas aleatoriamente en cada búsqueda
function randomHex(length) {
    return (
        "0".repeat(length) +
        Math.floor(Math.random() * 16 ** length).toString(16)
    ).slice(-length);
}

//agregar button de reset

var reset = document.getElementById('reset');

reset.addEventListener('click', function () {
    const clp = document.getElementById('input');
    const resultado = document.getElementById('resultado');

    clp.value = '';
    resultado.value = '';
    location.reload();
});
