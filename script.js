const contenedor = document.getElementById("idContenedorResultados");
const nodoBusqueda = document.getElementById("idEntradaBusqueda");
const idModalRaiz = document.getElementById("Modal");

let listaPaisesBase = [];

fetch("https://disease.sh/v3/covid-19/countries")
    .then(response => response.json())
    .then(data => {
        listaPaisesBase = data; 
        localStorage.setItem("paises", JSON.stringify(data));
        pintarEnPantalla(data);
    })
    .catch(error => console.error("Error:", error));

nodoBusqueda.oninput = () => {
    const textoUsuario = nodoBusqueda.value.toLowerCase();
    const filtrados = listaPaisesBase.filter(pais => 
        pais.country.toLowerCase().includes(textoUsuario)
    );
    pintarEnPantalla(filtrados);
};

function pintarEnPantalla(lista) {
    let htmlFinal = ""; 

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontró ningún país con ese nombre.</p>";
        return;
    }

    lista.forEach(pais => {
        htmlFinal += `
            <article class="tarjeta">
                <h2>${pais.country}</h2>
                <img src="${pais.countryInfo.flag}" width="50px" alt="Bandera">
                <br>
                <div class="caja-modal" onclick="verDetalle('${pais.country}')">
                <p> <b>Población: </b> ${pais.population.toLocaleString()}</p>
                <p><b>Casos diarios: </b>${pais.todayCases}</p>
                <p><b>Casos críticos: </b>${pais.critical}</p>
                <p><b>Casos por millón: </b>${pais.criticalPerOneMillion}</p>
                <p><b>Fallecidos: </b>${pais.deaths}</p>
                </div>
            </article>`;
    });

    contenedor.innerHTML = htmlFinal;
    console.log(listaPaisesBase)
}

function verDetalle(nombrePais) {
    const pais = listaPaisesBase.find(p => p.country === nombrePais);

    if (pais) {
        idModalRaiz.innerHTML = `
            <div class="modal-content">
                <span class="cerrar-modal" id="cerrarModal">&times;</span>
                <h2>${pais.country}</h2>
                <img src="${pais.countryInfo.flag}" width="150px" style="border-radius: 8px">
                <hr>
                <p><b>Continente:</b> ${pais.continent}</p>
                <p><b>Casos totales:</b> ${pais.cases.toLocaleString()}</p>
                <p><b>Recuperados:</b> ${pais.recovered.toLocaleString()}</p>
                <p><b>Pruebas:</b> ${pais.tests.toLocaleString()}</p>
                <p><b>Activos:</b> ${pais.active.toLocaleString()}</p>
            </div>
        `;
        idModalRaiz.style.display = "block";
        document.getElementById("cerrarModal").onclick = function() {
            idModalRaiz.style.display = "none";
        };
    }
}
window.onclick = function(event) {
    if (event.target == idModalRaiz) {
        idModalRaiz.style.display = "none";
    }
};