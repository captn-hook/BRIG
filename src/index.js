import './style.css';
import imageUrl1 from './images/logo.png';
import imageUrl2 from './images/logoblack.png';
import favi from './images/favi16.ico';

var title = document.getElementById("title");
title.src = imageUrl1;

var icon = document.getElementById("icon");
icon.href = favi;

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
import {
    Vector3
} from 'three';

/*
Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    
*/

// Import the functions you need from the SDKs you need

import * as firebase from 'firebase/app';

import {
    initializeApp
} from 'firebase/app';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged
} from "firebase/auth";

import {
    getStorage,
    ref,
    listAll,
    getBlob,
    updateMetadata,
    getMetadata,
    list
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import {
    config
} from './key';


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

/*
    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup
*/

let Gxhr = 0;

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

var cameraTargPos = new THREE.Vector3(0, 0, 0);
var cameraTargView = new THREE.Vector3(0, 0, 0);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
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

const camBtn = document.getElementById('camBtn');

const resetBtn = document.getElementById('resetBtn');

const toggleBtn = document.getElementById('toggleBtn');

//dev funcs

var d0 = document.getElementById('log');
var d1 = document.getElementById('selectPanel1')
var d2 = document.getElementById('selectPanel2')

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

var btn1 = {
    saveFiles: function () {
        saveFile(ms, ts, tracers, insights, views);
    }
};

var btn2 = {
    saveCam: function () {
        console.log("saveCam")
        views[firstClickY - 1] = [String(camera.position.x), String(camera.position.y), String(camera.position.z)];
        console.log(views)
    }
};

var btn3 = {
    editPos: false
};

var targ = {
    textField: "UID"
};

var btn4 = {
    update: function () {

        // Update metadata properties
        const metadata = {
            customMetadata: {
                'WqkeGuRlDebTAWfMgR9mjYIUF4S2': true,
            }
        };

        listAll(ref(storage, '/Sites/' + dropd.value)).then((res) => {

            res.prefixes.forEach((folderRef) => {
                updateMetadata(folderRef, metadata)
                    .then((metadata) => {
                        // Updated metadata for 'images/forest.jpg' is returned in the Promise
                        console.log(metadata);
                    }).catch((error) => {
                        // Uh-oh, an error occurred!
                        console.error(error);
                    });
            });

            res.items.forEach((itemRef) => {

                updateMetadata(itemRef, metadata)
                    .then((metadata) => {
                        // Updated metadata for 'images/forest.jpg' is returned in the Promise
                        console.log(metadata);
                    }).catch((error) => {
                        // Uh-oh, an error occurred!
                        console.error(error);
                    });


            })
        }).catch((error) => {
            console.error(error);
        })
    }
}

var back = document.getElementById("bg")

var tx = document.getElementById("tx")

var bw = true;

var btns = document.getElementsByClassName("Btn");

var btn5 = {
    blackandwhite: function () {
        bw = !bw;

        if (bw) {
            scene.background = new THREE.Color(0x000000);
            back.style.background = "rgb(27, 27, 27)";
            title.src = imageUrl1;
            tx.style.color = "lightgray";
            textbox.style.backgroundColor = "gray";
            textbox.style.color = "white"


            for (var i = 0; i < btns.length; i++) {
                btns[i].style.backgroundColor = "gray";
                btns[i].style.borderColor = "rgb(27, 27, 27)";
                btns[i].style.color = "white";
            }
        } else {
            scene.background = new THREE.Color(0xffffff);
            back.style.background = "rgb(230, 230, 230)";
            title.src = imageUrl2;
            tx.style.color = "black";
            textbox.style.backgroundColor = "lightgray";
            textbox.style.color = "black"

            for (var i = 0; i < btns.length; i++) {
                btns[i].style.backgroundColor = "lightgray";
                btns[i].style.borderColor = "rgb(230, 230, 230)";
                btns[i].style.color = "black";
            }
        }
    }
};


function devMenu() {
    // Debug
    const gui = new dat.GUI();

    const devGUI = gui.addFolder('Dev');

    devGUI.add(btn0, 'editFiles');

    devGUI.add(btn1, 'saveFiles');

    devGUI.add(btn2, 'saveCam');

    devGUI.add(btn3, 'editPos', 'editPosition');

    devGUI.add(btn4, 'update');

    devGUI.add(btn5, 'blackandwhite');

    devGUI.add(targ, 'textField').onFinishChange((e) => {
        console.log(e);
    });

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
}
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

    sceneMeshes = [];

    sceneMeshes.push(obj.scene.children[0]);

    obj.scene.children[0].children.forEach((e) => {
        sceneMeshes.push(e);
    })

    scene.add(obj.scene);
    globalObj = scene.children[scene.children.length - 1];
}

// onProgress callback
function onProgressLog(xhr) {
    Gxhr = (xhr.loaded / xhr.total * 100);
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

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');
        loader.setDRACOLoader(dracoLoader);

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

    read.addEventListener('progress', (e) => {
        if ((e.loaded / e.total * 100) == 100) {
            Gxhr += 25;
        }
    })

    read.onloadend = function () {

        const loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();

        dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');

        loader.setDRACOLoader(dracoLoader);

        loader.parse(read.result, "", onLoadLoad, onErrorLog, onProgressLog);

        Gxhr = 0;

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

    var read = new FileReader();

    read.addEventListener('progress', (e) => {
        if ((e.loaded / e.total * 100) == 100) {
            Gxhr += 25;
        }
    })

    read.readAsBinaryString(input);

    read.onloadend = function () {

        [ms, ts, tracers, insights, views] = Data(read.result);

        //resize sheet
        updateSizes();


        cellWidth = (canvasleft.width / (ts.length + 1));
        cellHeight = (canvasleft.height / (ms.length + 1));
    }
}

function updateCam(x, y) {

    if (camFree) {

        if (x <= 1 && y <= 1) {

        } else if (y == 1) {
            //if y (row) == 1, ts
            var t = x - 2;

            cameraTargPos = new THREE.Vector3(parseFloat(ts[t].pos.x) + 14, parseFloat(ts[t].pos.z) + 30, parseFloat(ts[t].pos.y) + 8);
            cameraTargView = new THREE.Vector3(parseFloat(ts[t].pos.x), parseFloat(ts[t].pos.z), parseFloat(ts[t].pos.y));

            //throws errors if it trys to select row before/after last
        } else if (1 < y && y < ms.length + 2) {
            //if x (column) == 1, ms

            var m = y - 2;

            //special views
            if (views[y - 1] != null && views[y - 1][0] != '') {
                cameraTargPos = new THREE.Vector3(parseFloat(views[y - 1][0]), parseFloat(views[y - 1][1]), parseFloat(views[y - 1][2]));
            } else {
                cameraTargPos = new THREE.Vector3(parseFloat(ms[m].pos.x) + 14, parseFloat(ms[m].pos.z) + 30, parseFloat(ms[m].pos.y) + 8);
            }
            cameraTargView = new THREE.Vector3(parseFloat(ms[m].pos.x), parseFloat(ms[m].pos.z), parseFloat(ms[m].pos.y));

            //insights
            textbox.value = (insights[y] == null) ? '' : decodeURI(insights[y]).replaceAll('~', ',');

        }
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
const availableSites = ["IQ", "LHL", "Oshawa", "RWDI1", "RWDI1HEPA", "RWDI2", "RWDI3", "RZero", "Robinson", "Sanuvox", "Sarnia", "Sunflower", "Synergy"];
const accessibleSites = [];

function signedIn(user) {
    // The signed-in user info.
    // ...
    const ext = user.email.split('@')

    if (ext[1] == 'poppy.com') {
        devMenu();
    }

    switchDisplay(1);

    //check if site is accessible, if not, remove from available sites

    for (var i = 0; i < availableSites.length; i++) {

        var fileRef = ref(storage, '/Sites/' + availableSites[i] + '/' + availableSites[i] + '.glb');

        getMetadata(fileRef)
            .then((data) => {
                accessibleSites.push(data.name.split('.')[0]);
                siteList(accessibleSites);
            })
            .catch((err) => {

                console.error(err);

            })
    }
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

var looking = false;

/*
    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE

*/
const provider = new GoogleAuthProvider();

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user) {
        // User is signed in, see docs for a list of available properties
        signedIn(user);

    } else {
        // User is signed out
        // ...
    }
});

function login() {
    signInWithPopup(auth, provider)

        .then((result) => {
            
            signedIn(result.user);


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
}
/*
    EVENTS
*/

document.addEventListener("DOMContentLoaded", (e) => {
    updateSizes();
})

logoutBtn.addEventListener("click", (e) => {
    switchDisplay(0);
    auth.signOut();
})

loginBtn.addEventListener("click", (e) => {
    updateSizes();

    login();

})

//load files from google storage by dropdown name
dropd.addEventListener('change', (event) => {

    Gxhr = 0;

    [ms, ts, tracers, insights, views] = [
        [],
        [],
        [],
        [],
        []
    ];

    var modelRef = ref(storage, '/Sites/' + event.target.value + '/' + event.target.value + '.glb');

    var dataRef = ref(storage, '/Sites/' + event.target.value + '/data.csv');

    // .glb, load model

    getBlob(modelRef)
        .then((blob) => {
            Gxhr += 25;
            handleModels(blob);
        })
        .catch((err) => {
            console.error(err);
        })

    // .csv, load data

    getBlob(dataRef)
        .then((blob) => {
            Gxhr += 25;
            handleFiles(blob);
        })
        .catch((err) => {
            console.error('No Data', err);
        })
})


//buttons

valueBtn.addEventListener("click", (e) => {
    if (valueBtn.innerHTML == 'Show values') {
        valueBtn.innerHTML = 'Hide values';
        //show values
        doVals = true;
    } else {
        valueBtn.innerHTML = 'Show values';
        //hide values
        doVals = false;
    }
})

var alpha = true;

opacityBtn.addEventListener("click", (e) => {
    if (!alpha) {
        opacityBtn.innerHTML = 'Transparent';
        alpha = true;
        //show values
    } else {
        opacityBtn.innerHTML = 'Opaque';
        alpha = false;
        //hide values
    }
})


flipBtn.addEventListener("click", (e) => {

    if (flipBtn.innerHTML == 'Flip Selection ◐') {
        flipBtn.innerHTML = 'Flip Selection ◑';
        //show values
    } else {
        flipBtn.innerHTML = 'Flip Selection ◐';
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

var camFree = true;

camBtn.addEventListener("click", (e) => {
    if (camBtn.innerHTML == 'Multi 🎥') {
        camBtn.innerHTML = 'Locked 📷';
        controls.enabled = false;
        camFree = true;
    } else if (camBtn.innerHTML == 'Locked 📷') {
        camBtn.innerHTML = 'Free 📹';
        controls.enabled = true;
        camFree = false;
    } else {
        camBtn.innerHTML = 'Multi 🎥';
        controls.enabled = true;
        camFree = true;
    }
})

resetBtn.addEventListener("click", (e) => {
    if (resetBtn.innerHTML == 'Toggle all ❎') {
        resetBtn.innerHTML = 'Toggle all ✅';

        //set every m, t, and tracer to visible
        ms.forEach((m) => {
            m.visible = true;
        })
        ts.forEach((t) => {
            t.visible = true;
        })
        tracers.forEach((t) => {
            t.visible = true;
        })

    } else {
        resetBtn.innerHTML = 'Toggle all ❎';

        //set every m, t, and tracer to hidden
        ms.forEach((m) => {
            m.visible = false;
        })
        ts.forEach((t) => {
            t.visible = false;
        })
        tracers.forEach((t) => {
            t.visible = false;
        })

    }
})

toggleBtn.addEventListener("click", (e) => {

    var mode = null;

    if (toggleBtn.innerHTML == 'Toggle selection ◧') {
        toggleBtn.innerHTML = 'Toggle selection ◨';
        mode = true;
    } else {
        toggleBtn.innerHTML = 'Toggle selection ◧';
        mode = false;
    }

    //find the difference between click 1 and click 2
    var minx = ((firstClickX < secondClickX) ? firstClickX : secondClickX) - 1;
    var miny = ((firstClickY < secondClickY) ? firstClickY : secondClickY) - 1;
    var x = Math.abs(secondClickX - firstClickX) + minx;
    var y = Math.abs(secondClickY - firstClickY) + miny;

    tracers.forEach((t) => {
        if (t.t.i >= minx && t.t.i <= x && t.m.i >= miny && t.m.i <= y) {
            t.visible = mode;
        }
    })

    if (minx == 0) {
        ms.forEach((m) => {
            if (m.i >= miny && m.i <= y) {
                m.visible = mode;
            }
        })
    }

    if (miny == 0) {
        ts.forEach((d) => {
            if (d.i >= minx && d.i <= x) {
                d.visible = mode;
            }
        })
    }
})

//canvas
canvas2d.addEventListener("mousedown", (e) => {
    if (camFree) {
        looking = false;
    }
})

canvas2d.addEventListener("click", (e) => {
        if (camFree) {
            looking = false;
        }


        if (btn3.editPos) {

            var raycaster = new THREE.Raycaster();
            var mouse = {
                x: (e.clientX - canvasleft.innerWidth) / renderer.domElement.clientWidth * 2 - 1,
                y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
            };

            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(sceneMeshes, true);

            console.log(intersects, sceneMeshes);

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

        //                                   min dist
        if (camera.position.distanceTo(new Vector3(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]))) > .03) {

            looking = true;
            cameraTargPos = new THREE.Vector3(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]))
            camera.rotation.set(parseFloat(params[3]), parseFloat(params[4]), parseFloat(params[5]))

            controls.update();

        }

    }

});

canvasleft.addEventListener('mousedown', (e) => {
    console.log(cellX, cellY)
    if (firstClick) {
        firstClick = false;

        secondClickX = null;
        secondClickY = null;

        //grabs position of mouse, upaated by mousemove event
        firstClickX = cellX;
        firstClickY = cellY;



        window.location.hash = ("X=" + cellX + "&Y=" + cellY);
    }
})

canvasleft.addEventListener('click', (e) => {
    console.log(cellX, cellY)
    if (camFree) {
        looking = true;
    }
    //single click, place markers 1 and 2
    if (e.detail == 1) {
        if (firstClick) {

            //update camera on mouse click
            updateCam(cellX, cellY)

            //grabs position of mouse, upaated by mousemove event
            firstClickX = cellX;
            firstClickY = cellY;

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

        updateCam(cellX, cellY);

        //get m/t/tracer by cellX and cellY
        if (cellX <= 1 && cellY <= 1) {
            //do nothing
        } else if (cellY == 1) {

            var state = !ts[cellX - 2].visible

            ts[cellX - 2].visible = state;

            tracers.forEach((t) => {
                if (t.t.i == cellX - 1) {
                    t.visible = state;
                }
            })

        } else if (cellX == 1) {

            var state = !ms[cellY - 2].visible

            ms[cellY - 2].visible = state;

            if (state == true) {
                ts.forEach(t => { t.visible = true })
            }

            tracers.forEach((t) => {
                if (t.m.i == cellY - 1) {
                    t.visible = state;
                }
            })

        } else {

            tracers.forEach((t) => {
                if (t.m.i == cellY - 1 && t.t.i == cellX - 1) {
                    t.visible = !t.visible;
                }
            })

        }

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
load example
*/
var modelRef = ref(storage, '/Example/example.glb');

var dataRef = ref(storage, '/Example/data.csv');

// .glb, load model

getBlob(modelRef)
    .then((blob) => {
        Gxhr += 25;
        handleModels(blob);
    })
    .catch((err) => {
        console.error(err);
    })

// .csv, load data

getBlob(dataRef)
    .then((blob) => {
        Gxhr += 25;
        handleFiles(blob);
    })
    .catch((err) => {
        console.error('No Data', err);
    })

/*
Animate
*/

const tick = () => {

    const elapsedTime = clock.getElapsedTime();

    //if camera.position isnt cameraTargPos, move camera towards point
    if (looking && camera.position.distanceTo(cameraTargPos) > .05) {
        camera.position.lerp(cameraTargPos, .03)
    } else {
        looking = false;
    }

    //if controls.target isnt cameraTargView, turn camera towards point
    if (looking && controls.target.distanceTo(cameraTargView) > .05) {
        controls.target.lerp(cameraTargView, .03)
    } else {
        looking = false;
    }

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
    ms.forEach(pt => pt.drawPt(ctx, ctxLeft, camera, sizes, cellWidth, cellHeight, bw));
    ts.forEach(pt => pt.drawPt(ctx, ctxLeft, camera, sizes, cellWidth, cellHeight, bw));

    if (bw) {
        ctxLeft.fillStyle = 'black';
    } else {
        ctxLeft.fillStyle = 'white';
    }
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

            if (bw) {
                ctxLeft.strokeStyle = 'white'
            } else {
                ctxLeft.strokeStyle = 'black'
            }
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

    if (0 < Gxhr && Gxhr < 100) {
        ctx.beginPath();
        ctx.arc(sizes.width / 2, sizes.height / 2, Math.sin(elapsedTime) * 10 + 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgb(100, 100, ' + Math.sin(elapsedTime) * 255 + ')';
        ctx.fill();

    }


    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();