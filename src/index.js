import * as THREE from 'three';
import * as dat from 'dat.gui';
import {
    parse
} from '@vanillaes/csv'
//import * as fs from  'fs';

import './style.css';

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
import {
    Point2d,
    Point3d
} from './Point';
import {
    Tracer2d,
    Tracer3d
} from './Tracer';

//specific assets
import data from '../data/Data.csv'
import {
    Vector3
} from 'three';

/*
Setup
*/

// Debug
const gui = new dat.GUI();

// Canvas
const canvas3d = document.querySelector('canvas.webgl');

const canvas2d = document.getElementById('2d');

const ctx = canvas2d.getContext('2d');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f0f);

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

    canvas2d.innerWidth = sizes.width;
    canvas2d.innerHeight = sizes.height;

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
const controls = new OrbitControls(camera, canvas2d);
controls.enableDamping = true;

/*
 Renderer
*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas3d
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/*
Data
*/

const dataArray = parse(data);

const ms = [];
const ts = [];
const tracers = [];

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

            var xyz = dataArray[t][m].split('/');
            var pos = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);

            ts.push(new Point2d('blue', pos));

            //ROW 1
        } else if (t == 1 && m > 1) {

            var xyz = dataArray[t][m].split('/');
            var pos = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);

            ms.push(new Point2d('red', pos));

            //Main Transmission
        } else if (m > 1 && t > 1) {


            tracers.push(new Tracer2d(ms[m - 2], ts[t - 2], dataArray[t][m]));

        } else {
            console.log('Error: ' + dataArray[t][m]);
        }
    }
}


/*
Test OBJ
*/

const sphere = new Point3d(0x000000, new Vector3(0, 0, 0), .1);
scene.add(sphere)

/*
Loaded Objects
*/


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

    //console.log(elapsedTime);
    console.log(camera.position)

    //Render Points
    ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);

    /*
    tracers.forEach(function (t) {

        var [x1, y1, x2, y2, x3, y3] = t.screenPts(camera, sizes.width / 2, sizes.height / 2)

        let start = {
            x: x1,
            y: y1
        };
        let cp1 = {
            x: x2,
            y: y2
        };
        let cp2 = {
            x: x2,
            y: y2
        };
        let end = {
            x: x3,
            y: y3
        };

        // Cubic Bézier curve
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
        ctx.stroke();

        // Start and end points
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(start.x, start.y, 5, 0, 2 * Math.PI); // Start point
        ctx.arc(end.x, end.y, 5, 0, 2 * Math.PI); // End point
        ctx.fill();

        // Control points
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(cp1.x, cp1.y, 5, 0, 2 * Math.PI); // Control point one
        ctx.arc(cp2.x, cp2.y, 5, 0, 2 * Math.PI); // Control point two
        ctx.fill();

    });
    */
    function canvasPt(pt) {
        var [x, y] = pt.screenPt(camera, sizes.width / 2, sizes.height / 2 );

        ctx.beginPath();
        ctx.arc(x, y, pt.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = pt.color;
        ctx.fill();
        ctx.lineWidth = pt.border;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }

    ts.forEach(canvasPt)

    ms.forEach(canvasPt)

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();