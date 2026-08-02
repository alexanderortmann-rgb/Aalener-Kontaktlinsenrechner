

    
    document.getElementById('Aa').addEventListener('input', function() {
    	var a = parseFloat(document.getElementById('Aa').value);
    	if (a < 0) {
    	    a += 180;
    	} else if (a >= 180) {
    	    a -= 180;
    	}
    	document.getElementById('Aa').value = a;
    });

    function berechne_Rad_SC() {
        // Einlesen
        var Rfla = parseFloat(document.getElementById('Rfla').value);
        var Rfln = parseFloat(document.getElementById('Rfln').value);
        var Rsta = parseFloat(document.getElementById('Rsta').value);
        var Rstn = parseFloat(document.getElementById('Rstn').value);
        var SPHa = parseFloat(document.getElementById('SPHa').value);
        var CYLa = parseFloat(document.getElementById('CYLa').value);
        var Aa = parseFloat(document.getElementById('Aa').value);
        
        var Rundung = parseFloat(getRoundingValue());
        
        var SPHn, CYLn;
        
        try {
           
        	if (CYLa <0) {
            	HS1 = SPHa + CYLa;
            	HS2 = SPHa;
            } else {
            	HS1 = SPHa;
            	HS2 = SPHa + CYLa;
            }
        	
        	Rfla = Rfla / 1000;
            Rsta = Rsta / 1000;
            Rfln = Rfln / 1000;
            Rstn = Rstn / 1000;
            
            var STLfl = 0.336 * (1 / Rfla - 1 / Rfln);
            var STLst = 0.336 * (1 / Rsta - 1 / Rstn);
            
            var HS1n = HS1 + STLfl;
            var HS2n = HS2 + STLst;
            
            if (CYLa <0) {
            	SPHn = HS2n;
            	CYLn = HS1n - HS2n;
            } else {
            	SPHn = HS1n;
            	CYLn = HS2n - HS1n;
            }
            
           var An = Aa;
            
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
    
