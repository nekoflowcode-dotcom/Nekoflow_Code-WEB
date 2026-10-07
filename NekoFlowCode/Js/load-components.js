document.addEventListener("DOMContentLoaded", () => {
    
    // Función para cargar los fragmentos desde la carpeta Pages
    const loadComponent = (id, file) => {
        const element = document.getElementById(id);
        if (element) {
            fetch(file)
                .then(response => response.text())
                .then(data => {
                    element.innerHTML = data;
                })
                .catch(error => console.error("Error al cargar:", error));
        }
    };

    // Apuntamos a la ruta dentro de la carpeta Pages
    loadComponent("inicio-placeholder", "Pages/inicio.html");
    loadComponent("nosotros-placeholder", "Pages/nosotros.html");
    loadComponent("servicios-placeholder", "Pages/servicios.html");
    loadComponent("proyecto-placeholder", "Pages/proyecto.html");
    loadComponent("contacto-placeholder", "Pages/contacto.html");
});