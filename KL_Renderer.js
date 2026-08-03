let scene, camera, renderer;
let corneaMesh, klMesh, controls;

function initKLRenderer() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(0, 0, 40);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7);
    document.getElementById("rendererCanvas").appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.6;
    controls.panSpeed = 0.6;

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(50, 50, 50);
    scene.add(light);

    // Start-Hornhaut
    corneaMesh = createCorneaMesh(7.8, 11.5, 0.2);
    scene.add(corneaMesh);

    // Start-KL (optional)
    klMesh = createKLMesh(8.0, 14.0, 0.3);
    scene.add(klMesh);

    animate();
}

function createCorneaMesh(R, diameter, Q) {
    const geometry = new THREE.SphereGeometry(R, 64, 64);
    applyAsphericity(geometry, Q);

    const material = new THREE.MeshPhongMaterial({
        color: 0x88bbff,
        transparent: true,
        opacity: 0.45
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(diameter / (2 * R), diameter / (2 * R), 1);
    return mesh;
}

function createKLMesh(R, diameter, Q) {
    const geometry = new THREE.SphereGeometry(R, 64, 64);
    applyAsphericity(geometry, Q);

    const material = new THREE.MeshPhongMaterial({
        color: 0xffaa88,
        transparent: true,
        opacity: 0.5
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(diameter / (2 * R), diameter / (2 * R), 1);
    mesh.position.z = 0.2; // leicht vor der Hornhaut
    return mesh;
}

function applyAsphericity(geometry, Q) {
    const pos = geometry.attributes.position;
    const R = geometry.parameters.radius;

    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const r = Math.sqrt(x * x + y * y);

        const underRoot = 1 - (1 + Q) * (r * r) / (R * R);
        if (underRoot <= 0) continue; // Sicherheitscheck

        const z_asph = (r * r) / (R * (1 + Math.sqrt(underRoot)));
        pos.setZ(i, z_asph);
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();
}

function updateRendererValues() {
    const Rf = parseFloat(document.getElementById("R_flat").value);
    const dia = parseFloat(document.getElementById("cornea_diameter").value);
    const Qc = parseFloat(document.getElementById("E_value").value) || 0;

    const KL_Rf = parseFloat(document.getElementById("KL_R_flat").value);
    const KL_dia = parseFloat(document.getElementById("cornea_diameter").value); // oder eigenes Feld
    const KL_Q = parseFloat(document.getElementById("KL_Q").value) || 0;

    // Hornhaut
    corneaMesh.geometry.dispose();
    corneaMesh.geometry = new THREE.SphereGeometry(Rf, 64, 64);
    applyAsphericity(corneaMesh.geometry, Qc);
    corneaMesh.scale.set(dia / (2 * Rf), dia / (2 * Rf), 1);
    corneaMesh.visible = document.getElementById("showCornea").checked;

    // KL
    klMesh.geometry.dispose();
    klMesh.geometry = new THREE.SphereGeometry(KL_Rf, 64, 64);
    applyAsphericity(klMesh.geometry, KL_Q);
    klMesh.scale.set(KL_dia / (2 * KL_Rf), KL_dia / (2 * KL_Rf), 1);
    klMesh.visible = document.getElementById("showKL").checked;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function initRendererUI() {
    document.getElementById("updateRenderer").onclick = updateRendererValues;
}



/*###########################################################################################################*/


// UI der KL Renderer Seite

function initKLUI() {
    initTabs();
    initExMode();
    initKLPowerMode();
    initFormatting();
}

/* Tabs Hornhaut / KL */
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const buttons = document.querySelectorAll('.tabButton');

    function activateTab(id) {
    const tabs = document.querySelectorAll('.tab');
    const buttons = document.querySelectorAll('.tabButton');

    tabs.forEach(t => t.classList.remove('active'));
    buttons.forEach(b => b.classList.remove('active'));

    const tab = document.getElementById(id);
    const btn = document.querySelector(`.tabButton[data-tab="${id}"]`);

    if (tab) {
        tab.classList.add('active');

        // Papier-Animation
        anime({
            targets: tab,
            opacity: [0, 1],
            translateY: [-20, 0],
            rotateZ: [-3, 0],
            duration: 500,
            easing: 'easeOutQuad'
        });
    }
    if (btn) btn.classList.add('active');
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

/* Aufruf nach Laden der Seite */
document.addEventListener('DOMContentLoaded', () => {
    initKLUI();
});

