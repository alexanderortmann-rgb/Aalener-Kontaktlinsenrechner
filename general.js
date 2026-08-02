//Den Rundungswert einlesen
    function getRoundingValue() {
    	var radios = document.querySelector('input[name="rounding"]:checked');
    	return radios ? parseFloat(radios.value) : 4;
    }
  
    function round(value, interval) {
        return Math.round(value * interval) / interval;
    }    

window.onload = function() {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            // Ersetze das Eingabefeld durch ein text-input, wenn es sich um ein mobiles Gerät handelt
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
    };
        

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
