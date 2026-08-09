let scene, camera, renderer, controls;
let corneaMesh, klMesh;
let rendererAnimFrameId = null;

function initKLRenderer() {
    const canvasContainer = document.getElementById("rendererCanvas");
    if (!canvasContainer) return;

    // Falls die Seite erneut geladen wird (SPA-Navigation hin und zurück):
    // alten Render-Loop stoppen und alten WebGL-Kontext freigeben, statt sie
    // stillschweigend weiterlaufen zu lassen / zu häufen.
    if (rendererAnimFrameId) {
        cancelAnimationFrame(rendererAnimFrameId);
        rendererAnimFrameId = null;
    }
    if (renderer) {
        renderer.dispose();
    }
    canvasContainer.innerHTML = "";

    if (typeof THREE === 'undefined') {
        canvasContainer.innerHTML = '<p style="padding:20px;color:#900;">3D-Bibliothek (three.js) konnte nicht geladen werden.</p>';
        return;
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const width = canvasContainer.clientWidth || 600;
    const height = canvasContainer.clientHeight || 600;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 25);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    canvasContainer.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.6;
    controls.panSpeed = 0.6;

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(50, 50, 50);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Start-Hornhaut
    corneaMesh = createCapMesh(7.8, 11.5, 0.2, 0x88bbff, 0.45);
    scene.add(corneaMesh);

    // Start-KL
    klMesh = createCapMesh(8.0, 9.6, 0.3, 0xffaa88, 0.5);
    klMesh.position.z = 0.4; // leicht vor der Hornhaut
    scene.add(klMesh);

    // Werte direkt mit den aktuellen Formularfeldern synchronisieren
    updateRendererValues();

    window.removeEventListener('resize', onRendererResize);
    window.addEventListener('resize', onRendererResize);

    function animate() {
        rendererAnimFrameId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

function onRendererResize() {
    const canvasContainer = document.getElementById("rendererCanvas");
    if (!canvasContainer || !renderer || !camera) return;
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight || 600;
    if (!width) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

/**
 * Erstellt eine asphärische "Kappen"-Geometrie direkt im gültigen Radienbereich
 * (r von 0 bis diameter/2), statt eine volle Kugel zu verbiegen. Dadurch bleibt
 * die Sag-Formel immer im gültigen Bereich (kein Abbruch/Verzerrung am Rand)
 * und man bekommt eine glatte, korrekt aufgelöste Fläche statt eines groben
 * Kugel-Fächers.
 */
function createAsphericCapGeometry(R, diameter, Q, radialSegments = 40, thetaSegments = 64) {
    const maxR = diameter / 2;
    const positions = [];
    const uvs = [];
    const indices = [];

    for (let ring = 0; ring <= radialSegments; ring++) {
        const r = (ring / radialSegments) * maxR;
        const underRoot = 1 - (1 + Q) * (r * r) / (R * R);
        // Sicherheitsfallback: sollte bei sinnvollen Eingaben (Durchmesser < 2R) nicht greifen,
        // verhindert aber NaN-Vertices, falls doch mal ein extremer Wert eingegeben wird.
        const z = underRoot > 0 ? (r * r) / (R * (1 + Math.sqrt(underRoot))) : (r * r) / R;

        for (let seg = 0; seg <= thetaSegments; seg++) {
            const theta = (seg / thetaSegments) * Math.PI * 2;
            positions.push(r * Math.cos(theta), r * Math.sin(theta), z);
            uvs.push(seg / thetaSegments, ring / radialSegments);
        }
    }

    for (let ring = 0; ring < radialSegments; ring++) {
        for (let seg = 0; seg < thetaSegments; seg++) {
            const a = ring * (thetaSegments + 1) + seg;
            const b = a + thetaSegments + 1;
            const c = a + 1;
            const d = b + 1;
            indices.push(a, b, c, c, b, d);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();
    return geometry;
}

function createCapMesh(R, diameter, Q, color, opacity) {
    const geometry = createAsphericCapGeometry(R, diameter, Q);
    const material = new THREE.MeshPhongMaterial({
        color,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        shininess: 80
    });
    return new THREE.Mesh(geometry, material);
}

function updateRendererValues() {
    if (!corneaMesh || !klMesh) return;

    // Hornhaut
    const Rf = parseFloat(document.getElementById("R_flat").value) || 7.8;
    const dia = parseFloat(document.getElementById("cornea_diameter").value) || 11.5;
    const Qc = parseFloat(document.getElementById("E_value").value) || 0;

    corneaMesh.geometry.dispose();
    corneaMesh.geometry = createAsphericCapGeometry(Rf, dia, Qc);
    corneaMesh.visible = document.getElementById("showCornea").checked;

    // Kontaktlinse - liest jetzt das eigene KL_diameter-Feld statt cornea_diameter
    const KL_Rf = parseFloat(document.getElementById("KL_R_flat").value) || 8.0;
    const KL_dia = parseFloat(document.getElementById("KL_diameter").value) || 9.6;
    const KL_Q = parseFloat(document.getElementById("KL_Q").value) || 0;

    klMesh.geometry.dispose();
    klMesh.geometry = createAsphericCapGeometry(KL_Rf, KL_dia, KL_Q);
    klMesh.visible = document.getElementById("showKL").checked;
}

function initRendererUI() {
    const btn = document.getElementById("updateRenderer");
    if (btn) btn.onclick = updateRendererValues;

    ['showCornea', 'showKL'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateRendererValues);
    });
}



/*###########################################################################################################*/


// UI der KL Renderer Seite

function initKLUI() {
    initTabs();
    initExMode();
    initKLPowerMode();
    initFormatting();
}

/* Tabs Hornhaut / KL - mit "Blatt Papier"-Flip-Übergang (anime.js) */
function initTabs() {
    const buttons = document.querySelectorAll('.tabButton');
    const container = document.querySelector('.tabFlipContainer');

    function activateTab(id) {
        const current = document.querySelector('.tab.active');
        const target = document.getElementById(id);
        if (!target || target === current) return;

        buttons.forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`.tabButton[data-tab="${id}"]`);
        if (btn) btn.classList.add('active');

        // Erster Aufruf: noch kein aktiver Tab vorhanden -> kein Flip nötig
        if (!current) {
            target.style.display = 'block';
            target.classList.add('active');
            return;
        }

        // Falls anime.js aus irgendeinem Grund nicht verfügbar ist,
        // trotzdem sauber (nur ohne Animation) umschalten statt kaputtzugehen.
        if (typeof anime === 'undefined' || !container) {
            current.classList.remove('active');
            current.style.display = 'none';
            target.style.display = 'block';
            target.classList.add('active');
            return;
        }

        // Höhe während der Animation fixieren, damit der Container nicht springt,
        // weil beide Tabs kurzzeitig position:absolute übereinanderliegen.
        container.style.height = container.offsetHeight + 'px';

        current.style.position = 'absolute';
        current.style.top = '0';
        current.style.left = '0';
        current.style.width = '100%';

        target.style.display = 'block';
        target.style.position = 'absolute';
        target.style.top = '0';
        target.style.left = '0';
        target.style.width = '100%';
        target.style.opacity = '0';
        target.style.transformOrigin = 'left center';

        anime.timeline({
            easing: 'easeInOutSine',
            complete: () => {
                current.classList.remove('active');
                current.style.display = 'none';
                current.style.position = '';
                current.style.width = '';
                current.style.transform = '';
                current.style.opacity = '';

                target.classList.add('active');
                target.style.position = '';
                target.style.width = '';
                target.style.transform = '';
                target.style.opacity = '';
                container.style.height = 'auto';
            }
        })
        .add({
            targets: current,
            rotateY: [0, 100],
            opacity: [1, 0],
            duration: 350
        })
        .add({
            targets: target,
            rotateY: [-100, 0],
            opacity: [0, 1],
            duration: 350
        }, '-=120'); // leichte Überlappung: fühlt sich an wie ein durchgehendes Umblättern
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-tab');
            activateTab(id);
        });
    });

    // Standard: Hornhaut aktiv
    activateTab('tabHornhaut');
}

/* Exzentrizität: nur relevanter Block sichtbar */
function initExMode() {
    const select = document.getElementById('E_mode');
    if (!select) return;

    const blocks = document.querySelectorAll('.E_block');

    function updateExMode() {
        const mode = select.value; // "direct", "manual", "csv"
        blocks.forEach(b => b.classList.add('hide'));
        const active = document.getElementById('E_' + mode);
        if (active) active.classList.remove('hide');
    }

    select.addEventListener('change', updateExMode);
    updateExMode();
}

/* KL: Sphäre/Zylinder vs. Rück-/Vorderfläche */
function initKLPowerMode() {
    const select = document.getElementById('KL_power_mode');
    if (!select) return;

    const blocks = document.querySelectorAll('.KL_block');

    function updateKLMode() {
        const mode = select.value; // "sphcyl" oder "backfront"
        blocks.forEach(b => b.classList.add('hide'));
        const active = document.getElementById('KL_' + mode);
        if (active) active.classList.remove('hide');
    }

    select.addEventListener('change', updateKLMode);
    updateKLMode();
}

/* Formatierung der Eingaben */
function initFormatting() {
    // Radien: 2 Nachkommastellen
    const radiusIds = [
        'R_flat', 'R_steep',
        'R_up', 'R_down', 'R_left', 'R_right',
        'KL_R_flat', 'KL_R_steep',
        'KL_back', 'KL_front',
        'KL_radius' // erste Zeile im Mehrkurvigen Design
    ];

    radiusIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', () => formatNumber(el, 2));
    });

    // Durchmesser: 1 Nachkommastelle
    const diameterIds = [
        'cornea_diameter',
        'pupil_diameter',
        'KL_diameter',
        'KL_bevel_width',
        'KL_bevel_radius'
    ];

    diameterIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', () => formatNumber(el, 1));
    });

    // Exzentrizität / Sphäre / Zylinder / Rück-/Vorderfläche: 2 Nachkommastellen
    const powerIds = [
        'E_value',
        'KL_Q',
        'KL_sph',
        'KL_cyl',
        'KL_back',
        'KL_front'
    ];

    powerIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', () => formatNumber(el, 2));
    });
}

/* Hilfsfunktion: Zahl formatieren */
function formatNumber(input, decimals) {
    const val = parseFloat(input.value.replace(',', '.'));
    if (isNaN(val)) return;
    input.value = val.toFixed(decimals).replace('.', ','); // wenn du Komma willst
}

/* Hinweis: Es gibt hier bewusst KEINEN
   document.addEventListener('DOMContentLoaded', () => initKLUI())
   mehr. Dieses Skript wird im <head> von index.html geladen und damit
   lange bevor die KL_Renderer.html-Seite per fetch() in #content geladen
   wird - DOMContentLoaded würde also einmalig zu früh feuern und nie wieder.
   initKLUI() wird stattdessen von index.html's loadPage() aufgerufen,
   genau dann, wenn diese Seite tatsächlich in den DOM eingefügt wurde. */
