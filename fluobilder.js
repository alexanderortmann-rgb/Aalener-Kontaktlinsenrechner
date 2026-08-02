function initFluoModalEvents() {

    // Liste aller Buttons + zugehöriger Modals
    const modalPairs = [
        ['btHelpSt', 'modHelpSt'],
        ['btHelpPl', 'modHelpPl'],
        ['btHelpFl', 'modHelpFl']
    ];

    // Öffnen-Events setzen
    modalPairs.forEach(([btnId, modalId]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.onclick = () => openModal(modalId);
        }
    });
}

