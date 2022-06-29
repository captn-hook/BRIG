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
import SpherePoint from './SpherePoint';

//specific assets *doing just tracers
//import b1 from '../models/1.glb';
//import b2 from '../models/2.glb';
//import b3 from '../models/3.glb';
//import m1 from '../models/Raw/matterpak_8MgMZZKRSGW/b6888d06856e429cade222b9bf32acb8.mtl';
import data from '../data/Data.csv'

/*
Setup
*/

// Debug
const gui = new dat.GUI();

// Canvas
const WebGLcanvas = document.querySelector('canvas.webgl');
const Flatcanvas = document.getElementById('2d');
const Flatcontext = Flatcanvas.getContext('2d');

// Scene
const scene = new THREE.Scene();

/*
window resizing
*/
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
Flatcanvas.width = sizes.width;
Flatcanvas.height = sizes.height;

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    Flatcanvas.width = sizes.width;
    Flatcanvas.height = sizes.height;
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
const controls = new OrbitControls(camera, Flatcanvas);
controls.enableDamping = true;

/*
 Renderer
*/
const renderer = new THREE.WebGLRenderer({
    canvas: WebGLcanvas
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

const mTempPoints = [];
const tTempPoints = [];

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

            tPoints.push(new TracerPoint(2, .1, 'blue', x, y, z))

            tTempPoints.push(new SpherePoint(1, 0x0000ff, x, y, z));  

            //ROW 1
        } else if (t == 1 && m > 1) {
            var [x, y, z] = dataArray[t][m].split('/');
            ms.push([x, y, z])

            mPoints.push(new TracerPoint(2, .1, 'red', x, y, z));
            
            mTempPoints.push(new SpherePoint(2, 0xff0000, x, y, z));  

            //Main Transmission
        } else if (m > 1 && t > 1) {
            trans.push(dataArray[t][m]);
        } else {
            console.log('Error: ' + dataArray[t][m]);
        }
    }
}

mTempPoints.forEach(s => {
    scene.add(s);
});


tTempPoints.forEach(s => {
    scene.add(s);
});

console.log(ms);
console.log(ts);
console.log(trans);

/*
Test OBJ
*/
var center = new SpherePoint(1, 0xffffff);
scene.add(center);


/*
Loaded Objects
*/

//load3DModel(b1);
//load3DModel(b2);
//load3DModel(b3);

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

    //Render Points
    Flatcontext.clearRect(0, 0, Flatcanvas.width, Flatcanvas.height);
    tPoints.forEach(function (pt) {
        var [x, y] = pt.screenPt(camera, window.innerWidth / 2, window.innerHeight / 2 );

        Flatcontext.beginPath();
        Flatcontext.arc(x, y, pt.r, 0, 2 * Math.PI, false);
        Flatcontext.fillStyle = pt.color;
        Flatcontext.fill();
        Flatcontext.lineWidth = pt.w;
        Flatcontext.strokeStyle = '#003300';
        Flatcontext.stroke();
    })

    mPoints.forEach(function (pt) {
        var [x, y] = pt.screenPt(camera, window.innerWidth / 2, window.innerHeight / 2 );

        Flatcontext.beginPath();
        Flatcontext.arc(x, y, pt.r, 0, 2 * Math.PI, false);
        Flatcontext.fillStyle = pt.color;
        Flatcontext.fill();
        Flatcontext.lineWidth = pt.w;
        Flatcontext.strokeStyle = '#003300';
        Flatcontext.stroke();
    })

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();