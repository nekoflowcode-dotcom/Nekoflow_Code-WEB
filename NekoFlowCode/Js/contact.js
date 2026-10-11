/* ========================================== */
/*   CONTROLADOR DE ENVÍO DE EMAIL (EmailJS)  */
/*            VALIDACIÓN DE CONTACTO          */
/* ========================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Esperamos a que los componentes estén cargados por si el formulario viene inyectado
    document.addEventListener("componentsLoaded", () => {
        const contactForm = document.querySelector("#contacto form");
        if (!contactForm) return;

        const nameInput = document.querySelector("#name");
        const emailInput = document.querySelector("#email");
        const messageInput = document.querySelector("#message");
        const submitBtn = document.querySelector("#submit-btn") || contactForm.querySelector(".contact_form-btn");
        const statusMsg = document.querySelector("#form-status");

        // Expresión regular estándar para validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevenir recarga de página

            showStatus("", ""); // Limpiamos mensajes anteriores de forma correcta

            // 1. VALIDACIONES LOCALES
            if (nameInput.value.trim().length < 3) {
                showStatus("Por favor, ingresá un nombre válido (mínimo 3 caracteres).", "error");
                nameInput.focus();
                return;
            }

            if (!emailRegex.test(emailInput.value.trim())) {
                showStatus("Por favor, ingresá un correo electrónico válido.", "error");
                emailInput.focus();
                return;
            }

            if (messageInput.value.trim().length < 10) {
                showStatus("El mensaje es muy corto. Escribí al menos 10 caracteres.", "error");
                messageInput.focus();
                return;
            }

            // 2. ESTADO DE CARGA EN EL BOTÓN
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "Enviando mensaje...";
            submitBtn.disabled = true;

            // 3. PARÁMETROS PARA LA PLANTILLA DE EMAILJS
            const templateParams = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                title: "Nuevo contacto desde la web de Nekoflow",
                time: new Date().toLocaleString()  // Genera la fecha y hora exacta automáticamente
            };

            const serviceID = "service_NEKOemail";
            const templateID = "template_NEKOemail";

            // Usamos emailjs.send en lugar de sendForm para controlar bien los parámetros
            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    alert("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
                    contactForm.reset(); // Limpia los campos del formulario
                }, (error) => {
                    console.error("Error al enviar el correo:", error);
                    alert("Hubo un error al enviar el mensaje. Por favor, intentá nuevamente.");
                })
                .finally(() => {
                    // Restauramos el botón original
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });

        // Función auxiliar para mostrar alertas visuales en pantalla
        function showStatus(message, type) {
            if (!statusMsg) return; // Validación de seguridad por si el elemento no existe
            statusMsg.textContent = message;
            statusMsg.className = "form-status-msg " + (type ? `status-${type}` : "");
        }
    });
});