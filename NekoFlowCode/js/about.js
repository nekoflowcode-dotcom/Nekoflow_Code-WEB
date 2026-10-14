// Manejador para la sección About (Acordeones y Fichas de personas)
document.addEventListener('click', (e) => {
    // 1. Abrir ficha de persona
    const personTrigger = e.target.closest('.about-person-trigger');
    if (personTrigger) {
        const targetId = personTrigger.getAttribute('data-target');
        const panel = document.getElementById(targetId);
        if (panel) {
            panel.classList.toggle('is-open');
            personTrigger.setAttribute('aria-expanded', panel.classList.contains('is-open'));
        }
    }

    // 2. Cerrar ficha de persona
    const closeTrigger = e.target.closest('.about-person-close');
    if (closeTrigger) {
        const targetId = closeTrigger.getAttribute('data-close');
        const panel = document.getElementById(targetId);
        if (panel) {
            panel.classList.remove('is-open');
            const correspondingTrigger = document.querySelector(`[data-target="${targetId}"]`);
            if (correspondingTrigger) correspondingTrigger.setAttribute('aria-expanded', 'false');
        }
    }

    // 3. Acordeones principales (Habilidades, Tecnologías, Formación)
    const dropdownTrigger = e.target.closest('.about-panel-trigger');
    if (dropdownTrigger) {
        const panelWrapper = dropdownTrigger.closest('.about-panel');
        if (panelWrapper) {
            panelWrapper.classList.toggle('is-open');
            dropdownTrigger.setAttribute('aria-expanded', panelWrapper.classList.contains('is-open'));
        }
    }
});