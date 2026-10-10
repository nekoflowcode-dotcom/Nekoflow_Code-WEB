/* ========================================== */
/*   CARGA DINÁMICA OPTIMIZADA DE COMPONENTES */
/* ========================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Mapa de contenedores y sus archivos correspondientes
    const components = [
        { id: "inicio-container", file: "Pages/inicio.html" },
        { id: "nosotros-container", file: "Pages/nosotros.html" },
        { id: "servicios-container", file: "Pages/servicios.html" },
        { id: "proyecto-container", file: "Pages/proyecto.html" },
        { id: "contacto-container", file: "Pages/contacto.html" }
    ];
    // Carga paralela de todos los componentes
    const loadPromises = components.map(({ id, file }) => {
        const container = document.getElementById(id);
        if (!container) return Promise.resolve();

        return fetch(file)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.text();
            })
            .then(html => {
                container.innerHTML = html;
            })
            .catch(error => {
                console.error(`Error al cargar el componente (${file}):`, error);
                container.innerHTML = `<p class="error-msg">No se pudo cargar esta sección.</p>`;
            });
    });
    // Una vez que todos los componentes cargan, avisamos al documento
    Promise.all(loadPromises).then(() => {
        document.dispatchEvent(new CustomEvent("componentsLoaded"));
    });
});