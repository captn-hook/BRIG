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

import {
    saveFile
} from './Data';
import { Vector3 } from 'three';

/*
Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref, listAll, getBlob } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { config } from './key';

console.log(config);

const firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: "brig-b2ca3.firebaseapp.com",
    projectId: "brig-b2ca3",
    storageBucket: "brig-b2ca3.appspot.com",
    messagingSenderId: "536591450814",
    appId: "1:536591450814:web:40eb73d5b1bf09ce36d4ef",
    measurementId: "G-0D9RW0VMCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage, '/Sites');


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

//cam size

function updateCamera() {
    camera.updateProjectionMatrix();
}
canvas2d.width = sizes.width;
canvas2d.height = sizes.height;

//selet
const dropd = document.getElementById("dropdown");

// Canvas
const canvas3d = document.querySelector('canvas.webgl');

const ctx = canvas2d.getContext('2d');

const spreadsheetDiv = document.getElementById("spreadsheet");

const canvasleft = document.getElementById('left');
canvasleft.oncontextmenu = () => false;

const ctxLeft = canvasleft.getContext('2d');

const textbox = document.getElementById('textbox');


//buttons
const loginBtn = document.getElementById('login');

const logoutBtn = document.getElementById('logout');

const valueBtn = document.getElementById('valueBtn');

const opacityBtn = document.getElementById('opacityBtn');

const flipBtn = document.getElementById('flipBtn');


// Debug
const gui = new dat.GUI();

const devGUI = gui.addFolder('Dev');

var d0 = document.getElementById('log');
var d1 = document.getElementById('selectPanel1')
var d2 = document.getElementById('selectPanel2')


//dev funcs
function switchDisplay(state) {
    if (state == 0) {
        d0.style.display = 'block'
        d1.style.display = 'none'
        d2.style.display = 'none'
    } else if (state == 1) {
        d0.style.display = 'none'
        d1.style.display = 'block'
        d2.style.display = 'none'
    } else if (state == 2) {
        d0.style.display = 'none'
        d1.style.display = 'none'
        d2.style.display = 'block'
    }
}
//states: login 0, select panel 1, upload panel 2
var btn0 = {
    editFiles: function () {
        if (d0.style.display == 'block') {
            switchDisplay(1);
        } else if (d1.style.display == 'block') {
            switchDisplay(2);
        } else {
            switchDisplay(0);
        }
    }
};

devGUI.add(btn0, 'editFiles');

var btn1 = {
    saveFiles: function () {
        saveFile(ms, ts, tracers, insights, views);
    }
};

devGUI.add(btn1, 'saveFiles');


var btn2 = {
    saveCam: function () {
        console.log("saveCam")
        views[firstClickY - 1] = [String(camera.position.x), String(camera.position.y), String(camera.position.z)];
        console.log(views)
    }
};

devGUI.add(btn2, 'saveCam');


var btn3 = {
    editPos: false
};

devGUI.add(btn3, 'editPos', 'editPosition');

devGUI.add(textbox, 'readOnly', 'editText');

devGUI.open();

//cam menu
const camGUI = gui.addFolder('Cam');

camGUI.add(camera, 'fov', 1, 180).onChange(updateCamera);

const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);

camGUI.add(minMaxGUIHelper, 'min', 0.01, 50, 0.01).name('near').onChange(updateCamera);
camGUI.add(minMaxGUIHelper, 'max', 0.1, 200, 0.1).name('far').onChange(updateCamera);

camGUI.add(camera.position, 'x', -100, 100).listen()
camGUI.add(camera.position, 'y', -100, 100).listen()
camGUI.add(camera.position, 'z', -100, 100).listen()

camGUI.add(camera.rotation, 'x', -100, 100).listen()
camGUI.add(camera.rotation, 'y', -100, 100).listen()
camGUI.add(camera.rotation, 'z', -100, 100).listen()

camGUI.open();

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
//var [ms, ts, tracers, insights, views] = Data(data);
var ms = []
var ts = []
var tracers = []
var insights = []
var views = []
//loadfunc =====================================================<
//load3DModel(building);

var globalObj;
var sceneMeshes = [];

// onLoad callback
function onLoadLoad(obj) {
    console.log(obj)
    obj.scene.children[0].children.forEach((e) => {
        sceneMeshes.push(e);
    })

    scene.add(obj.scene);
    globalObj = scene.children[scene.children.length - 1];
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

const dataInput = document.getElementById("datapicker");

const modelInput = document.getElementById("modelpicker");


//data funccs

function handleModels(input) {
    //remove old stuff first

    if (globalObj != null) {
        scene.remove(globalObj);
    }

    var read = new FileReader();

    read.readAsArrayBuffer(input);

    read.onloadend = function () {
        console.log(read.result);

        const loader = new GLTFLoader();
        loader.parse(read.result, "", onLoadLoad, onErrorLog);

    }
}

function blankClicks() {
    firstClick = true;
    firstClickX = null;
    firstClickY = null;
    secondClickX = null;
    secondClickY = null;
}

function handleFiles(input) {

    //remove old stuff first
    blankClicks();

    console.log(input);

    var read = new FileReader();

    read.readAsBinaryString(input);

    read.onloadend = function () {
        console.log(read.result);
        [ms, ts, tracers, insights, views] = Data(read.result);

        //resize sheet
        updateSizes();


        cellWidth = (canvasleft.width / (ts.length + 1));
        cellHeight = (canvasleft.height / (ms.length + 1));
    }
}

function updateCam(x, y) {

    if (x <= 1 && y <= 1) {

    } else if (y == 1) {
        //if y (row) == 1, ts
        var t = x - 2;

        camera.position.set(parseFloat(ts[t].pos.x) + 14, parseFloat(ts[t].pos.z) + 30, parseFloat(ts[t].pos.y) + 8);
        controls.target.set(parseFloat(ts[t].pos.x), parseFloat(ts[t].pos.z), parseFloat(ts[t].pos.y));

        //throws errors if it trys to select row before/after last
    } else if (1 < y && y < ms.length + 2) {
        //if x (column) == 1, ms

        var m = y - 2;

        //special views
        if (views[y - 1] != null && views[y - 1][0] != '') {
            camera.position.set(parseFloat(views[y - 1][0]), parseFloat(views[y - 1][1]), parseFloat(views[y - 1][2]));
        } else {
            camera.position.set(parseFloat(ms[m].pos.x) + 14, parseFloat(ms[m].pos.z) + 30, parseFloat(ms[m].pos.y) + 8);
        }
        controls.target.set(parseFloat(ms[m].pos.x), parseFloat(ms[m].pos.z), parseFloat(ms[m].pos.y));

        //insights
        textbox.value = (insights[y] == null) ? '' : decodeURI(insights[y]).replaceAll('~', ',');

    }
}

function bounds(x1, y1, x2, y2) {
    //returns the bounds of the current selection
    var x = (((x1 < x2) ? x1 : x2) - 1) * cellWidth
    var y = (((y1 < y2) ? y1 : y2) - 1) * cellHeight

    var w = (Math.abs(x1 - x2) + 1) * cellWidth
    var h = (Math.abs(y1 - y2) + 1) * cellHeight

    return [x, y, w, h]
}

//sign in function

function signedIn(result) {

    switchDisplay(1);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...

    const availableSites = [];

    listAll(storageRef)
        .then((res) => {
            res.prefixes.forEach((folderRef) => {
                availableSites.push(folderRef.name);
            });

            res.items.forEach((itemRef) => {
                console.log(itemRef.name);
            });

            siteList(availableSites);

        })
}

function siteList(s) {

    //empty dropdown
    while (dropd.firstChild) {
        dropd.removeChild(dropd.firstChild);
    }
    s.forEach((site) => {
        var option = document.createElement("option");
        option.text = site;
        dropd.add(option);
    })

}
//live variables

var cellWidth = (canvasleft.width / (ts.length + 1));
var cellHeight = (canvasleft.height / (ms.length + 1));


var cellX = 0;
var cellY = 0;

var doVals = false;


//spreadsheet click
var firstClickX = null;
var firstClickY = null;

var secondClickX = null;
var secondClickY = null;

var firstClick = null;

/*
    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE

*/


/*
    EVENTS
*/

document.addEventListener("DOMContentLoaded", (e) => {
    updateSizes();
})

logoutBtn.addEventListener("click", (e) => {
    const auth = getAuth();
    auth.signOut();
})

loginBtn.addEventListener("click", (e) => {
    updateSizes();

    const provider = new GoogleAuthProvider();

    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            signedIn(result);
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);

            console.error(error, errorCode, errorMessage, email, credential);
            // ...
        });



})

//load files from google storage by dropdown name
dropd.addEventListener('change', (event) => {


    var data = listAll(ref(storage, '/Sites/' + event.target.value)).then((res) => {

        res.prefixes.forEach((folderRef) => {
            console.log(folderRef.name);
        });

        res.items.forEach((itemRef) => {

            //if the file extension is .glb, load model
            if (itemRef.name.split('.')[1] == 'glb') {
                console.log('glb', itemRef)
                getBlob(itemRef)
                    .then((blob) => {
                        console.log(blob);
                        handleModels(blob);
                    })
            } else if (itemRef.name.split('.')[1] == 'csv') {
                //if the file extension is .csv, load data
                console.log('csv', itemRef)
                getBlob(itemRef)
                    .then((blob) => {
                        console.log(blob);
                        handleFiles(blob);
                    })
            }
        });
    });
})

//buttons

valueBtn.addEventListener("click", (e) => {
    if (valueBtn.innerHTML == '/') {
        valueBtn.innerHTML = '%';
        //show values
        doVals = true;
    } else {
        valueBtn.innerHTML = '/';
        //hide values
        doVals = false;
    }
})

var alpha = true;

opacityBtn.addEventListener("click", (e) => {
    if (!alpha) {
        opacityBtn.innerHTML = '-';
        alpha = true;
        //show values
    } else {
        opacityBtn.innerHTML = '0';
        alpha = false;
        //hide values
    }
})


flipBtn.addEventListener("click", (e) => {

    if (flipBtn.innerHTML == '◐') {
        flipBtn.innerHTML = '◑';
        //show values
    } else {
        flipBtn.innerHTML = '◐';
        //hide values
    }
    //find the difference between click 1 and click 2
    var minx = ((firstClickX < secondClickX) ? firstClickX : secondClickX) - 1;
    var miny = ((firstClickY < secondClickY) ? firstClickY : secondClickY) - 1;
    var x = Math.abs(secondClickX - firstClickX) + minx;
    var y = Math.abs(secondClickY - firstClickY) + miny;

    tracers.forEach((t) => {
        if (t.t.i >= minx && t.t.i <= x && t.m.i >= miny && t.m.i <= y) {
            t.visible = !t.visible;
        }
    })

    console.log(minx, miny)
    if (minx == 0) {
        ms.forEach((m) => {
            if (m.i >= miny && m.i <= y) {
                m.visible = !m.visible;
            }
        })
    }

    if (miny == 0) {
        ts.forEach((d) => {
            if (d.i >= minx && d.i <= x) {
                d.visible = !d.visible;
            }
        })
    }
})

//canvas
canvas2d.addEventListener("click", (e) => {
    if (btn3.editPos) {

        var raycaster = new THREE.Raycaster();
        var mouse = {
            x: (e.clientX - canvasleft.innerWidth) / renderer.domElement.clientWidth * 2 - 1,
            y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
        };

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(sceneMeshes, false);

        if (intersects.length > 0) {
            if (firstClickX == 1) {
                ms[firstClickY - 2].pos = new THREE.Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
            } else if (firstClickY == 1) {
                ts[firstClickX - 2].pos = new THREE.Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
            }
        }
    }

    //store pos in link
    var pos = String(Math.round(camera.position.x * 100) / 100) + "&" + String(Math.round(camera.position.y * 100) / 100) + "&" + String(Math.round(camera.position.z * 100) / 100) + "&" + String(Math.round(camera.rotation.x * 100) / 100) + "&" + String(Math.round(camera.rotation.y * 100) / 100) + "&" + String(Math.round(camera.rotation.z * 100) / 100)

    if (pos[0] != null) {
        window.location.hash = pos;
    }
},
    false);

textbox.addEventListener('input', e => {
    if (textbox.readOnly == false) {
        insights[firstClickY] = encodeURI(textbox.value.replaceAll(/,/g, '~'));
        console.log(textbox.value)
    }
})

//file input
dataInput.addEventListener("change", (e) => {
    handleFiles(dataInput.files[0]);
}, false);

modelInput.addEventListener("change", (e) => {
    handleModels(modelInput.files[0]);
}, false);

window.addEventListener('hashchange', (e) => {

    var hash = window.location.hash.substring(1)
    var params = hash.split("&")

    if (params.length == 2) {
        if (params[0].substring(2) != cellX || params[1].substring(2) != cellY) {
            firstClickX = params[0].substring(2);
            firstClickY = params[1].substring(2);
            updateCam(firstClickX, firstClickY)
        }
    } else if (params.length == 6) {

        var pos = new Vector3(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]))
        var rot = new Vector3(parseFloat(params[3]), parseFloat(params[4]), parseFloat(params[5]))

        console.log(pos, rot, camera.position.distanceTo(pos))
        //                                   min dist
        if (camera.position.distanceTo(new Vector3(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]))) > .03) {

            camera.position.set(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]))
            camera.rotation.set(parseFloat(params[3]), parseFloat(params[4]), parseFloat(params[5]))

            controls.update();

        }

    }

});

canvasleft.addEventListener('click', (e) => {
    //single click, place markers 1 and 2
    if (e.detail == 1) {
        if (firstClick) {
            firstClick = false;

            secondClickX = null;
            secondClickY = null;

            //grabs position of mouse, upaated by mousemove event
            firstClickX = cellX;
            firstClickY = cellY;

            //update camera on mouse click
            updateCam(cellX, cellY)

            window.location.hash = ("X=" + cellX + "&Y=" + cellY)

        } else {
            firstClick = true;

            //grabs position of mouse, upated by mousemove event
            secondClickX = cellX;
            secondClickY = cellY;

            //update camera on mouse click
            updateCam(cellX, cellY)

            window.location.hash = ("X=" + cellX + "&Y=" + cellY)

        }
        //double click, clear markers
    } else if (e.detail == 2) {
        blankClicks();
    }

}, false);

//spreadsheet mouse move, tracks mouse position to cellX and cellY
canvasleft.addEventListener("mousemove", (e) => {

    var rect = canvasleft.getBoundingClientRect();
    var x = e.pageX - rect.left;
    var y = e.pageY - rect.top;
    cellX = Math.ceil(x / cellWidth);
    cellY = Math.ceil(y / cellHeight);
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

    // Update Orbital Controls
    controls.update();
    // Render
    renderer.render(scene, camera);

    //New Frame
    ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
    ctxLeft.clearRect(0, 0, canvasleft.width, canvasleft.height);

    //Tracers
    tracers.forEach(t => t.drawTracer(ctx, ctxLeft, camera, sizes, cellWidth, cellHeight, alpha, doVals));

    //Points
    ms.forEach(pt => pt.drawPt(ctx, ctxLeft, camera, sizes, cellWidth, cellHeight));
    ts.forEach(pt => pt.drawPt(ctx, ctxLeft, camera, sizes, cellWidth, cellHeight));

    ctxLeft.fillStyle = 'white';
    ctxLeft.fillRect(0, 0, cellWidth, cellHeight);

    //click 1
    if (firstClick != null) {


        //click 2
        if (secondClickX == null && secondClickY == null) {

            //spreadsheet highlight mousemove
            ctxLeft.beginPath();
            ctxLeft.strokeStyle = 'yellow'
            ctxLeft.lineWidth = 2;

            var [x, y, w, h] = bounds(firstClickX, firstClickY, cellX, cellY);

            ctxLeft.rect(x, 0, w, cellHeight * (((firstClickY < cellY) ? cellY : firstClickY)));
            ctxLeft.stroke()

            ctxLeft.rect(0, y, cellWidth * (((firstClickX < cellX) ? cellX : firstClickX)), h);
            ctxLeft.stroke()

            ctxLeft.beginPath();

            ctxLeft.strokeStyle = 'grey'
            ctxLeft.lineWidth = 4;

            ctxLeft.rect((firstClickX - 1) * cellWidth, (firstClickY - 1) * cellHeight, cellWidth, cellHeight);
            ctxLeft.stroke()


        } else {
            ctxLeft.beginPath();

            ctxLeft.strokeStyle = 'white'
            ctxLeft.lineWidth = 4;

            var [x, y, w, h] = bounds(secondClickX, secondClickY, firstClickX, firstClickY);
            ctxLeft.rect(x, y, w, h);
            ctxLeft.stroke()

        }
    }

    //values
    if (doVals) {
        tracers.forEach(t => t.drawValues(ctx, ctxLeft, camera, sizes, cellWidth, cellHeight));
    }

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