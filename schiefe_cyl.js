 function berechne_schief_cyl() {
        // Einlesen
        var HSA1 = parseFloat(document.getElementById('hsa1').value);
        var DSA = parseFloat(document.getElementById('dsa').value);
        var HSA2 = parseFloat(document.getElementById('hsa2').value);
        //var HSAE = parseFloat(document.getElementById('HSAE').value);
        
        var SPH1 = parseFloat(document.getElementById('sph1').value);
        var CYL1 = parseFloat(document.getElementById('cyl1').value);
        var A1 = parseFloat(document.getElementById('a1').value);
        
        var SPH2 = parseFloat(document.getElementById('sph2').value);
        var CYL2 = parseFloat(document.getElementById('cyl2').value);
        var A2 = parseFloat(document.getElementById('a2').value);
        
        var Rundung = parseFloat(getRoundingValue());
        
        var a1, a2, HS11a, HS21a, HS12, HS22, SPHn, CYLn, An, M_1, J0_1, J45_1, M_2, J0_2, J45_2;
        
        HSA1 = HSA1 / 1000;
        HSA2 = HSA2 / 1000;
        //HSAE = HSAE / 1000;
        
        //try {
        	 //Für Linse 1
            if (CYL1 <= 0) {
                HS11a = SPH1 ;
                HS21a = SPH1 + CYL1;
            } else {
                HS11a = SPH1 + CYL1;
                HS21a = SPH1 ;
            }
            

            var HS11 = HS11a / (1 + (0 - HSA1) * HS11a);
            var HS21 = HS21a / (1 + (0 - HSA1) * HS21a);
             
            // Zurückrechnung in Minuszylinder
            var Sph1 = HS11;
            var Cyl1 = HS21 - HS11;
           //if (CYL1 > 0) {a1 = (A1 <= 90) ? A1 + 90 : A1 - 90;}
           if (CYL1 <= 0) {
   			 a1 = A1;
			} 
           else {
        	   if (A1 <= 90) { a1 = A1 + 90;} 
  		  else { a1 = A1 - 90; } }
           a1 = a1 + DSA;
            
            // Power der 1. Linse
            var Linse1Power = LinseinPower(Sph1, Cyl1, a1);
            M_1 = Linse1Power.M;
            J0_1 = Linse1Power.J0;
            J45_1 = Linse1Power.J45;
             
            // Für Linse 2
            var HS12a, HS22a;
            if (CYL2 <= 0) {
                HS12a = SPH2 ;
                HS22a = SPH2 + CYL2;
            } else {
                HS12a = SPH2 + CYL2;
                HS22a = SPH2 ;
            }

            var HS12 = HS12a / (1 + (0 - HSA2) * HS12a);
            var HS22 = HS22a / (1 + (0 - HSA2) * HS22a);
             
            // Zurückrechnung in Minuszylinder
            var Sph2 = HS12;
            var Cyl2 = HS22 - HS12;
            //if (CYL2 >= 0) { a2 = (A2 <= 90) ? A2 + 90 : A2 - 90;}
             if (CYL2 <= 0) {
   			 a2 = A2;
			} 
           else {
        	   if (A2 <= 90) { a2 = A2 + 90;} 
  		  else { a2 = A2 - 90; } }
            
            // Powervektoren Linse 2 
            var Linse2Power = LinseinPower(Sph2, Cyl2, a2);
            M_2 = Linse2Power.M;
            J0_2 = Linse2Power.J0;
            J45_2 = Linse2Power.J45;
           
            // Resultierende Linse
            var M_E = M_1 + M_2;
            var J0_E = J0_1 + J0_2;
            var J45_E = J45_1 + J45_2;
             
        	//Power in Linse
        	var Endlinse = PowerinLinse(M_E,J0_E,J45_E);
    		var SPHn = Endlinse.Sph;
    		var CYLn = Endlinse.Cyl;
    		var An = Endlinse.A;
        	
             SPHn = round(SPHn,Rundung);
             CYLn = round(CYLn,Rundung);

            document.getElementById('SPHn').innerHTML = SPHn;
            document.getElementById('CYLn').innerHTML = CYLn;
            document.getElementById('An').innerHTML = An;
            
/*
        } catch (e) {
        	document.getElementById('SPHn').innerHTML = 'Invalid input';
        	document.getElementById('CYLn').innerHTML = 'Invalid input';
        	document.getElementById('An').innerHTML = 'Invalid input';

        }*/
        
        var TestLinse = PowerinLinse(M_2,J0_2,J45_2);
		var ST = TestLinse.Sph;
		var CT = TestLinse.Cyl;
		var AT = TestLinse.A;
        
        console.log('Ergebnis der Linse1:', Sph1, Cyl1, a1);
        console.log('Ergebnis der Linse1 Hauptschnitte:', HS11, HS21);
        console.log('Ergebnis der Linse1 Power:', M_1, J0_1, J45_1);
        
        console.log('Ergebnis der Linse2:', Sph2, Cyl2, a2);
        console.log('Ergebnis der Linse2 Hauptschnitte:', HS12, HS22);
        console.log('Ergebnis der Linse2 Power:', M_2, J0_2, J45_2);
        
        console.log('Ergebnis der LinseTest2:', ST, CT, AT);
    }

    
//Das sollte das hin und herrechnen mit Powervektoren deutlich leichter machen
    
    function PowerinLinse(M, J0, J45) {
        var Sph = M + Math.sqrt(J0 * J0 + J45 * J45);
        var Cyl = -2 * Math.sqrt(J0 * J0 + J45 * J45);
        var A = 0.5 * Math.atan(J45 / J0);
        
        A = A * (180 / Math.PI);

        if (A + (J0 < 0 ? 0 : 90) < 0) {
            A = A + (J0 < 0 ? 0 : 90) + 180;
        } else {
            A = A + (J0 < 0 ? 0 : 90);
        }

        if (A <= 90) {
            A = A + 90;
        } else {
            A = A - 90;
        }

        A = Math.round(A);
        if (J45==0 && J0==0){A=0;}

        return {
            Sph: Sph,
            Cyl: Cyl,
            A: A
        };
    }

    function LinseinPower(Sph, Cyl, A) {
    	A = A/180*Math.PI;
        var M = Sph + Cyl / 2;
        var J0 = -1 * Cyl / 2 * Math.cos(2 * A);
        var J45 = -1 * Cyl / 2 * Math.sin(2 * A);

        if(Cyl==0){J0=0;J45=0;}
        return {
            M: M,
            J0: J0,
            J45: J45
        };
    }
