/* ========================================== */
/*   ACTUALIZACIÓN AUTOMÁTICA DEL COPYRIGHT   */
/* ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /**
     * Obtiene el año actual del sistema.
     * @returns {number} El año en curso (ej. 2026).
     */
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    // Inserta el año actual dentro del elemento HTML con el ID #current-year
    const yearElement = document.querySelector("#current-year");
    
    if (yearElement) {
        yearElement.textContent = getCurrentYear();
    }
});