

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

