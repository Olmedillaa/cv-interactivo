const inputBusqueda = document.getElementById('input-busqueda');
const btnBuscar = document.getElementById('btn-buscar');
const listaConocimientos = document.getElementById('lista-conocimientos');
const panelPerfil = document.getElementById('panel-perfil');
const btnTogglePerfil = document.getElementById('btn-toggle-perfil');
const btnCerrarPerfil = document.getElementById('btn-cerrar-perfil');
const contenidoPerfil = document.getElementById('contenido-perfil');

let conocimientos = [];

async function inicializarApp() {
    try {
        const [resPerfil, resConocimientos] = await Promise.all([
            fetch('perfil.json'),
            fetch('conocimientos.json')
        ]);

        const perfilUsuario = await resPerfil.json();
        conocimientos = await resConocimientos.json();

        pintarPerfil(perfilUsuario);
        pintarConocimientos(conocimientos);
    } catch (error) {
        console.error("Error cargando los JSON:", error);
    }
}

function pintarPerfil(perfil) {
    contenidoPerfil.innerHTML = `
        <h3 style="margin-top:0;">${perfil.nombre}</h3>
        <p style="color: #666; font-weight: bold;">${perfil.titular}</p>
        <p style="line-height: 1.5;">${perfil.sobre_mi}</p>
        <hr style="border: 0; border-top: 1px solid #EEE; margin: 20px 0;">
        <a href="${perfil.enlaces[0].url}" target="_blank" style="display: block; background: #333; color: white; text-align: center; padding: 10px; border-radius: 5px; text-decoration: none;">
            Ver mi ${perfil.enlaces[0].red}
        </a>
    `;
}

function pintarConocimientos(arrayFiltrado) {
    listaConocimientos.innerHTML = ""; 

    if (arrayFiltrado.length === 0) {
        listaConocimientos.innerHTML = "<p>No he encontrado resultados para esa búsqueda. ¡Prueba con otro término!</p>";
        return;
    }

    arrayFiltrado.forEach(item => {
        const li = document.createElement("li");
        
        li.innerHTML = `
            <span class="tipo-badge">${item.tipo}</span>
            <h3>${item.titulo}</h3>
            <p>${item.descripcion}</p>
            <div class="etiquetas">📌 Etiquetas: ${item.etiquetas.join(", ")}</div>
        `;
        
        listaConocimientos.appendChild(li);
    });
}

function ejecutarBusqueda() {
    const texto = inputBusqueda.value.toLowerCase().trim();

    const resultados = conocimientos.filter(item => {
        const tituloMatch = item.titulo.toLowerCase().includes(texto);
        const descMatch = item.descripcion.toLowerCase().includes(texto);
        const etiquetaMatch = item.etiquetas.some(etiqueta => 
            etiqueta.toLowerCase().includes(texto)
        );
        return tituloMatch || descMatch || etiquetaMatch;
    });

    pintarConocimientos(resultados);
}

// Eventos
btnBuscar.addEventListener("click", ejecutarBusqueda);
inputBusqueda.addEventListener("keyup", (evento) => {
    // Busca automáticamente mientras escribes (o al dar Enter)
    ejecutarBusqueda(); 
});

btnTogglePerfil.addEventListener("click", () => panelPerfil.classList.remove("oculto"));
btnCerrarPerfil.addEventListener("click", () => panelPerfil.classList.add("oculto"));

inicializarApp();