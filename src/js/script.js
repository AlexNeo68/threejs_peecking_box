import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

const W = window.innerWidth;
const H = window.innerHeight;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(W, H);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
camera.position.set(0, 4, 20);

const trackballControl = new TrackballControls(camera, renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshBasicMaterial();
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let boxes = [];

for (let index = 0; index < 10; index++) {
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.x = -5 * Math.random() + 10;
  box.position.y = 1;
  box.position.z = -5 * Math.random() + 10;
  scene.add(box);
  boxes.push(box);
}

let dragged = false;
let box = null;
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

function onMouseMove(event) {
  mouse.x = (event.clientX / W) * 2 - 1;
  mouse.y = -(event.clientY / H) * 2 + 1;
}
function onMouseDown(event) {
  dragged = true;
}
function onMouseUp(event) {
  dragged = false;
}

document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);

document.body.appendChild(renderer.domElement);

function animate() {
  trackballControl.update();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(boxes);

  if (intersects.length > 0) {
    if (box !== intersects[0].object) {
      box = intersects[0];
    } else {
      box = null;
    }
  }
  if (box && dragged) {
    box.object.position.x = box.point.x;
    box.object.position.z = box.point.z;
  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
