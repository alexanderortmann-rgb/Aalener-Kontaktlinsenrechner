// Rundungswert
function getRoundingValue() {
    var radios = document.querySelector('input[name="rounding"]:checked');
    return radios ? parseFloat(radios.value) : 4;
}

function round(value, interval) {
    return Math.round(value * interval) / interval;
}

// Mobile Input ersetzen
function initMobileInputs() {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        var inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(function(input) {
            var parent = input.parentNode;
            var newInput = document.createElement("input");
            newInput.type = "text";
            newInput.id = input.id;
            newInput.name = input.name;
            newInput.value = input.value;
            newInput.required = input.required;
            newInput.oninput = function() {
                this.value = this.value.replace(/[^-0-9.,]/g, '');
            };
            parent.replaceChild(newInput, input);
        });
    }
}

// Achsenbegrenzung
function initAxisInputs() {
    const ids = ['a1', 'a2', 'Aa', 'AÜR'];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.addEventListener('input', function() {
            var a = parseFloat(el.value);
            if (a < 0) a += 180;
            else if (a >= 180) a -= 180;
            el.value = a;
        });
    });
}

// Modaleinstellungen
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.style.display = "block";
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
}

function initGeneralModalEvents() {
    var closeButtons = document.getElementsByClassName('close');
    for (var i = 0; i < closeButtons.length; i++) {
        closeButtons[i].onclick = function() {
            var modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        };
    }

    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    };
}

// Müller-Quelle
function initMueller() {
    const Mueller = "Quelle: Müller-Treiber, A. (2017) Kontaktlinsen Know-how. 4. Aufl. Heidelberg: DOZ. ISBN 978-3-942873-17-8";

    document.querySelectorAll('.Mueller').forEach(element => {
        element.textContent = Mueller;
    });
}




/*
  //Footer mit Infos laden
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer').innerHTML = data;
      })
    .catch(error => console.error('Error loading footer.html:', error));

  //Head mit Links laden
    fetch('Links.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('Links').innerHTML = data;
      })
    .catch(error => console.error('Error loading Links.html:', error)); 
*/
