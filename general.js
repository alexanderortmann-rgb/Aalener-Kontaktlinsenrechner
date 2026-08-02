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

    document.getElementById('a1').addEventListener('input', function() {
    	var a1 = parseFloat(document.getElementById('a1').value);
    	if (a1 < 0) {
    	    a1 += 180;
    	} else if (a1 >= 180) {
    	    a1 -= 180;
    	}
    	document.getElementById('a1').value = a1;
    });
    
    document.getElementById('a2').addEventListener('input', function() {
    	var a1 = parseFloat(document.getElementById('a2').value);
    	if (a1 < 0) {
    	    a1 += 180;
    	} else if (a1 >= 180) {
    	    a1 -= 180;
    	}
    	document.getElementById('a2').value = a1;
    });

    //Für Radienrechner
    document.getElementById('Aa').addEventListener('input', function() {
    	var a = parseFloat(document.getElementById('Aa').value);
    	if (a < 0) {
    	    a += 180;
    	} else if (a >= 180) {
    	    a -= 180;
    	}
    	document.getElementById('Aa').value = a;
    });
        

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
