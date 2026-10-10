/* ========================================== */
/*   CARGA DINÁMICA DE COMPONENTES MODULARES  */
/* ========================================== */
document.addEventListener("DOMContentLoaded", () => {

    /**
     * Carga un archivo HTML dentro de un contenedor por su ID
     * @param {string} idContainer - ID del elemento destino
     * @param {string} filePath - Ruta del archivo HTML a inyectar
     */
    const loadComponent = (idContainer, filePath) => {
        const container = document.getElementById(idContainer);
        if (container) {
            fetch(filePath)
                .then(response => {
                    if (!response.ok) throw new Error(`Error al cargar ${filePath}`);
                    return response.text();
                })
                .then(data => {
                    container.innerHTML = data;
                })
                .catch(error => console.error("Error en modularización:", error));
        }
    };

    // Inyección de secciones desde la carpeta Pages
    loadComponent("inicio-container", "Pages/inicio.html");
    loadComponent("nosotros-container", "Pages/nosotros.html");
    loadComponent("servicios-container", "Pages/servicios.html");
    loadComponent("proyecto-container", "Pages/proyecto.html");
    loadComponent("contacto-container", "Pages/contacto.html");
});