

        // Event-Listener für die ?-Button zum Öffnen
        document.getElementById('btHelpSt').onclick = function() {
            openModal('modHelpSt');
        };
        document.getElementById('btHelpPl').onclick = function() {
            openModal('modHelpPl');
        };
        document.getElementById('btHelpFl').onclick = function() {
            openModal('modHelpFl');
        };

      
        
        var Mueller = "Quelle: Müller-Treiber, A. (2017) Kontaktlinsen Know-how. 4. Aufl. Heidelberg: DOZ. ISBN 978-3-942873-17-8";
        // document.getElementById('Müller').textContent = Mueller;
        document.querySelectorAll('.Mueller').forEach(element => {
         element.textContent = Mueller;
     });
