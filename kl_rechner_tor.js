let ExnAlt = 0;
let RFlnAlt = 0;
let KLDurchAlt = 0;


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

    if (!selectElement || !selectElement.options || selectElement.selectedIndex < 0) {
        console.warn("Material-Select nicht verfügbar.");
        return;
    }

    const materialValue = selectElement.options[selectElement.selectedIndex].value;
    console.log("Material:", materialValue);

    var Mat = parseFloat(materialValue);
		
    	
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
		const materialValue2 = document.getElementById('Material').value;
		
		let nKl = materialValue2;
		
		if (nKl === "Ind") {
		    nKl = parseFloat(document.getElementById("nKl").value);
		} else {
		    nKl = parseFloat(nKl);
		}

    	
		nKl = document.getElementById("Material").value;
    	
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





function initKlRechnerTorEvents() {

    // Asta
    const AstaEl = document.getElementById('Asta');
    if (AstaEl) AstaEl.addEventListener('input', Asta);

    // Afla
    const AflaEl = document.getElementById('Afla');
    if (AflaEl) AflaEl.addEventListener('input', Afla);

    // Initialwerte setzen
    const ExMlEl = document.getElementById('ExMl');
    if (ExMlEl) ExnAlt = parseFloat(ExMlEl.value) || 0;

    const RflnEl = document.getElementById('Rfln');
    if (RflnEl) RFlnAlt = parseFloat(RflnEl.value) || 0;

    const KLDEl = document.getElementById('KLDurchmesser');
    if (KLDEl) KLDurchAlt = parseFloat(KLDEl.value) || 0;

    // Exzentrizität
    const ExaEl = document.getElementById('Exa');
    if (ExaEl) ExaEl.addEventListener('input', Exo);

    // ExMl Listener
    if (ExMlEl) {
        ExMlEl.addEventListener('input', function() {
            if (document.getElementById('checkExn').checked) {
                const Exn = parseFloat(this.value);
                const Delta = Exn - ExnAlt;

                const Rfl = document.getElementById('Rfln');
                Rfl.value = Math.round((parseFloat(Rfl.value) - Delta) * 20) / 20;

                ExnAlt = Exn;
            }
        });
    }

    // KLDurchmesser Listener
    if (KLDEl) {
        KLDEl.addEventListener('input', function() {
            if (document.getElementById('checkExn').checked) {
                const KLDn = parseFloat(this.value);
                const Delta = KLDn - KLDurchAlt;
                const Exn = parseFloat(document.getElementById('ExMl').value);

                const Rfl = document.getElementById('Rfln');

                if (Exn === 0 && Math.abs(Delta) >= 0.25) {
                    Rfl.value = Math.round((parseFloat(Rfl.value) + Delta / 5) * 20) / 20;
                    KLDurchAlt = KLDn;
                }
            }
        });
    }

    // Rfln Listener
    if (RflnEl) {
        RflnEl.addEventListener('input', function() {
            if (document.getElementById('checkExn').checked) {
                const Rfl = parseFloat(this.value);
                const Delta = Rfl - RFlnAlt;

                const Exn = document.getElementById('ExMl');
                Exn.value = Math.round((parseFloat(Exn.value) - Delta) * 20) / 20;

                RFlnAlt = Rfl;
            }
        });
    }

    // Design-Auswahl
    const DesignEl = document.getElementById('Design');
    if (DesignEl) {
        DesignEl.addEventListener('change', function() {
            const selectedValue = this.value;
            const Rfln = document.getElementById('RFN');
            const Rstn = document.getElementById('RSN');

            Rfln.classList.add('hide');
            Rstn.classList.add('hide');

            if (selectedValue === 'RT' || selectedValue === 'BTC') {
                Rfln.classList.remove('hide');
                Rstn.classList.remove('hide');
                RFNLabel.textContent = "Radius flach (mm)";
                RSNLabel.textContent = "Radius steil (mm)";
            } else if (selectedValue === 'SPH') {
                Rfln.classList.remove('hide');
                RFNLabel.textContent = "Radius (mm)";
            }
        });
    }

    // Material-Auswahl
    const MaterialEl = document.getElementById('Material');
    if (MaterialEl) {
        MaterialEl.addEventListener('change', function() {
            const nKl = document.getElementById('nKlContainer');
            nKl.classList.toggle('hide', this.value !== 'Ind');
        });
    }
}


function initKlTorModalEvents() {

    const modalPairs = [
        ['btHelpFD', 'modHelpFD'],
        ['btHelpSph', 'modHelpSph'],
        ['btHelpEx', 'modHelpEx'],
        ['btHelpExa', 'modHelpEx'],   // gleiche Modal-ID wie btHelpEx
        ['btHelpDSA', 'modHelpDSA'],
        ['btHelpAnpass', 'modHelpAnpass'],
        ['btHelpDurch', 'modHelpDurch']
    ];

    modalPairs.forEach(([btnId, modalId]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.onclick = () => openModal(modalId);
        }
    });
}

   
    

    
    function changeFontSize(delta) {
        var cells = document.getElementsByTagName('td');
        for (var i = 0; i < cells.length; i++) {
            var currentSize = parseInt(window.getComputedStyle(cells[i], null).getPropertyValue('font-size')) || 10;
            var newSize = currentSize + delta;
            cells[i].style.fontSize = newSize + 'px';
        }
    }
    
  

  

   
  // Speichern und Laden der Daten
    function Speichern1() {
    localStorage.setItem("Rfla1", document.getElementById("Rfla").value);
    localStorage.setItem("Rsta1", document.getElementById("Rsta").value);
    localStorage.setItem("Afla1", document.getElementById("Afla").value);
    localStorage.setItem("Asta1", document.getElementById("Asta").value);
    localStorage.setItem("SPHa1", document.getElementById("SPHa").value);
    localStorage.setItem("CYLa1", document.getElementById("CYLa").value);
    localStorage.setItem("Aa1", document.getElementById("Aa").value);
    localStorage.setItem("HSAa1", document.getElementById("HSAa").value);
    localStorage.setItem("Durchm1", document.getElementById("Durchm").value);
    localStorage.setItem("Exa1", document.getElementById("Exa").value);
    localStorage.setItem("Material1", document.getElementById("Material").value);
    localStorage.setItem("Design1", document.getElementById("Design").value);
    localStorage.setItem("Rfln1", document.getElementById("Rfln").value);
    localStorage.setItem("Rstn1", document.getElementById("Rstn").value);
    localStorage.setItem("SphMl1", document.getElementById("SphMl").value);
    localStorage.setItem("ExMl1", document.getElementById("ExMl").value);
    localStorage.setItem("DSA1", document.getElementById("DSA").value);
    localStorage.setItem("KLDurchmesser1", document.getElementById("KLDurchmesser").value);
    localStorage.setItem("SPHÜR1", document.getElementById("SPHÜR").value);
    localStorage.setItem("CYLÜR1", document.getElementById("CYLÜR").value);
    localStorage.setItem("AÜR1", document.getElementById("AÜR").value);
    localStorage.setItem("HSAÜ1", document.getElementById("HSAÜ").value);
    localStorage.setItem("SPHKL1", document.getElementById("SPHKL").value);
    localStorage.setItem("CYLKL1", document.getElementById("CYLKL").value);
    localStorage.setItem("AKL1", document.getElementById("AKL").value);
    localStorage.setItem("HS1KL1", document.getElementById("HS1KL").value);
    localStorage.setItem("AFl1", document.getElementById("AFl").value);
    localStorage.setItem("RFl1", document.getElementById("RFl").value);
    localStorage.setItem("HS2KL1", document.getElementById("HS2KL").value);
    localStorage.setItem("ASt1", document.getElementById("ASt").value);
    localStorage.setItem("RSt1", document.getElementById("RSt").value);
    localStorage.setItem("Bestellzyl1", document.getElementById("Bestellzyl").innerText);
    localStorage.setItem("BestellzylV1", document.getElementById("BestellzylV").innerText);
    localStorage.setItem("Überrefraktion1", document.getElementById("Überrefraktion").innerText);
    localStorage.setItem("AugeFL1", document.getElementById("AugeFL").innerText);
    localStorage.setItem("AugeST1", document.getElementById("AugeST").innerText);
    localStorage.setItem("TLFL1", document.getElementById("TLFL").innerText);
    localStorage.setItem("TLST1", document.getElementById("TLST").innerText);
    localStorage.setItem("KLFL1", document.getElementById("KLFL").innerText);
    localStorage.setItem("KLST1", document.getElementById("KLST").innerText);
    localStorage.setItem("ÜRFL1", document.getElementById("ÜRFL").innerText);
    localStorage.setItem("ÜRST1", document.getElementById("ÜRST").innerText);
    localStorage.setItem("AstiG1", document.getElementById("AstiG").innerText);
    localStorage.setItem("AstiHH1", document.getElementById("AstiHH").innerText);
    localStorage.setItem("AstiI1", document.getElementById("AstiI").innerText);
    localStorage.setItem("IndKLAst1", document.getElementById("IndKLAst").innerText);
    localStorage.setItem("IndKLAstBTC1", document.getElementById("IndKLAstBTC").innerText);
    localStorage.setItem("IndLuftAst1", document.getElementById("IndLuftAst").innerText);
    localStorage.setItem("IndLuftAstBTC1", document.getElementById("IndLuftAstBTC").innerText);
    localStorage.setItem("Messlinse1", document.getElementById("Messlinse").innerText);
    localStorage.setItem("Anpassung1", document.getElementById("Anpassung").innerText);
    localStorage.setItem("ExtraTipp1", document.getElementById('ExtraTipp').innerText);
    localStorage.setItem("ExtraTipp21", document.getElementById('ExtraTipp2').innerText);
    localStorage.setItem("BTCSphäre1", document.getElementById('BTCSphäre').innerText);
    localStorage.setItem("radiusFlach1", document.getElementById('radiusFlach').innerText);
    localStorage.setItem("radiusSteil1", document.getElementById('radiusSteil').innerText);
    localStorage.setItem("ZVorderfläche1", document.getElementById('ZVorderfläche').innerText);
    localStorage.setItem("ZRückfläche1", document.getElementById('ZRückfläche').innerText);
    localStorage.setItem("ZInsgesamt1", document.getElementById('ZInsgesamt').innerText);
    
    alert("Werte für Anpassung 1 gespeichert!");
}


    function Laden1() {
        document.getElementById("Rfla").value = localStorage.getItem("Rfla1");
        document.getElementById("Rsta").value = localStorage.getItem("Rsta1");
        document.getElementById("Afla").value = localStorage.getItem("Afla1");
        document.getElementById("Asta").value = localStorage.getItem("Asta1");
        document.getElementById("SPHa").value = localStorage.getItem("SPHa1");
        document.getElementById("CYLa").value = localStorage.getItem("CYLa1");
        document.getElementById("Aa").value = localStorage.getItem("Aa1");
        document.getElementById("HSAa").value = localStorage.getItem("HSAa1");
        document.getElementById("Durchm").value = localStorage.getItem("Durchm1");
        document.getElementById("Exa").value = localStorage.getItem("Exa1");
        document.getElementById("Material").value = localStorage.getItem("Material1");
        document.getElementById("Design").value = localStorage.getItem("Design1");
        document.getElementById("Rfln").value = localStorage.getItem("Rfln1");
        document.getElementById("Rstn").value = localStorage.getItem("Rstn1");
        document.getElementById("SphMl").value = localStorage.getItem("SphMl1");
        document.getElementById("ExMl").value = localStorage.getItem("ExMl1");
        document.getElementById("DSA").value = localStorage.getItem("DSA1");
        document.getElementById("KLDurchmesser").value = localStorage.getItem("KLDurchmesser1");
        document.getElementById("SPHÜR").value = localStorage.getItem("SPHÜR1");
        document.getElementById("CYLÜR").value = localStorage.getItem("CYLÜR1");
        document.getElementById("AÜR").value = localStorage.getItem("AÜR1");
        document.getElementById("HSAÜ").value = localStorage.getItem("HSAÜ1");
        document.getElementById("SPHKL").value = localStorage.getItem("SPHKL1");
        document.getElementById("CYLKL").value = localStorage.getItem("CYLKL1");
        document.getElementById("AKL").value = localStorage.getItem("AKL1");
        document.getElementById("HS1KL").value = localStorage.getItem("HS1KL1");
        document.getElementById("AFl").value = localStorage.getItem("AFl1");
        document.getElementById("RFl").value = localStorage.getItem("RFl1");
        document.getElementById("HS2KL").value = localStorage.getItem("HS2KL1");
        document.getElementById("ASt").value = localStorage.getItem("ASt1");
        document.getElementById("RSt").value = localStorage.getItem("RSt1");
        document.getElementById("Bestellzyl").innerText = localStorage.getItem("Bestellzyl1");
        document.getElementById("BestellzylV").innerText = localStorage.getItem("BestellzylV1");
        document.getElementById("Überrefraktion").innerText = localStorage.getItem("Überrefraktion1");
        document.getElementById("AugeFL").innerText = localStorage.getItem("AugeFL1");
        document.getElementById("AugeST").innerText = localStorage.getItem("AugeST1");
        document.getElementById("TLFL").innerText = localStorage.getItem("TLFL1");
        document.getElementById("TLST").innerText = localStorage.getItem("TLST1");
        document.getElementById("KLFL").innerText = localStorage.getItem("KLFL1");
        document.getElementById("KLST").innerText = localStorage.getItem("KLST1");
        document.getElementById("ÜRFL").innerText = localStorage.getItem("ÜRFL1");
        document.getElementById("ÜRST").innerText = localStorage.getItem("ÜRST1");
        document.getElementById("AstiG").innerText = localStorage.getItem("AstiG1");
        document.getElementById("AstiHH").innerText = localStorage.getItem("AstiHH1");
        document.getElementById("AstiI").innerText = localStorage.getItem("AstiI1");
        document.getElementById("IndKLAst").innerText = localStorage.getItem("IndKLAst1");
        document.getElementById("IndKLAstBTC").innerText = localStorage.getItem("IndKLAstBTC1");
        document.getElementById("IndLuftAst").innerText = localStorage.getItem("IndLuftAst1");
        document.getElementById("IndLuftAstBTC").innerText = localStorage.getItem("IndLuftAstBTC1");
        document.getElementById("Messlinse").innerText = localStorage.getItem("Messlinse1");
        document.getElementById("Anpassung").innerText = localStorage.getItem("Anpassung1");
        document.getElementById("ExtraTipp").innerText = localStorage.getItem("ExtraTipp1");
        document.getElementById("ExtraTipp2").innerText = localStorage.getItem("ExtraTipp21");
        document.getElementById("BTCSphäre").innerText = localStorage.getItem("BTCSphäre1");
        document.getElementById("radiusFlach").innerText = localStorage.getItem("radiusFlach1");
        document.getElementById("radiusSteil").innerText = localStorage.getItem("radiusSteil1");
        document.getElementById("ZVorderfläche").innerText = localStorage.getItem("ZVorderfläche1");
        document.getElementById("ZRückfläche").innerText = localStorage.getItem("ZRückfläche1");
        document.getElementById("ZInsgesamt").innerText = localStorage.getItem("ZInsgesamt1");
        alert("Werte für Anpassung 1 geladen!");
    }

    function Speichern2() {
        localStorage.setItem("Rfla2", document.getElementById("Rfla").value);
        localStorage.setItem("Rsta2", document.getElementById("Rsta").value);
        localStorage.setItem("Afla2", document.getElementById("Afla").value);
        localStorage.setItem("Asta2", document.getElementById("Asta").value);
        localStorage.setItem("SPHa2", document.getElementById("SPHa").value);
        localStorage.setItem("CYLa2", document.getElementById("CYLa").value);
        localStorage.setItem("Aa2", document.getElementById("Aa").value);
        localStorage.setItem("HSAa2", document.getElementById("HSAa").value);
        localStorage.setItem("Durchm2", document.getElementById("Durchm").value);
        localStorage.setItem("Exa2", document.getElementById("Exa").value);
        localStorage.setItem("Material2", document.getElementById("Material").value);
        localStorage.setItem("Design2", document.getElementById("Design").value);
        localStorage.setItem("Rfln2", document.getElementById("Rfln").value);
        localStorage.setItem("Rstn2", document.getElementById("Rstn").value);
        localStorage.setItem("SphMl2", document.getElementById("SphMl").value);
        localStorage.setItem("ExMl2", document.getElementById("ExMl").value);
        localStorage.setItem("DSA2", document.getElementById("DSA").value);
        localStorage.setItem("KLDurchmesser2", document.getElementById("KLDurchmesser").value);
        localStorage.setItem("SPHÜR2", document.getElementById("SPHÜR").value);
        localStorage.setItem("CYLÜR2", document.getElementById("CYLÜR").value);
        localStorage.setItem("AÜR2", document.getElementById("AÜR").value);
        localStorage.setItem("HSAÜ2", document.getElementById("HSAÜ").value);
        localStorage.setItem("SPHKL2", document.getElementById("SPHKL").value);
        localStorage.setItem("CYLKL2", document.getElementById("CYLKL").value);
        localStorage.setItem("AKL2", document.getElementById("AKL").value);
        localStorage.setItem("HS1KL2", document.getElementById("HS1KL").value);
        localStorage.setItem("AFl2", document.getElementById("AFl").value);
        localStorage.setItem("RFl2", document.getElementById("RFl").value);
        localStorage.setItem("HS2KL2", document.getElementById("HS2KL").value);
        localStorage.setItem("ASt2", document.getElementById("ASt").value);
        localStorage.setItem("RSt2", document.getElementById("RSt").value);
        localStorage.setItem("Bestellzyl2", document.getElementById("Bestellzyl").innerText);
        localStorage.setItem("BestellzylV2", document.getElementById("BestellzylV").innerText);
        localStorage.setItem("Überrefraktion2", document.getElementById("Überrefraktion").innerText);
        localStorage.setItem("AugeFL2", document.getElementById("AugeFL").innerText);
        localStorage.setItem("AugeST2", document.getElementById("AugeST").innerText);
        localStorage.setItem("TLFL2", document.getElementById("TLFL").innerText);
        localStorage.setItem("TLST2", document.getElementById("TLST").innerText);
        localStorage.setItem("KLFL2", document.getElementById("KLFL").innerText);
        localStorage.setItem("KLST2", document.getElementById("KLST").innerText);
        localStorage.setItem("ÜRFL2", document.getElementById("ÜRFL").innerText);
        localStorage.setItem("ÜRST2", document.getElementById("ÜRST").innerText);
        localStorage.setItem("AstiG2", document.getElementById("AstiG").innerText);
        localStorage.setItem("AstiHH2", document.getElementById("AstiHH").innerText);
        localStorage.setItem("AstiI2", document.getElementById("AstiI").innerText);
        localStorage.setItem("IndKLAst2", document.getElementById("IndKLAst").innerText);
        localStorage.setItem("IndKLAstBTC2", document.getElementById("IndKLAstBTC").innerText);
        localStorage.setItem("IndLuftAst2", document.getElementById("IndLuftAst").innerText);
        localStorage.setItem("IndLuftAstBTC2", document.getElementById("IndLuftAstBTC").innerText);
        localStorage.setItem("Messlinse2", document.getElementById("Messlinse").innerText);
        localStorage.setItem("Anpassung2", document.getElementById("Anpassung").innerText);
        localStorage.setItem("ExtraTipp2", document.getElementById('ExtraTipp').innerText);
        localStorage.setItem("ExtraTipp22", document.getElementById('ExtraTipp2').innerText);
        localStorage.setItem("BTCSphäre2", document.getElementById('BTCSphäre').innerText);
        localStorage.setItem("radiusFlach2", document.getElementById('radiusFlach').innerText);
        localStorage.setItem("radiusSteil2", document.getElementById('radiusSteil').innerText);
        localStorage.setItem("ZVorderfläche2", document.getElementById('ZVorderfläche').innerText);
        localStorage.setItem("ZRückfläche2", document.getElementById('ZRückfläche').innerText);
        localStorage.setItem("ZInsgesamt2", document.getElementById('ZInsgesamt').innerText);
        
        
        alert("Werte für Anpassung 2 gespeichert!");
    }


    function Laden2() {
        document.getElementById("Rfla").value = localStorage.getItem("Rfla2");
        document.getElementById("Rsta").value = localStorage.getItem("Rsta2");
        document.getElementById("Afla").value = localStorage.getItem("Afla2");
        document.getElementById("Asta").value = localStorage.getItem("Asta2");
        document.getElementById("SPHa").value = localStorage.getItem("SPHa2");
        document.getElementById("CYLa").value = localStorage.getItem("CYLa2");
        document.getElementById("Aa").value = localStorage.getItem("Aa2");
        document.getElementById("HSAa").value = localStorage.getItem("HSAa2");
        document.getElementById("Durchm").value = localStorage.getItem("Durchm2");
        document.getElementById("Exa").value = localStorage.getItem("Exa2");
        document.getElementById("Material").value = localStorage.getItem("Material2");
        document.getElementById("Design").value = localStorage.getItem("Design2");
        document.getElementById("Rfln").value = localStorage.getItem("Rfln2");
        document.getElementById("Rstn").value = localStorage.getItem("Rstn2");
        document.getElementById("SphMl").value = localStorage.getItem("SphMl2");
        document.getElementById("ExMl").value = localStorage.getItem("ExMl2");
        document.getElementById("DSA").value = localStorage.getItem("DSA2");
        document.getElementById("KLDurchmesser").value = localStorage.getItem("KLDurchmesser2");
        document.getElementById("SPHÜR").value = localStorage.getItem("SPHÜR2");
        document.getElementById("CYLÜR").value = localStorage.getItem("CYLÜR2");
        document.getElementById("AÜR").value = localStorage.getItem("AÜR2");
        document.getElementById("HSAÜ").value = localStorage.getItem("HSAÜ2");
        document.getElementById("SPHKL").value = localStorage.getItem("SPHKL2");
        document.getElementById("CYLKL").value = localStorage.getItem("CYLKL2");
        document.getElementById("AKL").value = localStorage.getItem("AKL2");
        document.getElementById("HS1KL").value = localStorage.getItem("HS1KL2");
        document.getElementById("AFl").value = localStorage.getItem("AFl2");
        document.getElementById("RFl").value = localStorage.getItem("RFl2");
        document.getElementById("HS2KL").value = localStorage.getItem("HS2KL2");
        document.getElementById("ASt").value = localStorage.getItem("ASt2");
        document.getElementById("RSt").value = localStorage.getItem("RSt2");
        document.getElementById("Bestellzyl").innerText = localStorage.getItem("Bestellzyl2");
        document.getElementById("BestellzylV").innerText = localStorage.getItem("BestellzylV2");
        document.getElementById("Überrefraktion").innerText = localStorage.getItem("Überrefraktion2");
        document.getElementById("AugeFL").innerText = localStorage.getItem("AugeFL2");
        document.getElementById("AugeST").innerText = localStorage.getItem("AugeST2");
        document.getElementById("TLFL").innerText = localStorage.getItem("TLFL2");
        document.getElementById("TLST").innerText = localStorage.getItem("TLST2");
        document.getElementById("KLFL").innerText = localStorage.getItem("KLFL2");
        document.getElementById("KLST").innerText = localStorage.getItem("KLST2");
        document.getElementById("ÜRFL").innerText = localStorage.getItem("ÜRFL2");
        document.getElementById("ÜRST").innerText = localStorage.getItem("ÜRST2");
        document.getElementById("AstiG").innerText = localStorage.getItem("AstiG2");
        document.getElementById("AstiHH").innerText = localStorage.getItem("AstiHH2");
        document.getElementById("AstiI").innerText = localStorage.getItem("AstiI2");
        document.getElementById("IndKLAst").innerText = localStorage.getItem("IndKLAst2");
        document.getElementById("IndKLAstBTC").innerText = localStorage.getItem("IndKLAstBTC2");
        document.getElementById("IndLuftAst").innerText = localStorage.getItem("IndLuftAst2");
        document.getElementById("IndLuftAstBTC").innerText = localStorage.getItem("IndLuftAstBTC2");
        document.getElementById("Messlinse").innerText = localStorage.getItem("Messlinse2");
        document.getElementById("Anpassung").innerText = localStorage.getItem("Anpassung2");
        document.getElementById("ExtraTipp").innerText = localStorage.getItem("ExtraTipp2");
        document.getElementById("ExtraTipp2").innerText = localStorage.getItem("ExtraTipp22");
        document.getElementById("BTCSphäre").innerText = localStorage.getItem("BTCSphäre2");
        document.getElementById("radiusFlach").innerText = localStorage.getItem("radiusFlach2");
        document.getElementById("radiusSteil").innerText = localStorage.getItem("radiusSteil2");
        document.getElementById("ZVorderfläche").innerText = localStorage.getItem("ZVorderfläche2");
        document.getElementById("ZRückfläche").innerText = localStorage.getItem("ZRückfläche2");
        document.getElementById("ZInsgesamt").innerText = localStorage.getItem("ZInsgesamt2");
        alert("Werte für Anpassung 2 geladen!");
    }


    function Speichern3() {
        localStorage.setItem("Rfla3", document.getElementById("Rfla").value);
        localStorage.setItem("Rsta3", document.getElementById("Rsta").value);
        localStorage.setItem("Afla3", document.getElementById("Afla").value);
        localStorage.setItem("Asta3", document.getElementById("Asta").value);
        localStorage.setItem("SPHa3", document.getElementById("SPHa").value);
        localStorage.setItem("CYLa3", document.getElementById("CYLa").value);
        localStorage.setItem("Aa3", document.getElementById("Aa").value);
        localStorage.setItem("HSAa3", document.getElementById("HSAa").value);
        localStorage.setItem("Durchm3", document.getElementById("Durchm").value);
        localStorage.setItem("Exa3", document.getElementById("Exa").value);
        localStorage.setItem("Material3", document.getElementById("Material").value);
        localStorage.setItem("Design3", document.getElementById("Design").value);
        localStorage.setItem("Rfln3", document.getElementById("Rfln").value);
        localStorage.setItem("Rstn3", document.getElementById("Rstn").value);
        localStorage.setItem("SphMl3", document.getElementById("SphMl").value);
        localStorage.setItem("ExMl3", document.getElementById("ExMl").value);
        localStorage.setItem("DSA3", document.getElementById("DSA").value);
        localStorage.setItem("KLDurchmesser3", document.getElementById("KLDurchmesser").value);
        localStorage.setItem("SPHÜR3", document.getElementById("SPHÜR").value);
        localStorage.setItem("CYLÜR3", document.getElementById("CYLÜR").value);
        localStorage.setItem("AÜR3", document.getElementById("AÜR").value);
        localStorage.setItem("HSAÜ3", document.getElementById("HSAÜ").value);
        localStorage.setItem("SPHKL3", document.getElementById("SPHKL").value);
        localStorage.setItem("CYLKL3", document.getElementById("CYLKL").value);
        localStorage.setItem("AKL3", document.getElementById("AKL").value);
        localStorage.setItem("HS1KL3", document.getElementById("HS1KL").value);
        localStorage.setItem("AFl3", document.getElementById("AFl").value);
        localStorage.setItem("RFl3", document.getElementById("RFl").value);
        localStorage.setItem("HS2KL3", document.getElementById("HS2KL").value);
        localStorage.setItem("ASt3", document.getElementById("ASt").value);
        localStorage.setItem("RSt3", document.getElementById("RSt").value);
        localStorage.setItem("Bestellzyl3", document.getElementById("Bestellzyl").innerText);
        localStorage.setItem("BestellzylV3", document.getElementById("BestellzylV").innerText);
        localStorage.setItem("Überrefraktion3", document.getElementById("Überrefraktion").innerText);
        localStorage.setItem("AugeFL3", document.getElementById("AugeFL").innerText);
        localStorage.setItem("AugeST3", document.getElementById("AugeST").innerText);
        localStorage.setItem("TLFL3", document.getElementById("TLFL").innerText);
        localStorage.setItem("TLST3", document.getElementById("TLST").innerText);
        localStorage.setItem("KLFL3", document.getElementById("KLFL").innerText);
        localStorage.setItem("KLST3", document.getElementById("KLST").innerText);
        localStorage.setItem("ÜRFL3", document.getElementById("ÜRFL").innerText);
        localStorage.setItem("ÜRST3", document.getElementById("ÜRST").innerText);
        localStorage.setItem("AstiG3", document.getElementById("AstiG").innerText);
        localStorage.setItem("AstiHH3", document.getElementById("AstiHH").innerText);
        localStorage.setItem("AstiI3", document.getElementById("AstiI").innerText);
        localStorage.setItem("IndKLAst3", document.getElementById("IndKLAst").innerText);
        localStorage.setItem("IndKLAstBTC3", document.getElementById("IndKLAstBTC").innerText);
        localStorage.setItem("IndLuftAst3", document.getElementById("IndLuftAst").innerText);
        localStorage.setItem("IndLuftAstBTC3", document.getElementById("IndLuftAstBTC").innerText);
        localStorage.setItem("Messlinse3", document.getElementById("Messlinse").innerText);
        localStorage.setItem("Anpassung3", document.getElementById("Anpassung").innerText);
        localStorage.setItem("ExtraTipp3", document.getElementById('ExtraTipp').innerText);
        localStorage.setItem("ExtraTipp23", document.getElementById('ExtraTipp2').innerText);
        localStorage.setItem("BTCSphäre3", document.getElementById('BTCSphäre').innerText);
        localStorage.setItem("radiusFlach3", document.getElementById('radiusFlach').innerText);
        localStorage.setItem("radiusSteil3", document.getElementById('radiusSteil').innerText);
        localStorage.setItem("ZVorderfläche3", document.getElementById('ZVorderfläche').innerText);
        localStorage.setItem("ZRückfläche3", document.getElementById('ZRückfläche').innerText);
        localStorage.setItem("ZInsgesamt3", document.getElementById('ZInsgesamt').innerText);
        
        alert("Werte für Anpassung 3 gespeichert!");
    }


    function Laden3() {
        document.getElementById("Rfla").value = localStorage.getItem("Rfla3");
        document.getElementById("Rsta").value = localStorage.getItem("Rsta3");
        document.getElementById("Afla").value = localStorage.getItem("Afla3");
        document.getElementById("Asta").value = localStorage.getItem("Asta3");
        document.getElementById("SPHa").value = localStorage.getItem("SPHa3");
        document.getElementById("CYLa").value = localStorage.getItem("CYLa3");
        document.getElementById("Aa").value = localStorage.getItem("Aa3");
        document.getElementById("HSAa").value = localStorage.getItem("HSAa3");
        document.getElementById("Durchm").value = localStorage.getItem("Durchm3");
        document.getElementById("Exa").value = localStorage.getItem("Exa3");
        document.getElementById("Material").value = localStorage.getItem("Material3");
        document.getElementById("Design").value = localStorage.getItem("Design3");
        document.getElementById("Rfln").value = localStorage.getItem("Rfln3");
        document.getElementById("Rstn").value = localStorage.getItem("Rstn3");
        document.getElementById("SphMl").value = localStorage.getItem("SphMl3");
        document.getElementById("ExMl").value = localStorage.getItem("ExMl3");
        document.getElementById("DSA").value = localStorage.getItem("DSA3");
        document.getElementById("KLDurchmesser").value = localStorage.getItem("KLDurchmesser3");
        document.getElementById("SPHÜR").value = localStorage.getItem("SPHÜR3");
        document.getElementById("CYLÜR").value = localStorage.getItem("CYLÜR3");
        document.getElementById("AÜR").value = localStorage.getItem("AÜR3");
        document.getElementById("HSAÜ").value = localStorage.getItem("HSAÜ3");
        document.getElementById("SPHKL").value = localStorage.getItem("SPHKL3");
        document.getElementById("CYLKL").value = localStorage.getItem("CYLKL3");
        document.getElementById("AKL").value = localStorage.getItem("AKL3");
        document.getElementById("HS1KL").value = localStorage.getItem("HS1KL3");
        document.getElementById("AFl").value = localStorage.getItem("AFl3");
        document.getElementById("RFl").value = localStorage.getItem("RFl3");
        document.getElementById("HS2KL").value = localStorage.getItem("HS2KL3");
        document.getElementById("ASt").value = localStorage.getItem("ASt3");
        document.getElementById("RSt").value = localStorage.getItem("RSt3");
        document.getElementById("Bestellzyl").innerText = localStorage.getItem("Bestellzyl3");
        document.getElementById("BestellzylV").innerText = localStorage.getItem("BestellzylV3");
        document.getElementById("Überrefraktion").innerText = localStorage.getItem("Überrefraktion3");
        document.getElementById("AugeFL").innerText = localStorage.getItem("AugeFL3");
        document.getElementById("AugeST").innerText = localStorage.getItem("AugeST3");
        document.getElementById("TLFL").innerText = localStorage.getItem("TLFL3");
        document.getElementById("TLST").innerText = localStorage.getItem("TLST3");
        document.getElementById("KLFL").innerText = localStorage.getItem("KLFL3");
        document.getElementById("KLST").innerText = localStorage.getItem("KLST3");
        document.getElementById("ÜRFL").innerText = localStorage.getItem("ÜRFL3");
        document.getElementById("ÜRST").innerText = localStorage.getItem("ÜRST3");
        document.getElementById("AstiG").innerText = localStorage.getItem("AstiG3");
        document.getElementById("AstiHH").innerText = localStorage.getItem("AstiHH3");
        document.getElementById("AstiI").innerText = localStorage.getItem("AstiI3");
        document.getElementById("IndKLAst").innerText = localStorage.getItem("IndKLAst3");
        document.getElementById("IndKLAstBTC").innerText = localStorage.getItem("IndKLAstBTC3");
        document.getElementById("IndLuftAst").innerText = localStorage.getItem("IndLuftAst3");
        document.getElementById("IndLuftAstBTC").innerText = localStorage.getItem("IndLuftAstBTC3");
        document.getElementById("Messlinse").innerText = localStorage.getItem("Messlinse3");
        document.getElementById("Anpassung").innerText = localStorage.getItem("Anpassung3");
        document.getElementById("ExtraTipp").innerText = localStorage.getItem("ExtraTipp3");
        document.getElementById("ExtraTipp2").innerText = localStorage.getItem("ExtraTipp23");
        document.getElementById("BTCSphäre").innerText = localStorage.getItem("BTCSphäre3");
        document.getElementById("radiusFlach").innerText = localStorage.getItem("radiusFlach3");
        document.getElementById("radiusSteil").innerText = localStorage.getItem("radiusSteil3");
        document.getElementById("ZVorderfläche").innerText = localStorage.getItem("ZVorderfläche3");
        document.getElementById("ZRückfläche").innerText = localStorage.getItem("ZRückfläche3");
        document.getElementById("ZInsgesamt").innerText = localStorage.getItem("ZInsgesamt3");
        alert("Werte für Anpassung 3 geladen!");
    }

/*
 //Das Flächendesign macht jetzt auch was
 document.getElementById('Design').addEventListener('change', function() {
            var selectedValue = this.value;
            var Rfln = document.getElementById('RFN');
            var Rstn = document.getElementById('RSN');
            
            // Alle Felder verstecken
            Rfln.classList.add('hide');
            Rstn.classList.add('hide');

            if (selectedValue === 'RT') {
                // Zeige beide Felder an
                Rfln.classList.remove('hide');
                Rstn.classList.remove('hide');
                RFNLabel.textContent = "Radius flach (mm)";
                RSNLabel.textContent = "Radius steil (mm)";
                
            } else if (selectedValue === 'SPH') {
                // Zeige nur Feld 1 an
                Rfln.classList.remove('hide');
                RFNLabel.textContent = "Radius (mm)";
            } else if (selectedValue === 'BTC') {
                // Zeige beide Felder an
                Rfln.classList.remove('hide');
                Rstn.classList.remove('hide');
                RFNLabel.textContent = "Radius flach (mm)";
                RSNLabel.textContent = "Radius steil (mm)";
            }
        });

 //Anpassung der Radien bei Exzentrizitätsveränderung mit der Checkbox
 
	 document.getElementById('ExMl').addEventListener('input', function() {
            if (document.getElementById('checkExn').checked) {
                var Exn = parseFloat(this.value);
                var Delta = Exn - ExnAlt;
                var Rfl = document.getElementById('Rfln');
                Rfl.value = parseFloat(Rfl.value) - Delta;
                Rfl.value = Math.round(Rfl.value * 20) / 20;
                ExnAlt = Exn;
            }
        });
 
	 document.getElementById('KLDurchmesser').addEventListener('input', function() {
         if (document.getElementById('checkExn').checked) {
             var KLDn = parseFloat(this.value);
             var Delta = KLDn - KLDurchAlt;
             var Exn = parseFloat(document.getElementById('ExMl').value);
             
             
             var Rfl = document.getElementById('Rfln');
             if(Exn==0){
            	
            	 if (Math.abs(Delta) >=0.25){
             Rfl.value = parseFloat(Rfl.value) + Math.round((Delta/5)*20)/20;
             Rfl.value = Math.round(Rfl.value * 20) / 20;
             KLDurchAlt = KLDn;
             }
            	 
             
             }
         }
     });
	 
	 document.getElementById('Rfln').addEventListener('input', function() {
         if (document.getElementById('checkExn').checked) {
             var Rfl = parseFloat(this.value);
             var Delta = Rfl - RFlnAlt;
             var Exn = document.getElementById('ExMl');
             Exn.value = parseFloat(Exn.value) - Delta;
             Exn.value = Math.round(Exn.value * 20) / 20;
             RFlnAlt = Rfl;
         }
     });


 // Event-Listener für das Eingabefeld Asta
    document.getElementById('Asta').addEventListener('input', Asta);
 
 // Event-Listener für das Eingabefeld Afla
    document.getElementById('Afla').addEventListener('input', Afla);
 
	document.getElementById('Exa').addEventListener('input', Exo);

	    
 //Das Individualfeld wird angezeigt
   document.getElementById('Material').addEventListener('change', function() {
              var selectedValue = this.value;
              var nKl = document.getElementById('nKlContainer');
              
              // Feld verstecken
              nKl.classList.add('hide');

              if (selectedValue === 'Ind') {
                  // Zeige Feld an
                  nKl.classList.remove('hide');
                  
              }
          });
    
	var ExnAlt = parseFloat(document.getElementById('ExMl').value);
	var RFlnAlt = parseFloat(document.getElementById('Rfln').value);
	var KLDurchAlt = parseFloat(document.getElementById('KLDurchmesser').value);
	
	*/


