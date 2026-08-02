
    function berechne_HSA_SC() {
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

    function berechne_HSA_HH() {
        // Einlesen
        var HSAa = parseFloat(document.getElementById('hsa1').value);
        var HSAn = parseFloat(document.getElementById('hsa2').value);
        var HS1a = parseFloat(document.getElementById('HS1').value);
        var HS2a = parseFloat(document.getElementById('HS2').value);
        
        var Rundung = parseFloat(getRoundingValue());
        
        var HS1n,HS2n;
        
        try {
           
        	 HSAa = HSAa / 1000;
             HSAn = HSAn / 1000;

             HS1n = HS1a / (1+(HSAn-HSAa)*HS1a);
             HS2n = HS2a / (1+(HSAn-HSAa)*HS2a);
             
             HS1n = round(HS1n,Rundung);
             HS2n = round(HS2n,Rundung);

            document.getElementById('HS1n').innerHTML = HS1n;
            document.getElementById('HS2n').innerHTML = HS2n;
            

        } catch (e) {
        	document.getElementById('HS1n').innerHTML = 'Invalid input';
        	document.getElementById('HS2n').innerHTML = 'Invalid input';

        }
    }

     function berechne_HSA_S() {
        // Einlesen
        var HSAa = parseFloat(document.getElementById('hsa1').value);
        var HSAn = parseFloat(document.getElementById('hsa2').value);
        var SPHa = parseFloat(document.getElementById('sph1').value);
        
        var Rundung = parseFloat(getRoundingValue());
        
        var SPHn;
        
        try {
           
        	 HSAa = HSAa / 1000;
             HSAn = HSAn / 1000;

             SPHn = SPHa / (1 + (HSAn - HSAa) * SPHa);
             
             SPHn = round(SPHn,Rundung);
        	

            document.getElementById('SPHn').innerHTML = SPHn;
            

        } catch (e) {
            document.getElementById('SPHn').innerHTML = 'Invalid input';
        }
    }


    document.getElementById('a1').addEventListener('input', function() {
    	var a1 = parseFloat(document.getElementById('a1').value);
    	if (a1 < 0) {
    	    a1 += 180;
    	} else if (a1 >= 180) {
    	    a1 -= 180;
    	}
    	document.getElementById('a1').value = a1;
    });
