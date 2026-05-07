const nodoResultados = document.getElementById('idContenedorResultados');
const nodoBusqueda = document.getElementById('idEntradaBusqueda');
const nodoFiltros = document.getElementById('idBotonesFiltro');
const nodoCargador = document.getElementById('idCargador');
const nodoModal = document.getElementById('idModalRaiz');
const nodoContenidoModal = document.getElementById('idContenidoModal');

let listaPaisesBase = [];
let continenteSeleccionado = 'Todos';

// Función de espera (Promesa)
const pausa = (ms) => new Promise(res => setTimeout(res, ms));

// Obtener datos de la API
async function iniciarApp() {
    try {
        nodoCargador.classList.remove('oculto');
        const respuesta = await fetch('https://disease.sh/v3/covid-19/countries');
        listaPaisesBase = await respuesta.json();
        
        await pausa(1000); // Pausa estética
        crearBotonesDeFiltro();
        ejecutarFiltroCombinado();
    } catch (err) {
        console.error("Error de conexión:", err);
        nodoResultados.innerHTML = "<p>Error al conectar con el servidor.</p>";
    } finally {
        nodoCargador.classList.add('oculto');
    }
}

// Lógica de conexión: Filtra por continente Y por texto a la vez
function ejecutarFiltroCombinado() {
    const texto = nodoBusqueda.value.toLowerCase();
    
    const paisesFiltrados = listaPaisesBase.filter(pais => {
        const coincideTexto = pais.country.toLowerCase().includes(texto);
        const coincideContinente = (continenteSeleccionado === 'Todos' || pais.continent === continenteSeleccionado);
        return coincideTexto && coincideContinente;
    });

    pintarTarjetas(paisesFiltrados);
}

// Renderizado de tarjetas en la interfaz
function pintarTarjetas(datos) {
    nodoResultados.innerHTML = '';
    
    if (datos.length === 0) {
        nodoResultados.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    datos.forEach(p => {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'tarjeta';
        tarjeta.innerHTML = `
            <img src="${p.countryInfo.flag}" alt="Bandera">
            <h3>${p.country}</h3>
            <p style="color:#64748b; font-size:0.8rem;">${p.continent}</p>
            <button class="btn-ver">Ver Detalles</button>
        `;

        tarjeta.onclick = async () => {
            tarjeta.classList.add('estado-cargando');
            mostrarCargaEnModal();
            await pausa(800);
            tarjeta.classList.remove('estado-cargando');
            dibujarDetallesModal(p);
        };

        nodoResultados.appendChild(tarjeta);
    });
}

// Manejo del Modal
function mostrarCargaEnModal() {
    nodoContenidoModal.innerHTML = '<div class="rueda-progreso"></div><p>Buscando datos...</p>';
    nodoModal.classList.remove('oculto');
}

function dibujarDetallesModal(p) {
    nodoContenidoModal.innerHTML = `
        <img src="${p.countryInfo.flag}" style="width:80px; border-radius:8px;">
        <h2>${p.country}</h2>
        <div style="text-align:left; background:#f1f5f9; padding:15px; border-radius:12px;">
            <p>👥 <b>Población:</b> ${p.population.toLocaleString()}</p>
            <p>🦠 <b>Casos hoy:</b> ${p.todayCases.toLocaleString()}</p>
            <p>📊 <b>Total casos:</b> ${p.cases.toLocaleString()}</p>
            <p>💀 <b>Muertes:</b> ${p.deaths.toLocaleString()}</p>
            <p>✅ <b>Recuperados:</b> ${p.recovered.toLocaleString()}</p>
        </div>
    `;
}

// Generación de filtros
function crearBotonesDeFiltro() {
    const categorias = ['Todos', ...new Set(listaPaisesBase.map(p => p.continent))];
    
    nodoFiltros.innerHTML = '';
    categorias.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `btn-filtro ${cat === continenteSeleccionado ? 'activo' : ''}`;
        btn.textContent = cat;
        
        btn.onclick = () => {
            continenteSeleccionado = cat;
            document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            ejecutarFiltroCombinado();
        };
        nodoFiltros.appendChild(btn);
    });
}

// Eventos de usuario
nodoBusqueda.oninput = ejecutarFiltroCombinado;
document.getElementById('idCerrarModal').onclick = () => nodoModal.classList.add('oculto');
window.onclick = (e) => { if (e.target === nodoModal) nodoModal.classList.add('oculto'); };

async function iniciarApp() {
    try {
        nodoCargador.classList.remove('oculto');
        const respuesta = await fetch('https://disease.sh/v3/covid-19/countries');
        
        // ESTO TE ENSEÑA DE DÓNDE VIENE (Status 200, URL, etc.)
        console.log("Respuesta de la API:", respuesta); 

        listaPaisesBase = await respuesta.json();
        
        // ESTO TE ENSEÑA EL ARRAY CON LOS 200+ PAÍSES
        console.log("Array de países cargado:", listaPaisesBase); 
        
        await pausa(1000); 
        crearBotonesDeFiltro();
        ejecutarFiltroCombinado();
    } catch (err) {
        console.error("Error de conexión:", err);
        nodoResultados.innerHTML = "<p>Error al conectar con el servidor.</p>";
    } finally {
        nodoCargador.classList.add('oculto');
    }
}

// Encendido
iniciarApp();