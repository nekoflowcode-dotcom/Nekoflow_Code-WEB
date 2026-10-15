/* ========================================== */
/*   CARGA DINÁMICA OPTIMIZADA DE COMPONENTES */
/* ========================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Detectar si estamos en GitHub Pages con subrepositorio o en raíz
    const baseHref = window.location.hostname.includes("github.io") && window.location.pathname.split("/")[1] 
        ? `/${window.location.pathname.split("/")[1]}/` 
        : "./";

    // Mapa de contenedores y sus archivos correspondientes usando la ruta dinámica
    const components = [
        { id: "hero-container", file: `${baseHref}pages/hero.html` },
        { id: "about-container", file: `${baseHref}pages/about.html` },
        { id: "services-container", file: `${baseHref}pages/services.html` },
        { id: "projects-container", file: `${baseHref}pages/projects.html` },
        { id: "contact-container", file: `${baseHref}pages/contact.html` }
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