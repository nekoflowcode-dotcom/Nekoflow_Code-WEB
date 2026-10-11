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
        const honeypotInput = document.querySelector("#website-trap"); // Captura el campo trampa
        const submitBtn = document.querySelector("#submit-btn") || contactForm.querySelector(".contact_form-btn");
        const statusMsg = document.querySelector("#form-status");

        // Expresión regular estándar para validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevenir recarga de página

            showStatus("", ""); // Limpiamos mensajes anteriores de forma correcta

            // 1. CAPA DE SEGURIDAD: HONEYPOT (Detección de Bots)
            if (honeypotInput && honeypotInput.value.trim() !== "") {
                // Si el bot rellenó el campo trampa, fingimos éxito para engañarlo pero bloqueamos el envío real
                showStatus("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.", "success");
                contactForm.reset();
                return;
            }

            // 2. CAPA DE SEGURIDAD: RATE LIMITING (Control de tiempo por localStorage - 60 segundos)
            const ultimoEnvio = localStorage.getItem("ultimoEnvioContact")
            const ahora = Date.now();
            const tiempoEspera = 60000; // 60 segundos en milisegundos

            if (ultimoEnvio && (ahora - ultimoEnvio < tiempoEspera)) {
                const segundosRestantes = Math.ceil((tiempoEspera - (ahora - ultimoEnvio)) / 1000);
                showStatus(`Por favor, esperá ${segundosRestantes} segundos antes de enviar otro mensaje.`, "error");
                return;
            }

            // 3. CAPA DE SEGURIDAD: FILTRO ANTI-ENLACES SPAM EN EL MENSAJE
            const mensajeTexto = messageInput.value.toLowerCase();
            if (mensajeTexto.includes("http://") || mensajeTexto.includes("https://") || mensajeTexto.includes("www.")) {
                showStatus("Por seguridad, los mensajes no pueden contener enlaces web.", "error");
                messageInput.focus();
                return;
            }

            // 4. VALIDACIONES LOCALES
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

            // 5. ESTADO DE CARGA EN EL BOTÓN
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "Enviando mensaje...";
            submitBtn.disabled = true;

            // 6. PARÁMETROS PARA LA PLANTILLA DE EMAILJS
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
                    // Guardamos la marca de tiempo del envío exitoso para el Rate Limiting
                    localStorage.setItem("ultimoEnvioContact", Date.now());
                    
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