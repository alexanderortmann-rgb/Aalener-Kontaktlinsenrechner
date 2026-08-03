let scene, camera, renderer;
let corneaMesh;

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

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.6;
    controls.panSpeed = 0.6;

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(50, 50, 50);
    scene.add(light);

    corneaMesh = createCorneaMesh(7.8, 7.6, 11.5, 0.2);
    scene.add(corneaMesh);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }


    

}

function createCorneaMesh(R_flat, R_steep, diameter, Q) {
    const geometry = new THREE.SphereGeometry(R_flat, 64, 64);
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

function applyAsphericity(geometry, Q) {
    const pos = geometry.attributes.position;
    const R = geometry.parameters.radius;

    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);

        const r = Math.sqrt(x * x + y * y);

        const z_asph = (r * r) / (R * (1 + Math.sqrt(1 - (1 + Q) * (r * r) / (R * R))));
        pos.setZ(i, z_asph);
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();
}

function updateRendererValues() {
    const Rf = parseFloat(document.getElementById("R_flat").value);
    const dia = parseFloat(document.getElementById("cornea_diameter").value);
    const Q = parseFloat(document.getElementById("E_value").value) || 0;

    corneaMesh.geometry.dispose();
    corneaMesh.geometry = new THREE.SphereGeometry(Rf, 64, 64);
    applyAsphericity(corneaMesh.geometry, Q);
    corneaMesh.scale.set(dia / (2 * Rf), dia / (2 * Rf), 1);

    corneaMesh.visible = document.getElementById("showCornea").checked;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function initRendererUI() {
    document.getElementById("updateRenderer").onclick = updateRendererValues;
}
