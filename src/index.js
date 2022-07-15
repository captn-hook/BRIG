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
//const camera = new THREE.OrthographicCamera(sizes.width / -2, sizes.width / 2, sizes.height / 2, sizes.height / -2, .01, 1000);
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 30;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeaeaea);
scene.add(camera);


// Debug
/*
const gui = new dat.GUI();

function updateCamera() {
    camera.updateProjectionMatrix();
}

gui.add(camera, 'fov', 1, 180).onChange(updateCamera);

const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);

gui.add(minMaxGUIHelper, 'min', 0.01, 50, 0.01).name('near').onChange(updateCamera);
gui.add(minMaxGUIHelper, 'max', 0.1, 200, 0.1).name('far').onChange(updateCamera);
*/

// Canvas
const canvas3d = document.querySelector('canvas.webgl');

const canvas2d = document.getElementById('2d');

const ctx = canvas2d.getContext('2d');

const spreadsheetDiv = document.getElementById("spreadsheet");

const canvasleft = document.getElementById('left');

const ctxLeft = canvasleft.getContext('2d');


//set size
updateSizes();
    
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

var [ms, ts, tracers] = Data(data);

/*
Test OBJ
*/

const center = new Point3d('Marker', 0, 0xffffff, new THREE.Vector3(0, 0, 0), 2);
scene.add(center.sphere);

/*
Loaded Objects
*/

//loadfunc =====================================================<
load3DModel(building);

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

function updateSizes(){
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

/*
    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE

*/



canvasleft.addEventListener('click', (e) => {

    var rect = canvasleft.getBoundingClientRect();
    var x = e.pageX - rect.left;
    var y = e.pageY - rect.top;

    var cX = Math.ceil(x / cellWidth);
    var cY = Math.ceil(y / cellHeight);
    console.log('click', x, y, cX, cY);

    if (cX <= 1 && cY <= 1) {

    } else if (cY == 1) {
    //if y (row) == 1, clicked ts
        ts[cX - 2].visible = !ts[cX - 2].visible;
    } else if (cX == 1) {
        //if x (column) == 1, clicked ms
        ms[cY - 2].visible = !ms[cY - 2].visible;
    }  else {
        tracers.forEach((t) => {
            if (t.t.i == cX - 1 && t.m.i == cY - 1) {
                t.visible = !t.visible;
            }
        })
    }

}, false);

canvasleft.addEventListener("mousemove", (e) => {
    var rect = canvasleft.getBoundingClientRect();
    var x = e.pageX - rect.left;
    var y = e.pageY - rect.top;
    cellX = Math.ceil(x / cellWidth);
    cellY = Math.ceil(y / cellHeight);
});


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

function drawPt(pt) {
    //main canvas
    var [x, y] = pt.screenPt(camera, sizes.width / 2, sizes.height / 2);

    if (x != null && pt.visible) {


        ctx.beginPath();
        ctx.arc(x, y, pt.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = pt.color;
        ctx.fill();
        ctx.lineWidth = pt.border;
        ctx.strokeStyle = '#2f2f2f';
        ctx.stroke();

        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(pt.name, x, y);

    }

    //left canvas

    ctxLeft.font = "10px Arial";

    if (pt.visible) {
        ctxLeft.globalAlpha = 1.0;
        ctxLeft.fillStyle = "white";
    } else {
        ctxLeft.globalAlpha = 0.2;
        ctxLeft.fillStyle = "grey";
    }
    ctxLeft.globalAlpha = 1.0;

    ctxLeft.textAlign = "center";

    if (pt.type == 'M') {
        ctxLeft.fillRect(0, pt.i * cellHeight, cellWidth, cellHeight);
        ctxLeft.fillStyle = "black";
        ctxLeft.fillText(pt.name, 10, pt.i * cellHeight + 10);  
    } else if (pt.type == 'T') {
        ctxLeft.fillRect(pt.i * cellWidth, 0, cellWidth, cellHeight);
        ctxLeft.fillStyle = "black";
        ctxLeft.fillText(pt.name, pt.i * cellWidth + 10, 10);
    } else {
        console.error('Type Error: Left Canvas')
    }
}

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
    //console.log(tracers)
    for (var i = 0; i < tracers.length; i++) {

        //start,     ctrl1,  ctrl2,    end   arw 1   arw 2
        var [x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6] = tracers[i].screenPts(camera, sizes.width / 2, sizes.height / 2)

        if (x1 != null && tracers[i].visible) {


            //tracer highlight, by drawing white tracer underneath
            if (tracers[i].t.i == cellX - 1 && tracers[i].m.i == cellY - 1) {
                //console.log(tracers[i])

                //settings
                ctx.lineWidth = tracers[i].outline + 2;
                ctx.strokeStyle = 'white';

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x5, y5);
                ctx.lineTo(x6, y6);
                ctx.lineTo(x1, y1);
                ctx.stroke();

                // Cubic Bézier curve
                ctx.beginPath();
                //start line at arrow tip edge
                var [strtx, strty] = tracers[i].midpoint(x5, y5, x6, y6);
                ctx.moveTo(strtx, strty);
                //                ctrl1    ctrl2   end
                ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
                ctx.stroke();

                ctx.font = "12px Arial";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText(tracers[i].value, x1, y1);

                ctxLeft.font = "12px Arial";
                ctxLeft.fillStyle = "black";
                ctxLeft.textAlign = "center";
                ctxLeft.fillText(tracers[i].value, cellX * cellWidth, cellY * cellHeight - 30);
            }
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
            //start line at arrow tip edge
            var [strtx, strty] = tracers[i].midpoint(x5, y5, x6, y6);
            ctx.moveTo(strtx, strty);
            //                ctrl1    ctrl2   end
            ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
            ctx.stroke();

        } else {
            //console.log(tracers[i])
        }

        //spreadsheet
        if (tracers[i].visible) {
            ctxLeft.globalAlpha = 1.0;
        } else {
            ctxLeft.globalAlpha = .2;
        }
        ctxLeft.fillStyle = tracers[i].color;
        ctxLeft.fillRect(tracers[i].t.i * cellWidth, tracers[i].m.i * cellHeight, cellWidth, cellHeight);
        ctxLeft.globalAlpha = 1.0;
    };

    //Points
    ms.forEach(drawPt);
    ts.forEach(drawPt);

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