import './style.css';

import * as THREE from 'three';
import * as dat from 'dat.gui';

import {
    parse
} from '@vanillaes/csv'
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
import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader';

//custom modules
import {
    MinMaxGUIHelper
} from './Controls';

import FileExt from './FileExt.js';
//import Spreadsheet from './Spreadsheet';

import {
    Point2d,
    Point3d
} from './Point';

import {
    Tracer2d
} from './Tracer';

//specific assets
//import building from '../models/1.glb';
import data from '../data/Data.csv'

/*
    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup
*/

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 500);
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 30;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x3f3f3f);
scene.add(camera);


// Debug
const gui = new dat.GUI();

function updateCamera() {
    camera.updateProjectionMatrix();
}

gui.add(camera, 'fov', 1, 180).onChange(updateCamera);

const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);

gui.add(minMaxGUIHelper, 'min', 0.01, 50, 0.01).name('near').onChange(updateCamera);
gui.add(minMaxGUIHelper, 'max', 0.1, 200, 0.1).name('far').onChange(updateCamera);

// Canvas
const canvas3d = document.querySelector('canvas.webgl');

const canvas2d = document.getElementById('2d');

const ctx = canvas2d.getContext('2d');

const canvasleft = document.getElementById('left');

const spreadsheetContext = canvasleft.getContext('2d');

//window resizing
canvas2d.width = sizes.width;
canvas2d.height = sizes.height;

canvasleft.width = sizes.width / 4;
canvasleft.height = sizes.height;


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
    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading
*/

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

            ts.push(new Point2d("T", t, 'blue', pos, 5));

            //ROW 1
        } else if (t == 1 && m > 1) {

            var xyz = dataArray[t][m].split('/');
            var pos = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);

            ms.push(new Point2d("M", m, 'red', pos, 10));

            //Main Transmission
        } else if (m > 1 && t > 1) {

            if (dataArray[t][m] > 1) {
                tracers.push(new Tracer2d(ms[m - 2], ts[t - 2], dataArray[t][m]));
            }

        } else {
            console.log('Error: ' + dataArray[t][m]);
        }
    }
}

//const sheet = new Spreadsheet(ms.length, ts.length, sizes.width / 4, sizes.height);

function compare(a, b) {
    if (a.last_nom < b.last_nom) {
        return -1;
    }
    if (a.last_nom > b.last_nom) {
        return 1;
    }
    return 0;
}

tracers.sort((a, b) => {
    return a.value - b.value;
});

console.log(tracers)

/*
Test OBJ
*/

const center = new Point3d('Marker', 0, 0xffffff, new THREE.Vector3(0, 0, 0), 2);
scene.add(center.sphere);


/*
Loaded Objects
*/

//loadfunc 
//load3DModel(building);

// onLoad callback
function onLoadLoad(obj) {

    let thing = obj.scene.children[0];

    //find out why this doesnt match pts and fix
    thing.scale.y *= -1;
    thing.position.z = -13;

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

function load3DModel(base, mtlpath = null) {
    //checks file type
    if (FileExt(base)) {
        const loader = new GLTFLoader();


        //mesh decompression wip, using uncompressed mesh for now
        /*
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'three/examples/js/libs/draco/' );
        loader.setDRACOLoader( dracoLoader );
*/
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
Misc
*/

const clock = new THREE.Clock();


/*
    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE

*/

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    ctx.canvas.innerWidth = sizes.width;
    ctx.canvas.innerHeight = sizes.height;

    spreadsheetContext.canvas.innerWidth = sizes.width / 4;
    spreadsheetContext.canvas.innerHeight = sizes.height;

    //sheet.w = (sizes.width / 4) / sheet.x;
    //sheet.h = sizes.height / sheet.y;


    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/*
Animate
*/

function drawPt(pt) {
    //main canvas
    var [x, y] = pt.screenPt(camera, sizes.width / 2, sizes.height / 2);

    if (x != null) {


        ctx.beginPath();
        ctx.arc(x, y, pt.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = pt.color;
        ctx.fill();
        ctx.lineWidth = pt.border;
        ctx.strokeStyle = '#003300';
        ctx.stroke();

        ctx.font = "12px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(pt.name, x, y);

    }

    //left canvas
    var cellWidth = (canvasleft.width / ms.length);
    var cellHeight = (canvasleft.height / ts.length);

    if (pt.type == 'M') {
        spreadsheetContext.beginPath();
        spreadsheetContext.rect(0, pt.i * cellWidth, cellWidth, cellHeight)
    } else if (pt.type == 'T') {
        spreadsheetContext.beginPath();
        spreadsheetContext.rect(pt.i * cellHeight, 0, cellWidth, cellHeight)
    } else {
        console.error('Type Error: Left Canvas')
    }


}

const tick = () => {

    const elapsedTime = clock.getElapsedTime();
    //console.log(elapsedTime);

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    //New Frame
    ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
    spreadsheetContext.clearRect(0, 0, canvasleft.width, canvasleft.height);

    //Tracers
    //console.log(tracers)
    for (var i = 0; i < tracers.length; i++) {

        //start,     ctrl1,  ctrl2,    end   arw 1   arw 2
        var [x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6] = tracers[i].screenPts(camera, sizes.width / 2, sizes.height / 2)

        if (x1 != null) {

            //settings
            ctx.lineWidth = tracers[i].outline;
            ctx.strokeStyle = tracers[i].color;
            ctx.fillStyle = tracers[i].color;

            //arrowhead
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x5, y5);
            ctx.lineTo(x6, y6);
            ctx.lineTo(x1, y1);
            ctx.fill();

            // Cubic Bézier curve
            ctx.beginPath();
            //start line a bit towards cp1, hide in arrow tip
            const hideFactor = 10;
            ctx.moveTo(x1 + (x2 - x1) / hideFactor, y1 + (y2 - y1) / hideFactor);
            //                ctrl1    ctrl2   end
            ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
            ctx.stroke();

        } else {
            //console.log(tracers[i])
        }

        //spreadsheet

    };

    //Points
    ms.forEach(drawPt);
    ts.forEach(drawPt);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();