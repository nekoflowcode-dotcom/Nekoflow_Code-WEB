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

        // Función auxiliar interna para mostrar alertas visuales en pantalla
        function showStatus(message, type) {
            if (!statusMsg) return;
            statusMsg.textContent = message;
            statusMsg.className = "form-status-msg " + (type ? `status-${type}` : "");
        }

        // UX MEJORA: Limpiar errores y atributos de accesibilidad al empezar a tipear
        [nameInput, emailInput, messageInput].forEach(input => {
            input.addEventListener("input", () => {
                input.removeAttribute("aria-invalid");
                showStatus("", "");
            });
        });

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevenir recarga de página

            showStatus("", ""); // Limpiamos mensajes anteriores

            // 1. CAPA DE SEGURIDAD: HONEYPOT (Detección de Bots)
            if (honeypotInput && honeypotInput.value.trim() !== "") {
                showStatus("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.", "success");
                contactForm.reset();
                return;
            }

            // 2. CAPA DE SEGURIDAD: RATE LIMITING (Control de tiempo - 60 segundos)
            const ultimoEnvio = localStorage.getItem("ultimoEnvioContact");
            const ahora = Date.now();
            const tiempoEspera = 60000; // 60 segundos en milisegundos

            if (ultimoEnvio && (ahora - ultimoEnvio < tiempoEspera)) {
                const segundosRestantes = Math.ceil((tiempoEspera - (ahora - ultimoEnvio)) / 1000);
                showStatus(`Por favor, esperá ${segundosRestantes} segundos antes de enviar otro mensaje.`, "error");
                return;
            }

            // 3. VALIDACIONES LOCALES CON UX Y ACCESIBILIDAD
            if (nameInput.value.trim().length < 3) {
                showStatus("Por favor, ingresá un nombre válido (mínimo 3 caracteres).", "error");
                nameInput.setAttribute("aria-invalid", "true");
                nameInput.focus();
                return;
            }

            if (!emailRegex.test(emailInput.value.trim())) {
                showStatus("Por favor, ingresá un correo electrónico válido.", "error");
                emailInput.setAttribute("aria-invalid", "true");
                emailInput.focus();
                return;
            }

            if (messageInput.value.trim().length < 10) {
                showStatus("El mensaje es muy corto. Escribí al menos 10 caracteres.", "error");
                messageInput.setAttribute("aria-invalid", "true");
                messageInput.focus();
                return;
            }

            // 4. CAPA DE SEGURIDAD: FILTRO ANTI-ENLACES SPAM EN EL MENSAJE
            const mensajeTexto = messageInput.value.toLowerCase();
            if (mensajeTexto.includes("http://") || mensajeTexto.includes("https://") || mensajeTexto.includes("www.")) {
                showStatus("Por seguridad, los mensajes no pueden contener enlaces web.", "error");
                messageInput.setAttribute("aria-invalid", "true");
                messageInput.focus();
                return;
            }

            // ==========================================================
            // 5. VALIDACIÓN DE RECAPTCHA V2
            // ==========================================================
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                showStatus("Por favor, completá el reCAPTCHA para verificar que no sos un robot.", "error");
                return;
            }

            // 6. ESTADO DE CARGA EN EL BOTÓN (UX: Indicador claro de proceso)
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "Enviando mensaje...";
            submitBtn.disabled = true;

            // 7. PARÁMETROS + EL TOKEN DE RECAPTCHA PARA EMAILJS
            const templateParams = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                title: "Nuevo contacto desde la web de Nekoflow",
                time: new Date().toLocaleString(),
                "g-recaptcha-response": recaptchaResponse // <- Clave indispensable que pide EmailJS
            };

            const serviceID = "service_NEKOemail";
            const templateID = "template_NEKOemail";

            // Usamos emailjs.send con su .then(), .catch() y .finally() bien estructurados
            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    localStorage.setItem("ultimoEnvioContact", Date.now());
                    showStatus("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.", "success");

                    // UX EXTRA: Pulso visual de éxito
                    const formContainer = contactForm.closest(".contact_form");
                    if (formContainer) {
                        formContainer.classList.add("success-flash");
                        setTimeout(() => formContainer.classList.remove("success-flash"), 1000);
                    }

                    contactForm.reset(); // Limpia los campos del formulario
                    grecaptcha.reset(); // Resetea el widget de Google para que pueda usarse de nuevo

                    // UX EXTRA: Limpiar el mensaje de éxito automáticamente después de 6 segundos
                    setTimeout(() => {
                        showStatus("", "");
                    }, 6000);
                })
                .catch((error) => {
                    console.error("Error al enviar el correo:", error);
                    showStatus("Hubo un error al enviar el mensaje. Por favor, intentá nuevamente.", "error");
                    grecaptcha.reset(); // Resetea el captcha si hubo error
                })
                .finally(() => {
                    // Restauramos el botón original de forma segura
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    });
});

/* ========================================================== */
/*   CALLBACK GLOBAL PARA RECAPTCHA INVISIBLE                 */
/*   Se ejecuta automáticamente tras la validación de Google  */
/* ========================================================== */
function onReCaptchaSuccess(token) {
    // El 'token' ya fue generado. Ahora podés enviar los datos del formulario 
    // mediante fetch() o dejar que el formulario continúe su envío normal.
    
    const form = document.getElementById('email-form');
    
    // Ejemplo si usas FormData o Fetch:
    const formData = new FormData(form);
    formData.append('g-recaptcha-response', token); // Adjuntas el token para validarlo en tu backend (PHP/Node)

    console.log("Token de reCAPTCHA obtenido con éxito, enviando formulario...");
}