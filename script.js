const contenedor = document.getElementById("idContenedorResultados");
const nodoBusqueda = document.getElementById("idEntradaBusqueda");

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
            </article>`;
    });

    contenedor.innerHTML = htmlFinal;
}