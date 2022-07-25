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
import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader';

//custom modules
import {
    MinMaxGUIHelper
} from './Controls';

import FileExt from './FileExt.js';

import {
    Point3d
} from './Point';

import Data from './Data'

//specific assets
import building from '../models/1.glb';
import data from '../data/1.csv'

/*
    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup
*/

const div = document.getElementById("3d");

const sizes = {
    width: div.offsetWidth,
    height: div.offsetHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 500);

camera.position.set(0, 2.5, 2.5); // Set position like this
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Controls
const canvas2d = document.getElementById('2d');

const controls = new OrbitControls(camera, canvas2d);
controls.enableDamping = true;

camera.position.set(3, 3, 5);
controls.target.set(0, 0, 0);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);
scene.add(camera);


// Debug
const gui = new dat.GUI();

function updateCamera() {
    camera.updateProjectionMatrix();
}
canvas2d.width = sizes.width;
canvas2d.height = sizes.height;

gui.add(camera, 'fov', 1, 180).onChange(updateCamera);

const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);

gui.add(minMaxGUIHelper, 'min', 0.01, 50, 0.01).name('near').onChange(updateCamera);
gui.add(minMaxGUIHelper, 'max', 0.1, 200, 0.1).name('far').onChange(updateCamera);


// Canvas
const canvas3d = document.querySelector('canvas.webgl');

const ctx = canvas2d.getContext('2d');

const spreadsheetDiv = document.getElementById("spreadsheet");

const canvasleft = document.getElementById('left');

const ctxLeft = canvasleft.getContext('2d');

const textbox = document.getElementById('textbox');


//set size
updateSizes();

// Lights
const light = new THREE.AmbientLight(0x404040); // soft white light
light.intensity = 3;
scene.add(light);


//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas3d
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/*
    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading
*/

//load data from file
var [ms, ts, tracers, insights, views] = Data(data);

//Test OBJ

const center = new Point3d('Marker', 0, 0xffffff, new THREE.Vector3(0, 0, 0), 2);
scene.add(center.sphere);


//loadfunc =====================================================<
//load3DModel(building);

// onLoad callback
function onLoadLoad(obj) {

    let thing = obj.scene.children[0];

    //find out why this doesnt match pts and fix
    thing.scale.y *= -1;
    thing.position.z = -13;

    scene.add(obj.scene);
}

let Gxhr = 0;
// onProgress callback
function onProgressLog(xhr) {
    console.log((xhr.loaded / xhr.total * 100))
    Gxhr = xhr;
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

function updateSizes() {
    sizes.width = div.offsetWidth;
    sizes.height = div.offsetHeight;

    ctx.canvas.innerWidth = sizes.width;
    ctx.canvas.innerHeight = sizes.height;

    canvas2d.width = sizes.width;
    canvas2d.height = sizes.height;

    ctxLeft.canvas.innerWidth = spreadsheetDiv.offsetWidth;
    ctxLeft.canvas.innerHeight = spreadsheetDiv.offsetHeight;

    canvasleft.width = spreadsheetDiv.offsetWidth;
    canvasleft.height = spreadsheetDiv.offsetHeight;
}

const clock = new THREE.Clock();

var cellWidth = (canvasleft.width / (ts.length + 1));
var cellHeight = (canvasleft.height / (ms.length + 1));

var cellX = 0;
var cellY = 0;

const dataInput = document.getElementById("datapicker");

const modelInput = document.getElementById("modelpicker");
/*
    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE

*/

updateSizes();


/*
    EVENTS
*/

//file input
dataInput.addEventListener("change", handleFiles, false);

function handleModels() {
    var file = this.files[0];

    var read = new FileReader();

    read.readAsArrayBuffer(file);

    read.onloadend = function () {
        console.log(read.result);

        const loader = new GLTFLoader();
        loader.parse(read.result, "", onLoadLoad, onErrorLog);

    }
}

modelInput.addEventListener("change", handleModels, false);

function handleFiles() {
    var file = this.files[0];

    var read = new FileReader();

    read.readAsBinaryString(file);

    read.onloadend = function () {
        console.log(read.result);
        [ms, ts, tracers, insights, views] = Data(read.result);

        //resize sheet
        updateSizes();


        cellWidth = (canvasleft.width / (ts.length + 1));
        cellHeight = (canvasleft.height / (ms.length + 1));
    }
}


//spreadsheet click
canvasleft.addEventListener('click', (e) => {

    console.log('click', x, y, cellX, cellY);

    if (cellX <= 1 && cellY <= 1) {

    } else if (cellY == 1) {
        //if y (row) == 1, clicked ts
        var t = cellX - 2;

        ts[t].visible = !ts[t].visible;

        tracers.forEach((tracer) => {
            if (ts[t] == tracer.t) {
                tracer.visible = ts[t].visible;
            }
        })
    } else if (cellX == 1) {
        //if x (column) == 1, clicked ms
        var m = cellY - 2;

        ms[m].visible = !ms[m].visible;

        tracers.forEach((t) => {
            if (ms[m] == t.m) {
                t.visible = ms[m].visible;
            }
        })
    } else {
        tracers.forEach((t) => {
            if (t.t.i == cellX - 1 && t.m.i == cellY - 1) {
                t.visible = !t.visible;
            }
        })
    }

}, false);

//spreadsheet mouse move
canvasleft.addEventListener("mousemove", (e) => {
    var rect = canvasleft.getBoundingClientRect();
    var x = e.pageX - rect.left;
    var y = e.pageY - rect.top;
    cellX = Math.ceil(x / cellWidth);
    cellY = Math.ceil(y / cellHeight);

    //update camera on mouse move

    if (cellX <= 1 && cellY <= 1) {

    } else if (cellY == 1) {
        //if y (row) == 1, ts
        var t = cellX - 2;

        camera.position.set(parseFloat(ts[t].pos.x) + 14, parseFloat(ts[t].pos.z) + 30, parseFloat(ts[t].pos.y) + 8);
        controls.target.set(parseFloat(ts[t].pos.x), parseFloat(ts[t].pos.z), parseFloat(ts[t].pos.y));

        //throws errors if it trys to select row before/after last
    } else if (1 < cellY && cellY < ms.length + 2) {
        //if x (column) == 1, ms

        var m = cellY - 2;

        //special views
        if (views[cellY] != null && views[cellY][0] != '') {
            camera.position.set(parseFloat(views[cellY][0]), parseFloat(views[cellY][1]), parseFloat(views[cellY][2]));
        } else {
        camera.position.set(parseFloat(ms[m].pos.x) + 14, parseFloat(ms[m].pos.z) + 30, parseFloat(ms[m].pos.y) + 8);
        }
        controls.target.set(parseFloat(ms[m].pos.x), parseFloat(ms[m].pos.z), parseFloat(ms[m].pos.y));

        //insights
        textbox.textContent = insights[cellY]

    }
});

//resize
window.addEventListener('resize', () => {
    // Update sizes
    updateSizes();


    cellWidth = (canvasleft.width / (ts.length + 1));
    cellHeight = (canvasleft.height / (ms.length + 1));

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

console.log(ms)
console.log(ts)
console.log(tracers)

const tick = () => {

    const elapsedTime = clock.getElapsedTime();
    //console.log(elapsedTime);
    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    //New Frame
    ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
    ctxLeft.clearRect(0, 0, canvasleft.width, canvasleft.height);

    //Tracers
    tracers.forEach(t => t.drawTracer(ctx, ctxLeft, camera, sizes, cellWidth, cellHeight));

    //Points
    ms.forEach(pt => pt.drawPt(ctx, ctxLeft, camera, sizes, cellWidth, cellHeight));
    ts.forEach(pt => pt.drawPt(ctx, ctxLeft, camera, sizes, cellWidth, cellHeight));

    ctxLeft.fillStyle = 'white';
    ctxLeft.fillRect(0, 0, cellWidth, cellHeight);

    //spreadsheet highlight
    ctxLeft.beginPath();
    ctxLeft.strokeStyle = 'yellow'
    ctxLeft.lineWidth = 2;
    ctxLeft.rect((cellX - 1) * cellWidth, 0, cellWidth, cellHeight * (cellY - 1));
    ctxLeft.rect(0, (cellY - 1) * cellHeight, cellWidth * (cellX - 1), cellHeight);
    ctxLeft.stroke()
    ctxLeft.beginPath();
    ctxLeft.strokeStyle = 'white'
    ctxLeft.lineWidth = 4;
    ctxLeft.rect((cellX - 1) * cellWidth, (cellY - 1) * cellHeight, cellWidth, cellHeight);
    ctxLeft.stroke()

    //loading bar
    if ((Gxhr.loaded / Gxhr.total * 100) < 100) {
        ctx.beginPath();
        ctx.moveTo(0, sizes.height / 4);
        ctx.lineTo(sizes.width * (Gxhr.loaded / Gxhr.total), sizes.height / 4);
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();