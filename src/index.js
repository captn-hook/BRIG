import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
    parse
} from '@vanillaes/csv'
//import * as fs from  'fs';

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

//custom modules
import FileExt from './FileExt.js';
import TracerPoint from './TracerPoint';

//specific assets
import b1 from '../models/1.glb';
import b2 from '../models/2.glb';
import b3 from '../models/3.glb';
//import m1 from '../models/Raw/matterpak_8MgMZZKRSGW/b6888d06856e429cade222b9bf32acb8.mtl';
import data from '../data/Data.csv'

/*
Setup
*/

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/*
window resizing
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

/*
  Camera
*/

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 300);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Lights
const light = new THREE.AmbientLight(0x404040); // soft white light
light.intensity = 3;
scene.add(light);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/*
 Renderer
*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/*
Data
*/

const dataArray = parse(data);

const ms = [];
const ts = [];
const trans = [];

const mPoints = [];
const tPoints = [];

let widthHalf = sizes.width / 2;
let heightHalf = sizes.height / 2;

for (var m = 0; m < dataArray[0].length; m++) {
    for (var t = 0; t < dataArray.length; t++) {

        //DATA INTERP TREE
        //basic idea, cycle thru 2d array
        //ROW and COLUMN 0 label
        //ROW and COLUMN 1 XYZ

        //Labels
        if (m == 0 || t == 0) {
            console.log('Label: ' + dataArray[t][m]);

            //CLM 1
        } else if (m == 1 && t > 1) {
            var [x, y, z] = dataArray[t][m].split('/');
            ts.push([x, y, z])

            tPoints.push(new TracerPoint(('T' + t), 'blue', x, y))

            //ROW 1
        } else if (t == 1 && m > 1) {
            var [x, y, z] = dataArray[t][m].split('/');
            ms.push([x, y, z])

            mPoints.push(new TracerPoint(('M' + m), 'red', x, y))

            //Main Transmission
        } else if (m > 1 && t > 1) {
            trans.push(dataArray[t][m]);

            let pos = new THREE.Vector3();

        } else {
            console.log('Error: ' + dataArray[t][m]);
        }
    }
}

console.log(ms);
console.log(ts);
console.log(trans);

function projPoint(x, y, z) {
    let pos = new THREE.Vector3(x, y, z);

    pos.project(camera);


    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = -(pos.y * heightHalf) + heightHalf;
    pos.z = 0;

    console.log(pos);

    return [pos.x, pos.y]

}
/*
Test OBJ
*/
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)

const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

/*
Loaded Objects
*/

//load3DModel(b1);
//load3DModel(b2);
load3DModel(b3);

// onLoad callback
function onLoadLoad(obj) {
    scene.add(obj.scene);
}

// onProgress callback
function onProgressLog(xhr) {
    console.log((xhr.loaded / xhr.total * 100))
}

// onError callback
function onErrorLog(err) {
    console.error(err)
}

function load3DModel(base, mtlpath) {
    //checks file type
    if (FileExt(base)) {
        const loader = new GLTFLoader();
        //loads with above loader
        //NOTE:      path  func on load     func on progress                         func on error 
        loader.load(base, onLoadLoad, onProgressLog, onErrorLog);

    } else if (mtlpath != null) {
        //currently not working, images are not getting webpack'd to the site, cannot access imgs linked in .mtl file
        const mtlLoader = new MTLLoader();

        mtlLoader.load(mtlpath,
            //callback on load
            function (materials) {
                //when materials are loaded, load obj

                materials.preload();

                //load obj w/ mat
                const loader = new OBJLoader();
                loader.setMaterials(materials);

                //loads with above loader
                loader.load(base, onLoadLoad, onProgressLog, onErrorLog);

            },

            onProgressLog, onErrorLog
        );
    } else {
        console.error("Could not load model")
    }
}

/*
Animate
*/

const clock = new THREE.Clock();

const tick = () => {

    const elapsedTime = clock.getElapsedTime();

    console.log(elapsedTime);

    //Render Points
    tPoints.forEach(function (pt) {
        console.log(pt.label)
        var [x, y] = projPoint(pt.x, pt.y, pt.z);
        pt.animate(x, y, canvas);
    })

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();