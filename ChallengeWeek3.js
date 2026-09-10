import * as THREE from "https://unpkg.com/three@0.179.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.179.1/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("scene-container") || document.body;
const pressedKeys = new Set();
const cameraKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"]);

window.addEventListener("keydown", (event) => {
    if (cameraKeys.has(event.key)) {
        pressedKeys.add(event.key);
        event.preventDefault();

        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            zoomCamera(event.key === "ArrowUp" ? -1 : 1);
        }
    }
});

window.addEventListener("keyup", (event) => {
    pressedKeys.delete(event.key);
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
camera.position.set(0, 8, 16);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(Math.min(window.innerWidth * 0.9, 900), 600);
renderer.domElement.style.display = "block";
renderer.domElement.style.marginTop = "1rem";
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

const zoomStep = 1;
const minZoomDistance = 4;
const maxZoomDistance = 40;

function zoomCamera(direction) {
    const cameraOffset = camera.position.clone().sub(controls.target);
    const zoomDistance = THREE.MathUtils.clamp(
        cameraOffset.length() + direction * zoomStep,
        minZoomDistance,
        maxZoomDistance
    );

    camera.position.copy(controls.target).add(cameraOffset.normalize().multiplyScalar(zoomDistance));
    controls.update();
    renderer.render(scene, camera);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: 0x44aa44 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const trees = [];

const positions = [
[-8, -4],
[-9,  2],
[ 0,  0],
[ 5,  1],
[ 6,  4],
[ 2,  7], 
[-3,  6],
[ 9,  7],
[ 10,-7],
[-3, -5]
];

positions.forEach(([x, z]) => {
    const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), new THREE.MeshStandardMaterial({color: "#7c4b00"}));
    const bottomLeaves = new THREE.Mesh(new THREE.ConeGeometry(1, 1.5, 32), new THREE.MeshStandardMaterial({color: "#2a6a2a"}));
    const middleLeaves = new THREE.Mesh(new THREE.ConeGeometry(1, 1.5, 32), new THREE.MeshStandardMaterial({color: "#2a6a2a"}));
    const topLeaves = new THREE.Mesh(new THREE.ConeGeometry(1, 1.5, 32), new THREE.MeshStandardMaterial({color: "#2a6a2a"}));

    trunk.position.set(x, 1, z);
    bottomLeaves.position.set(x, 2, z);
    middleLeaves.position.set(x, 2.75, z);
    topLeaves.position.set(x, 3.5, z);

    scene.add(trunk);
    scene.add(bottomLeaves);
    scene.add(middleLeaves);
    scene.add(topLeaves);

    const tree = [trunk, bottomLeaves, middleLeaves, topLeaves];
    trees.push(tree);
});

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.MeshStandardMaterial({color: "#ffd152"})
);
sun.position.set(0, 7, 0);
scene.add(sun);

function resizeRenderer() {
    const width = Math.min(window.innerWidth * 0.9, 900);
    const height = 600;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

window.addEventListener("resize", resizeRenderer);
resizeRenderer();
renderer.render(scene, camera);

