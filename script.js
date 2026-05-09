const contenedor = document.getElementById("idContenedorResultados");
const nodoBusqueda = document.getElementById("idEntradaBusqueda");
const idBotonesFiltro = document.getElementById("idBotonesFiltro");
const idModalRaiz = document.getElementById("idModalRaiz");
const idContenidoModal = document.getElementById("idContenidoModal");
const idCerrarModal = document.getElementById("idCerrarModal");

let listaPaisesBase = [];

fetch("https://disease.sh/v3/covid-19/countries")
    .then(response => response.json())
    .then(data => {
        listaPaisesBase = data; 
        localStorage.setItem("paises", JSON.stringify(data));
        crearBotonesFiltro(data);
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

function crearBotonesFiltro(lista) {
    const continentes = Array.from(new Set(lista.map(pais => pais.continent))).sort();
    const botones = ['Todos', ...continentes];

    idBotonesFiltro.innerHTML = botones.map(nombre => {
        const claseActiva = nombre === 'Todos' ? 'btn-filtro activo' : 'btn-filtro';
        return `<button class="${claseActiva}" onclick="filtrarPorContinente('${nombre}')">${nombre}</button>`;
    }).join('');
}

function filtrarPorContinente(continente) {
    const botones = Array.from(idBotonesFiltro.querySelectorAll('button'));
    botones.forEach(boton => boton.classList.toggle('activo', boton.textContent === continente));

    if (continente === 'Todos') {
        pintarEnPantalla(listaPaisesBase);
        return;
    }

    const filtrados = listaPaisesBase.filter(pais => pais.continent === continente);
    pintarEnPantalla(filtrados);
}

function pintarEnPantalla(lista) {
    let htmlFinal = ""; 

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontró ningún país con ese nombre.</p>";
        return;
    }

    lista.forEach(pais => {
        htmlFinal += `
            <article class="tarjeta">
                <img src="${pais.countryInfo.flag}" alt="Bandera de ${pais.country}">
                <h2>${pais.country}</h2>
                <!-- Botón de Ver Detalles -->
                <p><b>Población:</b> ${pais.population.toLocaleString()}</p>
                <button class="btn-ver" onclick="verDetalle('${pais.country}')">
                    Ver detalles
                </button>
            </article>`;
    });

    contenedor.innerHTML = htmlFinal;
    console.log(listaPaisesBase)
}

function verDetalle(nombrePais) {
    const pais = listaPaisesBase.find(p => p.country === nombrePais);

    if (pais) {
        idContenidoModal.innerHTML = `
            <h2>${pais.country}</h2>
            <img src="${pais.countryInfo.flag}" width="150px" style="border-radius: 8px" alt="Bandera de ${pais.country}">
            <hr>
            <p><b>Continente:</b> ${pais.continent}</p>
            <p><b>Población:</b> ${pais.population.toLocaleString()}</p>
            <p><b>Casos totales:</b> ${pais.cases.toLocaleString()}</p>
            <p><b>Fallecidos:</b> ${pais.deaths.toLocaleString()}</p>
            <p><b>Recuperados:</b> ${pais.recovered.toLocaleString()}</p>
            <p><b>Pruebas:</b> ${pais.tests.toLocaleString()}</p>
            <p><b>Activos:</b> ${pais.active.toLocaleString()}</p>
        `;
        idModalRaiz.classList.remove('oculto');
    }
}

idCerrarModal.onclick = function() {
    idModalRaiz.classList.add('oculto');
};

window.onclick = function(event) {
    if (event.target == idModalRaiz) {
        idModalRaiz.classList.add('oculto');
    }
};
