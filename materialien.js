function initMaterialienModalEvents() {
    const ids = [
        ['btHelpPermeabilität', 'modHelpPermeabilität'],
        ['btHelpBenetzungswinkel', 'modHelpBenetzungswinkel'],
        ['btHelpDynBen', 'modHelpDynBen'],
        ['btHelpHärte', 'modHelpHärte'],
        ['btHelpModulus', 'modHelpModulus'],
        ['btHelpZaehi', 'modHelpZaehi']
    ];

    ids.forEach(([btnId, modalId]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.onclick = () => openModal(modalId);
        }
    });
}
