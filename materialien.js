// Funktion zum Öffnen
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
}

// Funktion zum Schließen
function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
}

// Event-Listener für die ?-Button zum Öffnen
document.getElementById('btHelpPermeabilität').onclick = function() {
    openModal('modHelpPermeabilität');
};
document.getElementById('btHelpBenetzungswinkel').onclick = function() {
    openModal('modHelpBenetzungswinkel');
};
document.getElementById('btHelpDynBen').onclick = function() {
    openModal('modHelpDynBen');
};
document.getElementById('btHelpHärte').onclick = function() {
    openModal('modHelpHärte');
};
document.getElementById('btHelpModulus').onclick = function() {
    openModal('modHelpModulus');
};
document.getElementById('btHelpZaehi').onclick = function() {
    openModal('modHelpZaehi');
};

// Event-Listener für die X in den Modals
var closeButtons = document.getElementsByClassName('close');
for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].onclick = function() {
        var modalId = this.getAttribute('data-modal');
        closeModal(modalId);
    };
}

// Schließen beim Klicken außerhalb des Fensters
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
}
