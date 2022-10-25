import * as THREE from 'three';
import { OrbitControls } from './js/OrbitControls.js';
import { GLTFLoader } from './js/GLTFLoader.js';

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

let mixer;
const loader = new GLTFLoader();

loader.load('./assets/pendulum.glb', function (glb) {
    const root = glb.scene;
    root.scale.set(5, 5, 5);
    scene.add(root);

    mixer = new THREE.AnimationMixer(root);
    const clips = glb.animations;

    clips.forEach(function (clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });
});

const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 10, 0);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);

const renderer = new THREE.WebGL1Renderer({
    canvas: canvas
});

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 25);
orbit.update();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;

const clock = new THREE.Clock();
function animate() {
    if (mixer)
        mixer.update(clock.getDelta());
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();