// === THREE.js Grundobjekte ===
let scene, camera, renderer;
let corneaMesh, lensMesh;
let multiCurveGroup;

// === Initialisierung ===
function initKLRenderer() {

    // Szene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Kamera
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(0, 0, 120);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7);

    document.getElementById("rendererCanvas").appendChild(renderer.domElement);

    // Licht
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(50, 50, 50);
    scene.add(light);

    // Hornhaut erzeugen
    corneaMesh = createCorneaMesh(7.8, 7.6, 11.5, 0.2);
    scene.add(corneaMesh);

    // KL erzeugen
    lensMesh = createLensMesh(7.9, 7.7, 9.5, 0.1);
    scene.add(lensMesh);

    // Mehrkurven-Gruppe
    multiCurveGroup = new THREE.Group();
    scene.add(multiCurveGroup);

    animate();
}

// === Hornhaut-Mesh ===
function createCorneaMesh(R_flat, R_steep, diameter, Q) {

    const geometry = new THREE.SphereGeometry(R_flat, 64, 64);

    // Exzentrizität (Q-Wert) als Asphärenkorrektur
    applyAsphericity(geometry, Q);

    const material = new THREE.MeshPhongMaterial({
        color: 0x88bbff,
        transparent: true,
        opacity: 0.45
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(diameter / (2 * R_flat), diameter / (2 * R_flat), 1);

    return mesh;
}

// === KL-Mesh ===
function createLensMesh(R_flat, R_steep, diameter, Q) {

    const geometry = new THREE.SphereGeometry(R_flat, 64, 64);
    applyAsphericity(geometry, Q);

    const material = new THREE.MeshPhongMaterial({
        color: 0xffaa88,
        transparent: true,
        opacity: 0.45
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(diameter / (2 * R_flat), diameter / (2 * R_flat), 1);

    return mesh;
}

// === Asphärenkorrektur (Q-Wert) ===
function applyAsphericity(geometry, Q) {
    geometry.vertices?.forEach(v => {
        const r = Math.sqrt(v.x * v.x + v.y * v.y);
        const R = geometry.parameters.radius;

        const z_asph = (r * r) / (R * (1 + Math.sqrt(1 - (1 + Q) * (r * r) / (R * R)))));
        v.z = z_asph;
    });
    geometry.computeVertexNormals();
}

// === Mehrkurven-Design ===
function updateMultiCurveDesign() {
    multiCurveGroup.clear();

    const meridians = [...document.querySelectorAll(".KL_meridian")];
    const radii = [...document.querySelectorAll(".KL_radius")];

    for (let i = 0; i < meridians.length; i++) {
        const mer = parseFloat(meridians[i].value);
        const rad = parseFloat(radii[i].value);

        if (!isNaN(mer) && !isNaN(rad)) {
            const curve = new THREE.Mesh(
                new THREE.SphereGeometry(rad, 32, 32),
                new THREE.MeshPhongMaterial({
                    color: 0x00ff00,
                    transparent: true,
                    opacity: 0.3
                })
            );

            curve.rotation.z = THREE.Math.degToRad(mer);
            multiCurveGroup.add(curve);
        }
    }
}

// === Renderer aktualisieren ===
function updateRendererValues() {

    // Hornhaut
    const Rf = parseFloat(document.getElementById("R_flat").value);
    const Rs = parseFloat(document.getElementById("R_steep").value);
    const dia = parseFloat(document.getElementById("cornea_diameter").value);
    const Q = parseFloat(document.getElementById("E_value").value) || 0;

    corneaMesh.geometry.dispose();
    corneaMesh.geometry = new THREE.SphereGeometry(Rf, 64, 64);
    applyAsphericity(corneaMesh.geometry, Q);
    corneaMesh.scale.set(dia / (2 * Rf), dia / (2 * Rf), 1);

    // KL
    const KLf = parseFloat(document.getElementById("KL_R_flat").value);
    const KLs = parseFloat(document.getElementById("KL_R_steep").value);
    const KLQ = parseFloat(document.getElementById("KL_Q").value) || 0;

    lensMesh.geometry.dispose();
    lensMesh.geometry = new THREE.SphereGeometry(KLf, 64, 64);
    applyAsphericity(lensMesh.geometry, KLQ);

    // Mehrkurven
    updateMultiCurveDesign();
}

// === Animation ===
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// === UI-Events ===
function initRendererUI() {
    document.getElementById("updateRenderer").onclick = updateRendererValues;

    document.getElementById("KL_addCurve").onclick = () => {
        const row = document.createElement("div");
        row.className = "curveRow";
        row.innerHTML = `
            <label>Meridian</label><input type="number" class="KL_meridian">
            <label>Radius</label><input type="number" class="KL_radius">
        `;
        document.getElementById("KL_multi").appendChild(row);
    };

    document.getElementById("E_mode").onchange = () => {
        document.querySelectorAll(".E_block").forEach(b => b.classList.add("hide"));
        const mode = document.getElementById("E_mode").value;
        document.getElementById("E_" + mode).classList.remove("hide");
    };

    document.getElementById("KL_power_mode").onchange = () => {
        document.querySelectorAll(".KL_block").forEach(b => b.classList.add("hide"));
        const mode = document.getElementById("KL_power_mode").value;
        document.getElementById("KL_" + mode).classList.remove("hide");
    };
}
