// Declaración de variables
const input = document.getElementById("input");
const selector = document.getElementById("selector");
const resultado = document.getElementById("resultado");
const urlApi = "https://mindicador.cl/api";
const dolar = "https://mindicador.cl/api/dolar";
const euro = "https://mindicador.cl/api/euro";

const chart = document.getElementById("grafico").getContext("2d");
let chartInstance;

// Request a la API
async function getMonedas(urlApi) {
    const endpoint = urlApi;
    try {
        const res = await fetch(endpoint);
        const monedas = await res.json();
        return monedas;
    } catch (e) {
        throw new Error("Error al obtener los datos de la API");
    }
}

// Función para convertir USD y euro
async function convertir() {
    if (input.value === "" || isNaN(input.value) || input.value < 0.1) {
        alert("Ingrese un monto válido");
    } else {
        try {
            const divisas = await getMonedas(urlApi);

            if (selector.value === "dolar") {
                resultado.innerHTML = `Resultado: ${new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "USD",
                }).format((input.value / divisas.dolar.valor).toFixed(2))}`;
                renderGrafica();
            } else if (selector.value === "euro") {
                resultado.innerHTML = `Resultado: ${new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                }).format((input.value / divisas.euro.valor).toFixed(2))}`;
                renderGrafica();
            }
        } catch (err) {
            alert("Algo no funciona. Intenta la consulta nuevamente");
            console.log(err.message);
        }
    }
}

// Función para cargar los datos en el gráfico
async function cargarDatos(selector) {
    const tipoDeGrafica = "line";
    const titulo = "Histórico " + selector.value.toUpperCase();
    const colorDeLinea = "#" + randomHex(6);

    try {
        const divisas = await getMonedas(urlApi + "/" + selector.value);

        const fechas = divisas.serie.map((elemento) => elemento.fecha);
        const etiquetas = divisas.serie.map((etiq) => etiq.valor);

        const config = {
            type: tipoDeGrafica,
            data: {
                labels: fechas.slice(-10).reverse(),
                datasets: [
                    {
                        label: titulo,
                        borderColor: colorDeLinea,
                        backgroundColor: colorDeLinea,
                        data: etiquetas.slice(-10).reverse(),
                    },
                ],
            },
        };

        // Función para refrescar el gráfico
        if (chartInstance) {
            chartInstance.destroy();
        }
        chartInstance = new Chart(chart, config);
    } catch (err) {
        alert("Algo salió mal al cargar los datos del gráfico");
        console.log(err.message);
    }
}

function renderGrafica() {
    cargarDatos(selector).then(() => {
        document.getElementById("grafico").style.display = "block";
    });
}

selector.addEventListener("change", function () {
    document.getElementById("grafico").style.display = "none";
});

// Generar los colores de líneas aleatoriamente en cada búsqueda
function randomHex(length) {
    return ("0".repeat(length) + Math.floor(Math.random() * 16 ** length).toString(16)).slice(-length);
}