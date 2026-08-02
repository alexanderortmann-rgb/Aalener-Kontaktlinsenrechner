let scene, camera, renderer;

function initKLVisualizer() {
    const container = document.getElementById('kl3dContainer');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / 400, 0.1, 1000);
    camera.position.set(0, -40, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, 400);
    container.appendChild(renderer.domElement);

    addCornea();
    addLens();

    animate();
}

