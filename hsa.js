<script>
    
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
        
  
    


    function berechne() {
        // Einlesen
        var HSAa = parseFloat(document.getElementById('hsa1').value);
        var HSAn = parseFloat(document.getElementById('hsa2').value);
        var SPHa = parseFloat(document.getElementById('sph1').value);
        var CYLa = parseFloat(document.getElementById('cyl1').value);
        var Aa = parseFloat(document.getElementById('a1').value);
        
        var Rundung = parseFloat(getRoundingValue());
        
        var HS1a, HS2a, HS1n, HS2n, SPHn, CYLn, An;
        
        try {
           
        	if (CYLa <0) {
            	HS1a = SPHa + CYLa;
            	HS2a = SPHa;
            } else {
            	HS1a = SPHa;
            	HS2a = SPHa + CYLa;
            }
        	
        	 HSAa = HSAa / 1000;
             HSAn = HSAn / 1000;

             HS1n = HS1a / (1+(HSAn-HSAa)*HS1a);
             HS2n = HS2a / (1+(HSAn-HSAa)*HS2a);
             
             if (CYLa <0) {
             	SPHn = HS2n;
             	CYLn = HS1n - HS2n;
             } else {
             	SPHn = HS1n;
             	CYLn = HS2n-HS1n;
             }
             
             An = Aa;
             
             SPHn = round(SPHn,Rundung);
             CYLn = round(CYLn,Rundung);

            document.getElementById('SPHn').innerHTML = SPHn;
            document.getElementById('CYLn').innerHTML = CYLn;
            document.getElementById('An').innerHTML = An;
            

        } catch (e) {
        	document.getElementById('SPHn').innerHTML = 'Invalid input';
        	document.getElementById('CYLn').innerHTML = 'Invalid input';
        	document.getElementById('An').innerHTML = 'Invalid input';

        }
    }



  //Den Rundungswert einlesen
    function getRoundingValue() {
    	var radios = document.querySelector('input[name="rounding"]:checked');
    	return radios ? parseFloat(radios.value) : 4;
    }
  
    function round(value, interval) {
        return Math.round(value * interval) / interval;
    }    

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
    
    </script>
