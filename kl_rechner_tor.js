 
    function ÜberrefraML(){
    	var Rfla, Rsta, Afla, Asta;
    	var Spha, Cyla, Aa, HSAa;
    	var Ma, Mat, Rflml, Rstml, Sphml;
    	var nLuft = 1;
    	var nTL = 1.336;
    	
    	Rfla = parseFloat(document.getElementById('Rfla').value);
    	Rsta = parseFloat(document.getElementById('Rsta').value);
    	Afla = parseFloat(document.getElementById('Afla').value);
    	Asta = parseFloat(document.getElementById('Asta').value);
    	
    	Spha = parseFloat(document.getElementById('SPHa').value);
    	Cyla = parseFloat(document.getElementById('CYLa').value);
    	Aa = parseFloat(document.getElementById('Aa').value);
    	HSAa = parseFloat(document.getElementById('HSAa').value);
    	
    	Rflml = parseFloat(document.getElementById('Rfln').value);
    	Rstml = parseFloat(document.getElementById('Rstn').value);
    	Sphml = parseFloat(document.getElementById('SphMl').value);
    	var DSA = parseFloat(document.getElementById('DSA').value);
    	
    	Ma = document.getElementById('Material').value;
    	var selectElement = document.getElementById('Material');
    	Mat = parseFloat(selectElement.options[selectElement.selectedIndex].value);
    	
    	var nKl = document.getElementById("Material").value;
    	
    	if (nKl==="Ind"){
    		nKl = parseFloat(document.getElementById("nKl").value);
    	} else {
    		nKl = parseFloat(nKl);
    	}
    	
    	var Design = document.getElementById("Design").value;
    	
    	if (Design === 'RT') {

        }  
    	if (Design === 'SPH') {
		Rstml = Rflml;
        } 
    	if (Design === 'BTC') {

        }
    	
    	
    	// Hauptschnitte einlesen
    	var HS1a, HS2a;
    	
    	if (Cyla<=0){
    		HS1a = Spha;
    		HS2a = Spha + Cyla;
    	} else {
    		HS1a = Spha + Cyla;
    		HS2a = Spha;
    	}
    	
    	// HSA einrechnen
    	var HS1a0, HS2a0;
    	var AA;
    	HSAa = HSAa / 1000;
    	
    	HS1a0 = HS1a / (1 - HSAa * HS1a);
    	HS2a0 = HS2a / (1 - HSAa * HS2a);
    	
    	//Zurückrechnung in Minuszylinder
    	var SPHa = HS1a0;
    	var CYLa = HS2a0 - HS1a0;
    	if(Cyla<=0){
    		 AA = Aa;
    	}else{
    		if(Aa<=90){
    			AA = Aa + 90;
    		}else{AA = Aa - 90;}
    		
    	}
    	
    	//Berechnung Power-Vektor für Augenrefraktion Minuszylinder
        var AugePower = LinseinPower(SPHa, CYLa, AA);
        var M_a = AugePower.M;
        var J0_a = AugePower.J0;
    	var J45_a = AugePower.J45;
        
    	// Tränenlinse 
    	var TLF, TLS;
    	
    	//TLF = 1000 * (nLuft - nTL) * (1 / Rfla - 1 / Rflml);
    	//TLS = 1000 * (nLuft - nTL) * (1 / Rsta - 1 / Rstml);
    	
    	TLF = 1000 * ((nTL-nLuft)/Rflml+(nLuft-nTL)/Rfla);
    	TLS = 1000 * ((nTL-nLuft)/Rstml+(nLuft-nTL)/Rsta);
    	
    	// Minuszylinder Refraktion für Tränenlinse 
    	var SphTl = TLF;
    	var CylTl = TLS - TLF;
    	var ATl = Afla;
    	ATl = ATl + DSA //180*Math.PI;
    	
    	//Berechnung der Powervektoren für Tränenlinse
    	var TränePower = LinseinPower(SphTl, CylTl, ATl);
        var M_Tl = TränePower.M;
        var J0_Tl = TränePower.J0;
    	var J45_Tl = TränePower.J45;
    	
     	// Induzierter Asti bei getragener KL
    	var IndKLAsti = 1000 * (nTL - nKl) * ((1 / Rstml) - (1 / Rflml));
    	
    	// Induzierter Asti in Luft
    	var IndLuftAsti = 1000 * (nLuft - nKl) * ((1 / Rstml) - (1 / Rflml));
        
    	console.log('Debug IndAst:', nKl,nLuft, Rstml, Rflml, IndLuftAsti);
    	
        // Berechnung Minuszylinder Refraktion der Messlinse
    	var SphKL = Sphml;
    	var CylKL = IndLuftAsti;
    	
    	if (Design === 'BTC') {
    		
    		var CylKL = CylKL - IndKLAsti;
        }
    	var AKL = Afla + DSA;
    		AKL = AKL;
    	
    	//Für Minuszylinder Refraktion Berechnung der Power Vektoren der KL
    	var MesslinsePower = LinseinPower(SphKL, CylKL, AKL);
        var M_Kl = MesslinsePower.M;
        var J0_Kl = MesslinsePower.J0;
    	var J45_Kl = MesslinsePower.J45;
    	
        
    	// Berechnung der Überrefraktion als Power Vektor
    	var M_Ür =  M_a - M_Tl - M_Kl;
    	var J0_Ür = J0_a - J0_Tl - J0_Kl;
    	var J45_Ür = J45_a -J45_Tl - J45_Kl; 
    	
    	// Zurück in Minuszylinder
    	var RefraÜr = PowerinLinse(M_Ür,J0_Ür,J45_Ür);
    	var ÜSph = RefraÜr.Sph;
    	var ÜCyl = RefraÜr.Cyl;
    	var AÜr = RefraÜr.A;
    	
        var HSAÜ = 0;
    	
        
        console.log('Ergebnis der Auge:', SPHa, CYLa, AA);
        console.log('Ergebnis der TL:', SphTl, CylTl, ATl);
        console.log('Ergebnis der KL:', SphKL, CylKL, AKL);
        console.log('Ergebnis der ÜR:', ÜSph, ÜCyl, AÜr);
        
        console.log('Ergebnis der Auge PV:', M_a, J0_a, J45_a);
        console.log('Ergebnis der TL PV:', M_Tl, J0_Tl, J45_Tl);
        console.log('Ergebnis der KL PV:', M_Kl, J0_Kl, J45_Kl);
        console.log('Ergebnis der ÜR PV:', M_Ür, J0_Ür, J45_Ür, nKl, IndLuftAsti);
        
    	
        // Rundungen
        var RundWert = getRoundingValue();
        ÜSph = round(ÜSph,RundWert);
        ÜCyl = round(ÜCyl,RundWert);
        
       
        // Einspeisen der Werte
        
        document.getElementById('SPHÜR').value = ÜSph;
        document.getElementById('CYLÜR').value = ÜCyl;
        document.getElementById('AÜR').value = AÜr;
        document.getElementById('HSAÜ').value = HSAÜ;
        
    }
    
    //Berechnung der Bestelllinse
    function KLVorschlag(){

		const selectElement = document.getElementById('Material');

    // Wenn das Select nicht existiert → Funktion abbrechen
    if (!selectElement) {
        console.warn("Material-Select existiert nicht (SPA-Seitenwechsel).");
        return;
    }

    // Wenn keine Optionen existieren → abbrechen
    if (!selectElement.options || selectElement.options.length === 0) {
        console.warn("Material-Select hat keine Optionen.");
        return;
    }

    // Wenn kein Eintrag ausgewählt ist → abbrechen
    if (selectElement.selectedIndex < 0) {
        console.warn("Material-Select hat keinen ausgewählten Index.");
        return;
    }

    // Jetzt sicher auslesen
    const materialValue = selectElement.options[selectElement.selectedIndex].value;

    console.log("Material:", materialValue);
		
    	
    	//Einlesen der Daten
    	var nLuft = 1;
    	var nTL = 1.336;
    	var nHH = 1.376;
    	
    	//Kundendaten
    	var Rfla = parseFloat(document.getElementById('Rfla').value);
    	var Rsta = parseFloat(document.getElementById('Rsta').value);
    	var Afla = parseFloat(document.getElementById('Afla').value);
    	var Asta = parseFloat(document.getElementById('Asta').value);
    	
    	var Spha = parseFloat(document.getElementById('SPHa').value);
    	var Cyla = parseFloat(document.getElementById('CYLa').value);
    	var Aa = parseFloat(document.getElementById('Aa').value);
    	var HSAa = parseFloat(document.getElementById('HSAa').value);
    	
    	//Messlinse
    	var Rflml = parseFloat(document.getElementById('Rfln').value);
    	var Rstml = parseFloat(document.getElementById('Rstn').value);
    	var Sphml = parseFloat(document.getElementById('SphMl').value);
    	var DSA = parseFloat(document.getElementById('DSA').value);
    	var ExMl = parseFloat(document.getElementById('ExMl').value);
    	
    	//Überrefra
    	var ÜSph = parseFloat(document.getElementById('SPHÜR').value);
    	var ÜCyl = parseFloat(document.getElementById('CYLÜR').value);
    	var AÜr = parseFloat(document.getElementById('AÜR').value);
    	var HSAÜ = parseFloat(document.getElementById('HSAÜ').value);
    	
    	//Material und Rundung
    	var Ma = document.getElementById('Material').value;
    	//var selectElement = document.getElementById('Material');
    	var Mat = parseFloat(selectElement.options[selectElement.selectedIndex].value);
    	
		var nKl = document.getElementById("Material").value;
    	
    	if (nKl==="Ind"){
    		nKl = parseFloat(document.getElementById("nKl").value);
    	} else {
    		nKl = parseFloat(nKl);
    	}
    	
    	//var nKl = parseFloat(document.getElementById("Material").value);
    	var Design = document.getElementById("Design").value;
    	
    	//Vorschlag der KL
    	
    	
    	var SPHKL //= parseFloat(document.getElementById('SPHKL').value);
    	var CYLKL //= parseFloat(document.getElementById('CYLKL').value);
    	var AKL //= parseFloat(document.getElementById('AKL').value);
    	var HS1KL //= parseFloat(document.getElementById('HS1KL').value);
    	var AFl //= parseFloat(document.getElementById('AFl').value);
    	var RFl //= parseFloat(document.getElementById('RFl').value);
    	var HS2KL //= parseFloat(document.getElementById('HS2KL').value);
    	var ASt //= parseFloat(document.getElementById('ASt').value);
    	var RSt //= parseFloat(document.getElementById('RSt').value);
    	
    	//Für die Detailansicht
    	//Refraktion
    	var AugeFL //= parseFloat(document.getElementById('AugeFL').value);
    	var AugeST //= parseFloat(document.getElementById('AugeST').value);
    	var TLFL //= parseFloat(document.getElementById('TLFL').value);
    	var TLST //= parseFloat(document.getElementById('TLST').value);
    	var KLFL //= parseFloat(document.getElementById('KLFL').value);
    	var KLST //= parseFloat(document.getElementById('KLST').value);
    	var ÜRFL //= parseFloat(document.getElementById('ÜRFL').value);
    	var ÜRST //= parseFloat(document.getElementById('ÜRST').value);
    	
    	//Astigmatismus
    	var AstiG 
    	var AstiHH 
    	var AstiI 
    	
    	//Induzierter Ast der Kontaktlinse
    	var IndKLAst 
    	var IndLuftAst 
    	
    	var RundWert = getRoundingValue();
    	
    	//Berechnungen - mache hier die gleichen rein wie bei der Üref Berechnung
    	
    	if (Design === 'SPH') {
		Rstml = Rflml;
        } 
    	
    	//Einlesen der Überrefraktion
		var HS1Ü, HS2Ü;
    	
    	if (ÜCyl<=0){
    		HS1Ü = ÜSph;
    		HS2Ü = ÜSph + ÜCyl;
    	} else {
    		HS1Ü = ÜSph + ÜCyl;
    		HS2Ü = ÜSph;
    	}
    	
    	// HSA einrechnen
    	var HS1Ü0, HS2Ü0;
    	var AAÜ;
    	HSAÜ = HSAÜ / 1000;
    	
    	HS1Ü0 = HS1Ü / (1 - HSAÜ * HS1Ü);
    	HS2Ü0 = HS2Ü / (1 - HSAÜ * HS2Ü);
    	
    	//Zurückrechnung in Minuszylinder
    	var SPHÜ = HS1Ü0;
    	var CYLÜ = HS2Ü0 - HS1Ü0;
    	if(ÜCyl<=0){
    		 AAÜ = AÜr;
    	}else{
    		if(AÜr<=90){
    			AAÜ = AÜr + 90;
    		}else{AAÜ = AÜr - 90;}
    		
    	}
    	
    	
    	//Berechnung Power-Vektor für Überrefraktion Minuszylinder
    	var ÜrefPower = LinseinPower(SPHÜ, CYLÜ, AAÜ);
        var M_Ür = ÜrefPower.M;
        var J0_Ür = ÜrefPower.J0;
    	var J45_Ür = ÜrefPower.J45;
    	
    	
    	// Hauptschnitte einlesen von Subj. Refraktion
    	var HS1a, HS2a;
    	
    	if (Cyla<=0){
    		HS1a = Spha;
    		HS2a = Spha + Cyla;
    	} else {
    		HS1a = Spha + Cyla;
    		HS2a = Spha;
    	}
    	
    	// HSA einrechnen
    	var HS1a0, HS2a0;
    	var AA;
    	HSAa = HSAa / 1000;
    	
    	HS1a0 = HS1a / (1 - HSAa * HS1a);
    	HS2a0 = HS2a / (1 - HSAa * HS2a);
    	
    	//Zurückrechnung in Minuszylinder
    	var SPHa = HS1a0;
    	var CYLa = HS2a0 - HS1a0;
    	if(Cyla<=0){
    		 AA = Aa;
    	}else{
    		if(Aa<=90){
    			AA = Aa + 90;
    		}else{AA = Aa - 90;}
    		
    	}
    	
    	
    	//Berechnung Power-Vektor für Augenrefraktion Minuszylinder
    	var AugePower = LinseinPower(SPHa, CYLa, AA);
        var M_a = AugePower.M;
        var J0_a = AugePower.J0;
    	var J45_a = AugePower.J45;
    	
    	
    	// Tränenlinse 
    	var TLF, TLS;
    	
    	
    	TLF = 1000 * ((nTL-nLuft)/Rflml+(nLuft-nTL)/Rfla);
    	TLS = 1000 * ((nTL-nLuft)/Rstml+(nLuft-nTL)/Rsta);
    	
    	// Minuszylinder Refraktion für Tränenlinse 
    	var SphTl = TLF;
    	var CylTl = TLS - TLF;
    	var ATl = Afla;
    	ATl = ATl + DSA;
    	
    	//Berechnung der Powervektoren für Tränenlinse
    	var TränePower = LinseinPower(SphTl, CylTl, ATl);
        var M_Tl = TränePower.M;
        var J0_Tl = TränePower.J0;
    	var J45_Tl = TränePower.J45;
    	
     	// Induzierter Asti bei getragener KL
    	var IndKLAst = 1000 * (nTL - nKl) * ((1 / Rstml) - (1 / Rflml));
    	
    	// Induzierter Asti in Luft
    	var IndLuftAst = 1000 * (nLuft - nKl) * ((1 / Rstml) - (1 / Rflml));
        
        // Berechnung Minuszylinder Refraktion der Messlinse
    	var SphKL = Sphml;
    	var CylKL;
    	
    	if (Design === 'BTC') {
    		
    		 CylKL = IndLuftAst - IndKLAst;
        } else {CylKL = IndLuftAst;}
    	
    	var AKL = Afla + DSA;
    	var AKLs = Asta + DSA;
    	
    	
    	//Für Minuszylinder Refraktion Berechnung der Power Vektoren der KL
    	var MesslinsePower = LinseinPower(SphKL, CylKL, AKL);
        var M_Kl = MesslinsePower.M;
        var J0_Kl = MesslinsePower.J0;
    	var J45_Kl = MesslinsePower.J45;
    	
    	//Ermittlung der PowerVektoren nur für die Rückfläche Messlinse
    	var SphMLrück = 0;
    	var CylMLrück = IndLuftAst;
    	
		
    	var MessKLRück = LinseinPower(SphMLrück, CylMLrück, AKL);
        var M_Klr = MessKLRück.M;
        var J0_Klr = MessKLRück.J0;
    	var J45_Klr = MessKLRück.J45;
    	
    	
    	
     // Hornhaut Asti
    	var SphHHAst = 0;
    	AstiHH = 1000 * (nHH - nLuft) * (1 / Rfla - 1 / Rsta);
    	var AstiHHLage = Afla;
    	
    	//Power-Vektor für HH Ast
    	var HHAstPower = LinseinPower(SphHHAst, AstiHH, AstiHHLage);
        var M_HHA = HHAstPower.M;
        var J0_HHA = HHAstPower.J0;
    	var J45_HHA = HHAstPower.J45;
    	
        
        //Refraktion Innen
        var M_HHI = M_a - M_HHA;
        var J0_HHI = J0_a - J0_HHA;
        var J45_HHI = J45_a - J45_HHA;
        
     // Zurück in Minuszylinder Refraktion innener Ast
    	var InnererAstRef = PowerinLinse(M_HHI,J0_HHI,J45_HHI);
    	var SphHHI = InnererAstRef.Sph;
    	var CylHHI = InnererAstRef.Cyl;
    	var AHHI = InnererAstRef.A;
     
       
       //Berechnung der Vorschlagskontaktlinse
       //Erstmal Power Vektoren von Überrefra und Messlinse zusammenrechnen
       var M_KLv = M_Kl + M_Ür;
       var J0_KLv = J0_Kl + J0_Ür;
       var J45_KLv = J45_Kl + J45_Ür;
       
    	// Zurück in Minuszylinder Refraktion Vorschlagslinse
    	var KLVRef = PowerinLinse(M_KLv,J0_KLv,J45_KLv);
    	var SphKLV = KLVRef.Sph;
    	var CylKLV = KLVRef.Cyl;
    	var AKLV = KLVRef.A;
    	var AchseLinse = AKLV;
    	
    	
     // Hauptschnitte einlesen von KL Vorschlag
    	var HS1KLV, HS2KLV;
    	
    	if (CylKLV<=0){
    		HS1KLV = SphKLV;
    		HS2KLV = SphKLV + CylKLV;
    	} else {
    		HS1KLV = SphKLV + CylKLV;
    		HS2KLV = SphKLV;
    	}
      	
       
    	//Brauche den Vektor von ML und Überrefra
    	
    	HS1KL = HS1KLV;
    	AFl = AKLV;
    	
    	RFl = Rflml;
    	HS2KL = HS2KLV;
    	
    	if(AFl<=90){
    		ASt = AFl + 90;
	}else{ASt = AFl - 90;}
    	
    	RSt = Rstml;
    	
    	KLFL = HS1KL;
    	
    	//Refraktion Hauptschnitte
    	AugeFL = HS1a0;
    	var AugeFLage = Aa;
    	AugeST = HS2a0;
    	var AugeSLage; 
    		if(Aa<=90){
    			AugeSLage = Aa + 90;
		}else{AugeSLage = Aa - 90;}
    		
    	TLFL = TLF;
    	var TLFAchse = ATl;
    	TLST = TLS;
    	var TLSAchse;
    	if(TLFAchse<=90){
    		TLSAchse = TLFAchse + 90;
		}else{TLSAchse = TLFAchse - 90;}
    	
    	
    	//Astigmatismus
    	AstiG = CYLa;
    	var AsiGLage = AA;
    	AstiI = CylHHI;
    	
    	//Berechnung der Überrefraktion über den KL Vorschlag
    	//Zuerst: Berechnung der Vektoren für den auf 0,25dpt gerundeten KL Vorschlag
    	var SphKLVrund = Math.round(SphKLV*4)/4;
    	var CylKLVrund = Math.round(CylKLV*4)/4;
    	
    	var KLV_rundPower = LinseinPower(SphKLVrund, CylKLVrund, AKLV);
        var M_KlV = KLV_rundPower.M;
        var J0_KlV = KLV_rundPower.J0;
    	var J45_KlV = KLV_rundPower.J45;
    	
    	
    	//Berechnung des Bestellzylinders für die Vorderfläche
    	var M_CylV =  M_KlV - M_Klr;
    	var J0_CylV = J0_KlV - J0_Klr;
    	var J45_CylV = J45_KlV - J45_Klr;
    	
    	// Zurück in Minuszylinder Refraktion Vorschlagslinse
    	var Zylinder_vornePower = PowerinLinse(M_CylV, J0_CylV, J45_CylV);
    	var SphCylV = Zylinder_vornePower.Sph;
    	var CylCylV = Zylinder_vornePower.Cyl;
    	var ACylV = Zylinder_vornePower.A;
    	
    	ARückfläche = AKL; 
    	
    	
    	//Ab hier mach ich den Kram für die KL Vorschläge
    	
    	var VordererCyl = CylCylV;
    	
    	var Delta = Rfla - Rsta;
    	var KLTipp;
    	
    	//Einspeisen 
    	
    	// Logik des Anpassvorschlags optimiert mit theoretischem Außenzylinder der KL
    	
    	var VCyl = VordererCyl;
    	var ExtraTipp;
    	var ExtraTipp2;
    	
    	if (Math.abs(VCyl) < 0.75 && Delta < 0.3) {
            KLTipp = "RS";
            ExtraTipp = "";
        } else if (Math.abs(VCyl) < 0.75 && Delta >= 0.3 && Delta <= 0.4) {
            KLTipp = "RS / RPT / RT";
            ExtraTipp = "Je nach Stabilisierung der Linse";
        } 
        else if (Math.abs(VCyl) <= 0.5 && Delta > 0.4) {
            KLTipp = "RT";
            ExtraTipp = "";
        }
        else if (Math.abs(VCyl) < 0.75 && Delta > 0.4) {
            KLTipp = "RT";
            ExtraTipp = "evtl. n abändern?";
        } 
        else if (Math.abs(VCyl) >= 0.75 && Delta < 0.3) {
            KLTipp = "VPT";
            ExtraTipp = "";
        } 
        else if (Math.abs(VCyl) >= 0.75 && Delta >= 0.3 && Delta <= 0.4) {
            KLTipp = "VPT / BT";
            ExtraTipp = "Je nach Stabilisierung der Linse";
        } 
        else if (Math.abs(VCyl) >= 0.75 && Delta > 0.4) {
            KLTipp = "BT";
            ExtraTipp = "";
        }
    	
    	//AstiHH
    	if (Math.abs(AstiG) < 0.75 && Math.abs(AstiI) >= 0.63) {
    	    ExtraTipp2 = "evtl. nicht doch lieber eine Weichlinse?";
    	} else if (IndKLAst === 0) {
    	    ExtraTipp2 = "";
    	} else if (Math.abs(VCyl - IndKLAst) <= 0.25) {
    	    ExtraTipp2 = "BTC möglich";
    	} else {
    	    ExtraTipp2 = "";
    	}

    	
    	var Anpass = KLTipp + " " + ExtraTipp + " " + ExtraTipp2;
    	
    	document.getElementById('Anpassung').textContent = KLTipp;
    	document.getElementById('ExtraTipp').textContent = ExtraTipp;
    	document.getElementById('ExtraTipp2').textContent = ExtraTipp2;
    	
    	
    	
        
        var IndKLAstBTC = IndKLAst - IndKLAst;
     	var IndLuftAstBTC = IndLuftAst - IndKLAst;
     	
       
     	//Induzierter Ast
    	IndKLAst = round(IndKLAst,RundWert);
        IndLuftAst = round(IndLuftAst,RundWert);
        
        IndLuftAstBTC = round(IndLuftAstBTC,RundWert);
        VordererCyl = round(VordererCyl,RundWert);
        
      //Legen der Werte in den Text
    	var BestellzylText = "Rückfläche: " + IndLuftAst + " dpt in " + ARückfläche + "°";
    	var BestellzylVText = "Vorderfläche: " + VordererCyl + " dpt in " + ACylV + "°";
    	
    	
        
    	SphKLV = SphCylV;
		CylKLV = CylCylV;
		AKLV = ACylV;
        
		//Kl Vorschlag
    	SphKLV = Math.round(SphKLV*4)/4;
    	CylKLV = Math.round(CylKLV*4)/4;
    	HS1KL = Math.round(HS1KL*4)/4;
    	HS2KL = Math.round(HS2KL*4)/4;
		
    	
// Anpassung der Bestellwerte!
    	
    	if (KLTipp === "RT" || KLTipp === "RS / RPT / RT" || KLTipp === "RS"){
    		var RTCyl = "";
        	var RTA = "";
    		
    		// HS1 bzw. Sph wird angepasst
    		var VC = VordererCyl;
    		VordererCyl = VordererCyl - VC;
    		var BestellzylVText = "Vorderfläche: " + VordererCyl + " dpt";
    		
    		HS1KL = HS1KL + (VC/2);
    		SphKLV= HS1KL;
    		
    		
    		
    		SphKLV = Math.round(SphKLV*4)/4;
    		HS1KL = Math.round(HS1KL*4)/4;
        	
    		//Rückzylinder ist IndLuftAst
        	
        	HS2KL = HS1KL + IndLuftAst;
        	HS2KL = Math.round(HS2KL*4)/4;
        	
        	//KLV überschreiben
        	
        	var RTKL = LinseinPower(SphKLV, IndLuftAst, AchseLinse);
        	M_KlV = RTKL.M;
            J0_KlV = RTKL.J0;
        	J45_KlV = RTKL.J45;
        	
        	console.log('Test:', SphKLV, IndLuftAst, AchseLinse, VC);
        	
        	CylKLV = RTCyl;
    		AKLV= RTA;
    		
    		
    	}
    	
    	
    	
    	
//Dann die Überrefra berechnung und wieder zurück in Minuszylinder rechnen
    	
    	var M_KLVÜr =  M_a - M_Tl - M_KlV;
    	var J0_KLVÜr = J0_a - J0_Tl - J0_KlV;
    	var J45_KLVÜr = J45_a -J45_Tl - J45_KlV;
    	
    	var KLV_ÜberRef = PowerinLinse(M_KLVÜr,J0_KLVÜr,J45_KLVÜr);
    	var SphKLVÜr = KLV_ÜberRef.Sph;
    	var CylKLVÜr = KLV_ÜberRef.Cyl;
    	var AKLVÜr = KLV_ÜberRef.A;
    	
    	
     // Hauptschnitte einlesen von KL Vorschlag
    	var HS1KLVÜr, HS2KLVÜr;
    	
    	if (CylKLVÜr<=0){
    		HS1KLVÜr = SphKLVÜr;
    		HS2KLVÜr = SphKLVÜr + CylKLVÜr;
    	} else {
    		HS1KLVÜr = SphKLVÜr + CylKLVÜr;
    		HS2KLVÜr = SphKLVÜr;
    	}
    	
    	var AKLVÜrSLage; 
		if(AKLVÜr<=90){
			AKLVÜrSLage = AKLVÜr + 90;
	}else{AKLVÜrSLage = AKLVÜr - 90;}
    	
    	ÜRFL = HS1KLVÜr;
    	ÜRST = HS2KLVÜr;
    	
    	var SÜref = SphKLVÜr;
    	var CÜref = CylKLVÜr;
    	
    	
    	
    	// Debugging Ecke
    	var TestRef = PowerinLinse(M_Klr,J0_Klr,J45_Klr);
    	var SphTest = TestRef.Sph;
    	var CylTest = TestRef.Cyl;
    	var ATest = TestRef.A;
    	
    	
    	
    	console.log('Test Brech:',nKl, SphTest, CylTest, ATest);
    	
    	
    	console.log('Üref fl:', ÜRFL, AKLVÜr);
    	console.log('Üref st:', ÜRST, AKLVÜrSLage);
    	
    	
    	
    	//Und Runden
       
    	
        //var SÜref = Math.round(SphKLVÜr*100)/100;
    	//var CÜref = Math.round(CylKLVÜr*100)/100;
        SÜref = round(SÜref,RundWert);
    	CÜref = round(CÜref,RundWert);
    	
    	
    	
    	
      	//Refraktion
      	AugeFL = round(AugeFL,RundWert);
      	AugeST = round(AugeST,RundWert);
      	TLFL = round(TLFL,RundWert);
      	TLST = round(TLST,RundWert);
      	KLFL = Math.round(HS1KL*4)/4;
      	KLST = Math.round(HS2KL*4)/4;
      	ÜRFL = round(ÜRFL,RundWert);
      	ÜRST = round(ÜRST,RundWert);
      	
    	//Astigmatismus
        AstiG = round(AstiG,RundWert);
        AstiHH = round(AstiHH,RundWert);
        AstiI = round(AstiI,RundWert);
        
        console.log('Teste:', SphKLV, CylKLV, AKL);
    	
    	
    	var ÜberrefText = "Sph " + SÜref + " dpt Cyl " + CÜref + " dpt A " + AKLVÜr + "°";
    	
    	var Augeflach = AugeFL + " dpt in " + AugeFLage + "°";
     	var Augesteil = AugeST + " dpt in " + AugeSLage + "°";
     	var TLflach = TLFL + " dpt in " + TLFAchse + "°";
     	var TLsteil = TLST + " dpt in " + TLSAchse + "°";
     	var KLVflach = HS1KL + " dpt in " + AKL + "°"; //KLFL
     	var KLVsteil = HS2KL + " dpt in " + AKLs + "°"; //KLST
     	var KLVÜrflach = ÜRFL + " dpt in " + AKLVÜr + "°";
     	var KLVÜrsteil = ÜRST + " dpt in " + AKLVÜrSLage + "°";
     	
     	var GesAst = AstiG + " dpt in " + AsiGLage + "°";
     	var HHAst = AstiHH + " dpt in " + AstiHHLage + "°";
     	var HHinn = AstiI + " dpt in " + AHHI + "°";
     	
     	var RT_IKLA = IndKLAst + " dpt in " + AKLs + "°";
     	var RT_ILuA = IndLuftAst + " dpt in " + ARückfläche + "°";
     	
     	
     	var BTC_IKLA = IndKLAstBTC + " dpt in " + AKLs + "°";
     	var BTC_ILuA = IndLuftAstBTC + " dpt in " + ARückfläche + "°";
         
    	
    	//Einspeisen der Werte
    	//Bestellzylinder und Überrefraktion
    	
    	document.getElementById('Bestellzyl').textContent = BestellzylText;
    	document.getElementById('BestellzylV').textContent = BestellzylVText;
    	document.getElementById('Überrefraktion').textContent = ÜberrefText;
    	
    	
    	//Vorschlag KL
    	document.getElementById('SPHKL').value = SphKLV;//
    	document.getElementById('CYLKL').value = CylKLV;//
    	document.getElementById('AKL').value = AKLV;//
    	document.getElementById('HS1KL').value = HS1KL;//
    	document.getElementById('AFl').value = AFl;
    	document.getElementById('RFl').value = RFl;
    	document.getElementById('HS2KL').value = HS2KL;//
    	document.getElementById('ASt').value = ASt;
    	document.getElementById('RSt').value = RSt;
    	
    	//Detailkram
    	//Refraktion
    	
    	
    	
    	document.getElementById('AugeFL').textContent = Augeflach;
    	document.getElementById('AugeST').textContent = Augesteil;
    	document.getElementById('TLFL').textContent = TLflach;
    	document.getElementById('TLST').textContent = TLsteil;
    	document.getElementById('KLFL').textContent = KLVflach;
    	document.getElementById('KLST').textContent = KLVsteil;
    	document.getElementById('ÜRFL').textContent = KLVÜrflach;
    	document.getElementById('ÜRST').textContent = KLVÜrsteil;
    	
    	//Astigmatismus
    	
    	document.getElementById('AstiG').textContent = GesAst;
    	document.getElementById('AstiHH').textContent = HHAst;
    	document.getElementById('AstiI').textContent = HHinn;
    	
    	//Induzierter Ast
    	
    	document.getElementById('IndKLAst').textContent = RT_IKLA;
    	document.getElementById('IndLuftAst').textContent = RT_ILuA;
    	
    	//Für die BTC Linse extra
    	
    	
    	document.getElementById('IndKLAstBTC').textContent = BTC_IKLA;
    	document.getElementById('IndLuftAstBTC').textContent = BTC_ILuA;
    	
    	var BTCSphäre = HS1KL + " dpt";
    	var radiusFlach = RFl + " mm";
    	var radiusSteil = RSt + " mm";
    	document.getElementById('BTCSphäre').textContent = BTCSphäre;
    	document.getElementById('radiusFlach').textContent = radiusFlach;
    	document.getElementById('radiusSteil').textContent = radiusSteil;
    	document.getElementById('ZVorderfläche').textContent = RT_IKLA;
    	document.getElementById('ZRückfläche').textContent = RT_ILuA;
    	document.getElementById('ZInsgesamt').textContent = BTC_ILuA;
    	
    	
    	
    }
    
    
    
    function setRstnMax(){
    	var rfl = document.getElementById('Rfln').value; 
    	var rst = document.getElementById('Rstn').value;
    	if (rfl<rst){rst=rfl}else{}
    	document.getElementById('Rstn').value = rst;
    	document.getElementById('Rstn').max = rfl;
    }
    
    function RstnMax(){
    	const max = document.getElementById('Rfln').value; 
    	document.getElementById('Rstn').max = max;
    }
    
    function setRstaMax(){
    	var rfl = document.getElementById('Rfla').value; 
    	var rst = document.getElementById('Rsta').value;
    	if (rfl<rst){rst=rfl}else{}
    	document.getElementById('Rsta').value = rst;
    	document.getElementById('Rsta').max = rfl;
    }
    
    function RstaMax(){
    	const max = document.getElementById('Rfla').value; 
    	document.getElementById('Rsta').max = max;
    }
    
    function Afla(){
    	document.getElementById('Asta').removeEventListener('input', Asta);
    	
    	var Afl = parseFloat(document.getElementById('Afla').value);
    	var Ast = parseFloat(document.getElementById('Asta').value);
    	
    	if (Afl < 0) {
    	    Afl += 180;
    	} else if (Afl > 180) {
    	    Afl -= 180;
    	}
    	
    	if(Afl<=90){
    		Ast = Afl + 90;
    	}else{Ast=Afl-90;}
    	
    	document.getElementById('Asta').value = Ast;
    	document.getElementById('Afla').value = Afl;
    	document.getElementById('Asta').addEventListener('input', Asta);
    }
 
    
    function Asta(){
    	document.getElementById('Afla').removeEventListener('input', Afla);
    	
    	var Afl = parseFloat(document.getElementById('Afla').value);
    	var Ast = parseFloat(document.getElementById('Asta').value);
    	
    	if (Ast < 0) {
    	    Ast += 180;
    	} else if (Ast > 180) {
    	    Ast -= 180;
    	}
    	
    	if(Ast<=90){
    		Afl = Ast + 90;
    	}else{Afl=Ast-90;}
    	
    	document.getElementById('Afla').value = Afl;
    	document.getElementById('Asta').value = Ast;
    	document.getElementById('Afla').addEventListener('input', Afla);
    }

    
   
 
 // Kram für die Exzentrizität
 function Exo() {
            var Exa = parseFloat(document.getElementById('Exa').value);
            var Exn;
            if (Exa <= 0.3) {
                Exn = 0;
            } else {
                Exn = Exa + 0.1;
                Exn = Math.round(Exn * 20) / 20;
            }
            document.getElementById('ExMl').value = Exn;
            ExnAlt = Exn;
        }


 
 // Für den Radienvorschlag
    function Radienvorschlag() {
            var RFla = parseFloat(document.getElementById('Rfla').value);
            var RSta = parseFloat(document.getElementById('Rsta').value);

            var Dif = RFla - RSta;
            Dif = Math.round(Dif * 20) / 20;
            var RFln, RStn;
            RFln = RFla;
            RFln = Math.round(RFln * 20) / 20;

            console.log('Ergebnis:', Dif);
            
            if (Dif >= 0.35) {
                RStn = RFla - (Dif * 0.8);
                RStn = Math.round(RStn * 20) / 20;
            } else if (Dif > 0.25) {
                RStn = RFln - 0.05;
                RFln = RFln - 0.05;
                RStn = Math.round(RStn * 20) / 20;
                RFln = Math.round(RFln * 20) / 20;
            } else {
                RStn = RFln;
            }
            RFlnAlt = RFln;

            document.getElementById('Rfln').value = RFln;
            document.getElementById('Rstn').value = RStn;
        
 			//Hier kommt die Messlinsenempfehlung rein
 			//Erstmal alles für die Berechnungen einspeisen
            var Afla = parseFloat(document.getElementById('Afla').value);
        	var Asta = parseFloat(document.getElementById('Asta').value);
        	
        	var Spha = parseFloat(document.getElementById('SPHa').value);
        	var Cyla = parseFloat(document.getElementById('CYLa').value);
        	var Aa = parseFloat(document.getElementById('Aa').value);
        	var HSAa = parseFloat(document.getElementById('HSAa').value);
        	
        	var Exa = parseFloat(document.getElementById('Exa').value);
        	
        	var nLuft = 1;
        	var nTL = 1.336;
        	var nHH = 1.376;
        	
        	// Hauptschnitte einlesen von Subj. Refraktion
        	var HS1a, HS2a;
        	
        	if (Cyla<=0){HS1a = Spha;HS2a = Spha + Cyla;} 
        	else {HS1a = Spha + Cyla;HS2a = Spha;}
        	
        	// HSA einrechnen
        	var HS1a0, HS2a0, AA;
        	HSAa = HSAa / 1000;
        	HS1a0 = HS1a / (1 - HSAa * HS1a);
        	HS2a0 = HS2a / (1 - HSAa * HS2a);
        	
        	//Zurückrechnung in Minuszylinder
        	var SPHa = HS1a0;
        	var CYLa = HS2a0 - HS1a0;
        	if(Cyla<=0){ AA = Aa;}else{if(Aa<=90){AA = Aa + 90;}else{AA = Aa - 90;}}
        	
        	
        	//HH Ast
        	var SphHHAst = 0;
        	AstiHH = 1000 * (nHH - nLuft) * (1 / RFla - 1 / RSta);
        	var AstiHHLage = Afla;
        	
        	
        	
        	var Messlinse
        	var Flächendesign
        	var Peripherie
        	if (RFln==RStn){Flächendesign = "rotationssymetrisch";}
        	else {
        		
            	if (CYLa>=AstiHH){Flächendesign = "bitorisch kompensiert";}
            	else //(CYLa<AstiHH)
            	{Flächendesign = "rückflächentorisch";}
        	}
        	
        	if (Exa <= 0.3){Peripherie = "mehrkurvig"}
        	else {Peripherie = "asphärisch"}
        	
        	Messlinse = Flächendesign + " " + Peripherie;
        	document.getElementById('Messlinse').textContent = Messlinse;
        	
        	console.log('Ergebnis:',CYLa, AstiHH);
 }




