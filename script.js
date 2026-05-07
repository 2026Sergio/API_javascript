
fetch("https://disease.sh/v3/covid-19/countries")
    .then(response => response.json())
    .then(data => {

        const contenedor = document.getElementById("idContenedorResultados");
        data.forEach(pais => {

            contenedor.innerHTML += `
                    <h2>${pais.country}</h2>
                    <img src="${pais.countryInfo.flag}" width="50px" alt="Bandera">`;
    });
})
async function mostrarPaises(){
    let paises = JSON.paises(localStorage.getItem("paises"))
    if (paises){
        console.log(paises)
    }
}