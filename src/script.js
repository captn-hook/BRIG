import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader.js';
import {
    MTLLoader
} from 'three/examples/jsm/loaders/MTLLoader.js';

import FileExt from './FileExt.js';

//specific assets
import b1 from '../models/Raw/matterpak_8MgMZZKRSGW/b6888d06856e429cade222b9bf32acb8.obj';
import m1 from '../models/Raw/matterpak_8MgMZZKRSGW/b6888d06856e429cade222b9bf32acb8.mtl';

function importAll(r) {
    r.keys().forEach(r)
  }

importAll(require.context('../models/Raw/matterpak_8MgMZZKRSGW', false, /\.(png|jpe?g|svg)$/));



// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);

//Loaded Objects

load3DModel(b1, m1);

function load3DModel(base, mtlpath) {
    //checks file type
    if (FileExt(base)) {
        const loader = new GLTFLoader();
        //loads with above loader
        loader.load(base,
            // onLoad callback
            function (obj) { scene.add(obj.scene) },
            // onProgress callback
            function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% GLB/GLTF loaded') },
            // onError callback
            function (err) { console.error(err) }
        );
    } else {
        const mtlLoader = new MTLLoader();

        mtlLoader.load(mtlpath,
            //callback
            function (materials) {

                //preload mats
                materials.preload();
                console.log(materials);

                //load obj w/ mat
                const loader = new OBJLoader();

                loader.setMaterials(materials);

                //loads with above loader
                loader.load(base,
                    // onLoad callback
                    function (obj) { scene.add(obj) },
                    // onProgress callback
                    function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% OBJ loaded') },
                    // onError callback
                    function (err) { console.error(err); }
                );

            },
            // onProgress callback
            function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% MTL loaded') },
            // onError callback
            function (err) { console.error(err); }
        );
    }
}

// Materials
const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xff0000);

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Lights
const light = new THREE.AmbientLight(0x404040); // soft white light
light.intensity = 3;
scene.add(light);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 300);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();


//is model loaded? add to scene when loaded

const tick = () => {

    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = .5 * elapsedTime;

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();