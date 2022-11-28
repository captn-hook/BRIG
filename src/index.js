import './style.css';
import imageUrl1 from './images/logo.png';
import imageUrl2 from './images/logoblack.png';
import favi from './images/favi16.ico';

var title = document.getElementById('title');
title.src = imageUrl1;

var icon = document.getElementById('icon');
icon.href = favi;

import * as THREE from 'three';

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

import FileExt from './FileExt.js';

import {
    Data,
    saveFile,
    sendFile,
    RemoteData,
    GetGroups,
    saveGroup,
    userSites
} from './Data';

import {
    Panel
} from './Panel.js';

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
} from 'firebase/auth';

import {
    getStorage,
    ref,
    listAll,
    getBlob,
    updateMetadata,
    getMetadata,
} from 'firebase/storage';

import {
    getFunctions,
    httpsCallable,
    //connectFunctionsEmulator
} from 'firebase/functions';

import {
    getFirestore,
    setDoc,
    deleteDoc,
    doc
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import {
    config
} from './key';


const firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: 'brig-b2ca3.firebaseapp.com',
    projectId: 'brig-b2ca3',
    storageBucket: 'brig-b2ca3.appspot.com',
    messagingSenderId: '536591450814',
    appId: '1:536591450814:web:40eb73d5b1bf09ce36d4ef',
    measurementId: 'G-0D9RW0VMCQ'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const db = getFirestore(app);

const functions = getFunctions(app);
//connectFunctionsEmulator(functions, 'localhost', 5001);

const listUsers = httpsCallable(functions, 'listUsers');

/*
    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup
*/

let Gxhr = 0;

const div = document.getElementById('3d');

const sizes = {
    width: div.offsetWidth,
    height: div.offsetHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 500);

camera.position.set(5, 5, 5); // Set position like this
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Controls
const canvas2d = document.getElementById('2d');

const controls = new OrbitControls(camera, canvas2d);
controls.enableDamping = true;

controls.target.set(0, 0, 0);

var cameraTargPos = new THREE.Vector3(5, 5, 5);
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
const dropd = document.getElementById('dropdown');

// Canvas
const canvas3d = document.querySelector('canvas.webgl');

const ctx = canvas2d.getContext('2d');

const spreadsheetDiv = document.getElementById('spreadsheet');

const leftPanel = new Panel(document.getElementById('left'));

//canvasleft.oncontextmenu = () => false;

const sGroup = document.getElementById('saveGroup');
const aGroup = document.getElementById('addGroup');
const dGroup = document.getElementById('deleteGroup');

//const ctxLeft = canvasleft.getContext('2d');

const textbox = document.getElementById('textbox');


//buttons

//buttons

var alpha = true;

document.getElementById('login').addEventListener('click', (e) => {
    updateSizes();
    login();
})

document.getElementById('logout').addEventListener('click', (e) => {
    siteList([]);
    availableSites = [];
    accessibleSites = [];
    switchDisplay(0);
    auth.signOut();
})

document.getElementById('valueBtn').addEventListener('click', (e) => {
    if (e.target.innerHTML == 'Show values') {
        e.target.innerHTML = 'Hide values';
        //show values
        doVals = true;
    } else {
        e.target.innerHTML = 'Show values';
        //hide values
        doVals = false;
    }
})

document.getElementById('opacityBtn').addEventListener('click', (e) => {
    if (!alpha) {
        e.target.innerHTML = 'Transparent';
        alpha = true;
        //show values
    } else {
        e.target.innerHTML = 'Opaque';
        alpha = false;
        //hide values
    }
})

document.getElementById('flipBtn').addEventListener('click', (e) => {

    if (e.target.innerHTML == 'Flip Selection ◐') {
        e.target.innerHTML = 'Flip Selection ◑';
        //show values
    } else {
        e.target.innerHTML = 'Flip Selection ◐';
        //hide values
    }
    //find the difference between click 1 and click 2
    var minx = ((leftPanel.firstClickX < leftPanel.secondClickX) ? leftPanel.firstClickX : leftPanel.secondClickX) - 1;
    var miny = ((leftPanel.firstClickY < leftPanel.secondClickY) ? leftPanel.firstClickY : leftPanel.secondClickY) - 1;
    var x = Math.abs(leftPanel.secondClickX - leftPanel.firstClickX) + minx;
    var y = Math.abs(leftPanel.secondClickY - leftPanel.firstClickY) + miny;

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

document.getElementById('camBtn').addEventListener('click', (e) => {
    if (e.target.innerHTML == 'Multi 🎥') {
        e.target.innerHTML = 'Locked 📷';
        controls.enabled = false;
        camFree = true;
        leftPanel.setcam(camFree)
    } else if (e.target.innerHTML == 'Locked 📷') {
        e.target.innerHTML = 'Free 📹';
        controls.enabled = true;
        camFree = false;
        leftPanel.setcam(camFree)
    } else {
        e.target.innerHTML = 'Multi 🎥';
        controls.enabled = true;
        camFree = true;
        leftPanel.setcam(camFree)
    }
})

document.getElementById('resetBtn').addEventListener('click', (e) => {
    if (e.target.innerHTML == 'Toggle all ❎') {
        e.target.innerHTML = 'Toggle all ✅';

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
        e.target.innerHTML = 'Toggle all ❎';

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

document.getElementById('readOnly').addEventListener('click', (e) => {
    textbox.readOnly = !textbox.readOnly;
})

document.getElementById('toggleBtn').addEventListener('click', (e) => {

    var mode = null;

    if (e.target.innerHTML == 'Toggle selection ◧') {
        e.target.innerHTML = 'Toggle selection ◨';
        mode = true;
    } else {
        e.target.innerHTML = 'Toggle selection ◧';
        mode = false;
    }

    //find the difference between click 1 and click 2
    var minx = ((leftPanel.firstClickX < leftPanel.secondClickX) ? leftPanel.firstClickX : leftPanel.secondClickX) - 1;
    var miny = ((leftPanel.firstClickY < leftPanel.secondClickY) ? leftPanel.firstClickY : leftPanel.secondClickY) - 1;
    var x = Math.abs(leftPanel.secondClickX - leftPanel.firstClickX) + minx;
    var y = Math.abs(leftPanel.secondClickY - leftPanel.firstClickY) + miny;

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

const bug1 = document.getElementById('bug1');
const bug2 = document.getElementById('bug2');

document.getElementById('groups').addEventListener('click', (e) => {
    leftPanel.spreadsheet = !leftPanel.spreadsheet;

    if (leftPanel.spreadsheet) {
        bug1.style.display = 'block'
        bug2.style.display = 'none'
        spreadsheetDiv.style.overflow = 'hidden';
    } else {
        bug1.style.display = 'none'
        bug2.style.display = 'block'
        spreadsheetDiv.style.overflow = 'auto';
    }
    updateSizes();
})

sGroup.addEventListener('click', plant1);

async function plant1() {
    if (leftPanel.gi != 0 && leftPanel.gi != -1) {
        leftPanel.groups[leftPanel.gi] = await saveGroup(db, dropd.value, leftPanel.gi, tracers, leftPanel.text)
    }
}

aGroup.addEventListener('click', plant2)

async function plant2() {
    var i = 0;
    leftPanel.groups.forEach((e) => {
        if (e != undefined) {
            i++;
        }
    })
    leftPanel.groups[i] = await saveGroup(db, dropd.value, i, tracers, leftPanel.text)

}

dGroup.addEventListener('click', (e) => {
    deleteDoc(doc(db, dropd.value, 'group' + leftPanel.gi));
    leftPanel.groups[leftPanel.gi] = undefined;
})

const ctrlBtn = document.getElementById('ctrlBtn');

const ctrl = document.getElementById('ctrl');

const root = document.getElementById('root');

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
document.getElementById('editFiles').addEventListener('click', (e) => {
    if (d0.style.display == 'block') {
        switchDisplay(1);
    } else if (d1.style.display == 'block') {
        switchDisplay(2);
    } else {
        switchDisplay(0);
    }
})

document.getElementById('saveFiles').addEventListener('click', (e) => {
    saveFile(ms, ts, tracers, insights, views);
})

document.getElementById('sendFiles').addEventListener('click', (e) => {
    if (dropd.value != defaultDropd)
        sendFile(ms, ts, tracers, insights, views, db, dropd.value);
})

document.getElementById('saveCam').addEventListener('click', (e) => {
    console.log('saveCam')
    views[leftPanel.firstClickY - 1] = [String(camera.position.x), String(camera.position.y), String(camera.position.z)];
    console.log(views)
})

var editPos = false;

document.getElementById('editPos').addEventListener('click', (e) => {
    if (editPos) {
        editPos = false;
    } else {
        editPos = true;
    }
})

document.getElementById('perms').addEventListener('click', savePerms);

async function savePerms() {

    var itemRef = ref(storage, '/Sites/' + dropd.value + '/' + dropd.value + '.glb')

    //var dataRef = ref(storage, '/Sites/' + dropd.value + '/data.csv')

    var inner = '';

    let d = {}



    inUsers.forEach((user) => {
        inner += '"' + user[1] + '":"' + user[0] + '",';

        d[user[1]] = user[0];

        setDoc(doc(db, user[0], dropd.value), {
            'access': true,
        })
    })

    allUsers.forEach((user) => {
        inner += '"' + user[1] + '":"false",';

        d[user[1]] = 'false';

        setDoc(doc(db, user[0], dropd.value), {
            'access': false,
        })
    })

    inner = inner.slice(0, -1);

    inner = '{"customMetadata":{' + inner + '}}';

    const newMetadata = JSON.parse(inner);

    updateMetadata(itemRef, newMetadata).then((metadata) => {

        /* updates csvs
        updateMetadata(dataRef, newMetadata).then((metadata) => {
*/
        populateTable();
        /*s

                }).catch((error) => {

                    console.log(error)

                });
        */
    }).catch((error) => {

        console.log(error)

    });
    /*
        try {
            const docRef = await setDoc(doc(db, dropd.value, 'access'), d);
            console.log("Document written");
        } catch (e) {
            console.error("Error adding document");
        }
    */
};

var back = document.getElementById('bg')

var tx = document.getElementById('tx')

var bw = true;

var btns = document.getElementsByClassName('Btn');

var cells = document.getElementsByClassName('cell');

document.getElementById('blackandwhite').addEventListener('click', (e) => {

    bw = !bw;

    leftPanel.setbw(bw)

    if (bw) {
        scene.background = new THREE.Color(0x000000);
        back.style.background = 'rgb(27, 27, 27)';
        title.src = imageUrl1;
        tx.style.color = 'lightgray';
        textbox.style.backgroundColor = 'gray';
        textbox.style.color = 'white'
        ctrl.style.backgroundColor = 'rgb(27, 27, 27)';

        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('btLight');
            btns[i].classList.add('btDark');
        }

        for (var i = 0; i < cells.length; i++) {
            cells[i].classList.remove('tbLight');
            cells[i].classList.add('tbDark');
        }
    } else {
        scene.background = new THREE.Color(0xffffff);
        back.style.background = 'rgb(230, 230, 230)';
        title.src = imageUrl2;
        tx.style.color = 'black';
        textbox.style.backgroundColor = 'lightgray';
        textbox.style.color = 'black'

        ctrl.style.backgroundColor = 'rgb(230, 230, 230)';

        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('btDark');
            btns[i].classList.add('btLight');
        }

        for (var i = 0; i < cells.length; i++) {
            cells[i].classList.add('tbLight');
            cells[i].classList.remove('tbDark');
        }
    }
})

var btn6 = {
    adminMenu: function () {
        if (ctrl.style.display == 'block') {
            ctrl.style.display = 'none';
            root.style.width = '100%';
        } else {
            ctrl.style.display = 'block';
            root.style.width = '80%';
        }
        window.dispatchEvent(new Event('resize'));
    }
};

function validateEmail(email) {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
/*
function getList() {

    const https = require('https');

    // Sample URL
    const url = 'https://jsonplaceholder.typicode.com/todos/1';

    const request = https.request(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data = data + chunk.toString();
        });

        response.on('end', () => {
            const body = JSON.parse(data);
            console.log(body);
        });
    })

    request.on('error', (error) => {
        console.log('An error', error);
    });

    request.end()
}
*/

//set group to selected
const table = document.getElementById('table');


var inUsers = [];
var allUsers = [];

function populateTable() {

    if (dropd.value != defaultDropd && dropd.value != 'Empty') {

        allUsers = allUsersM;
        inUsers = [];


        var itemRef = ref(storage, '/Sites/' + dropd.value + '/' + dropd.value + '.glb')

        getMetadata(itemRef).then((metadata) => {

                if (metadata.customMetadata != null) {

                    var names = Object.keys(metadata.customMetadata);
                    var data = Object.values(metadata.customMetadata);

                    names.forEach((user) => {

                        if (data[names.indexOf(user)] != 'false') {

                            inUsers.push([data[names.indexOf(user)], user]);

                            for (var i = 0; i < allUsers.length; i++) {
                                if (allUsers[i][1] == user) {
                                    allUsers.splice(i, 1);
                                }
                            }
                        }

                    });

                    pTable2(allUsers, inUsers);

                }
            })
            .catch((error) => {
                console.error(error);
            })

        pTable2(allUsers, inUsers);
    }
}

var aU = [];
var iU = [];

function pTable2(aU0, iU0) {

    var nerHTML = '<tr>\n<th class="cell">No Access</th><th class="cell">Access</th>\n</tr>\n';

    var big = iU0.length > aU0.length ? iU0.length : aU0.length;

    var style = bw ? 'tbDark' : 'tbLight';

    var tbIn = 'tbIn';

    for (var i = 0; i < big; i++) {

        nerHTML += '<tr>\n';

        if (i < aU0.length) {

            if (aU0[i].length > 2) {
                tbIn = 'tbOut';
            }

            nerHTML += '<td class="' + style + ' ' + tbIn + ' cell">' + aU0[i][1] + '</td>';

            tbIn = 'tbIn';
        } else {
            nerHTML += '<td class="' + style + ' ' + tbIn + ' cell"></td>';
        }

        if (i < iU0.length) {

            if (iU0[i].length > 2) {
                tbIn = 'tbOut';
            }

            nerHTML += '<td class="' + style + ' ' + tbIn + ' cell">' + iU0[i][1] + '</td>';

            tbIn = 'tbIn';
        } else {
            nerHTML += '<td class="' + style + ' ' + tbIn + ' cell"></td>';
        }

        nerHTML += '\n</tr>\n';

    }

    allUsers = aU0;
    inUsers = iU0;

    aU = []
    iU = []

    table.innerHTML = nerHTML;

    document.querySelectorAll('#table td')
        .forEach(e => e.addEventListener("click", cellListener));
}

function cellListener() {

    for (var i = 0; i < allUsers.length; i++) {

        if (allUsers[i][1] == this.innerHTML) {

            iU.push([allUsers[i][0], allUsers[i][1], 'flag']);

        } else {

            aU.push(allUsers[i]);

        }

    }

    for (var i = 0; i < inUsers.length; i++) {


        if (inUsers[i][1] == this.innerHTML) {

            aU.push([inUsers[i][0], inUsers[i][1], 'flag']);

        } else {

            iU.push(inUsers[i]);

        }

    }

    pTable2(aU, iU);
}

// btn event listeners

ctrlBtn.addEventListener('click', btn6.adminMenu);

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
var defaultDropd = 'Select a site';

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
        console.error('Could not load model')
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

    leftPanel.ctx.canvas.innerWidth = spreadsheetDiv.offsetWidth;

    leftPanel.canvas.width = spreadsheetDiv.offsetWidth;

    if (leftPanel.spreadsheet) {

        leftPanel.canvas.height = spreadsheetDiv.offsetHeight;

        leftPanel.ctx.canvas.innerHeight = spreadsheetDiv.offsetHeight;

    } else {

        leftPanel.canvas.height = leftPanel.groups.length * leftPanel.cellHeight

        //leftPanel.ctx.canvas.innerHeight = leftPanel.groups.length * leftPanel.cellHeight;

    }

    leftPanel.cellSize(spreadsheetDiv.offsetHeight);
}

const clock = new THREE.Clock();

const dataInput = document.getElementById('datapicker');

const modelInput = document.getElementById('modelpicker');


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

        loader.parse(read.result, '', onLoadLoad, onErrorLog, onProgressLog);

        Gxhr = 0;


        populateTable();

    }
}

function handleFiles(input) {

    //remove old stuff first
    leftPanel.blankClicks();

    var read = new FileReader();

    read.addEventListener('progress', (e) => {
        if ((e.loaded / e.total * 100) == 100) {
            Gxhr += 25;
        }
    })

    read.readAsBinaryString(input);

    read.onloadend = function () {

        [ms, ts, tracers, insights, views] = Data(read.result)

        leftPanel.setTracers(ms, ts, tracers)
        //resize sheet
        updateSizes();
    }
}

function updateCam() {

    if (leftPanel.camFree && leftPanel.spreadsheet) {

        if (leftPanel.mt == 0) {

        } else if (leftPanel.mt == 2) {
            //if y (row) == 1, ts

            cameraTargPos = new THREE.Vector3(parseFloat(ts[leftPanel.n].pos.x) + 14, parseFloat(ts[leftPanel.n].pos.z) + 30, parseFloat(ts[leftPanel.n].pos.y) + 8);
            cameraTargView = new THREE.Vector3(parseFloat(ts[leftPanel.n].pos.x), parseFloat(ts[leftPanel.n].pos.z), parseFloat(ts[leftPanel.n].pos.y));

            //throws errors if it trys to select row before/after last
        } else if (leftPanel.mt == 1) {
            //if x (column) == 1, ms
            //special views
            if (views[leftPanel.n + 1] != null && views[leftPanel.n + 1][0] != '') {
                cameraTargPos = new THREE.Vector3(parseFloat(views[leftPanel.n + 1][0]), parseFloat(views[leftPanel.n + 1][1]), parseFloat(views[leftPanel.n + 1][2]));
            } else {
                cameraTargPos = new THREE.Vector3(parseFloat(ms[leftPanel.n].pos.x) + 14, parseFloat(ms[leftPanel.n].pos.z) + 30, parseFloat(ms[leftPanel.n].pos.y) + 8);
            }
            cameraTargView = new THREE.Vector3(parseFloat(ms[leftPanel.n].pos.x), parseFloat(ms[leftPanel.n].pos.z), parseFloat(ms[leftPanel.n].pos.y));

            //insights
            if (leftPanel.spreadsheet) {
                textbox.value = (insights[leftPanel.n + 2] == null) ? '' : decodeURI(insights[leftPanel.n + 2]).replaceAll('~', ',');
            } else {

                textbox.value = (leftPanel.text == null) ? '' : decodeURI(leftPanel.text).replaceAll('~', ',');
            }

        }
    } else {

       // console.log("SJEEZ")

        try {
            //console.log(leftPanel.groups[leftPanel.gi]['pos'])
            leftPanel.looking = true;

            cameraTargPos = new THREE.Vector3(leftPanel.groups[leftPanel.gi]['pos'][0] + 10, leftPanel.groups[leftPanel.gi]['pos'][1] + 14, leftPanel.groups[leftPanel.gi]['pos'][2] + 8);
            cameraTargView = new THREE.Vector3(leftPanel.groups[leftPanel.gi]['pos'][0], leftPanel.groups[leftPanel.gi]['pos'][1], leftPanel.groups[leftPanel.gi]['pos'][2]);
        }
        catch (e) {
           // console.log(e)
        }
    }

}

//sign in function

var availableSites = [];

var folderRef = ref(storage, '/Sites')

var accessibleSites = [];

var allUsersM = [];

async function signedIn(user) {
    //empty list 
    siteList([]);

    // The signed-in user info.
    // ...
    const ext = user.email.split('@')

    //var allUsersM = []

    if (ext[1] == 'poppy.com') {

        ctrlBtn.style.display = 'block';
        sGroup.style.display = 'inline-block';
        aGroup.style.display = 'inline-block';
        dGroup.style.display = 'inline-block';

        listUsers().
        then((u) => {
                u.data.users.forEach((user) => {

                    if (user.email.split('@')[1] != 'poppy.com') {

                        allUsersM.push([user.uid, user.email]);

                    }
                });

            })

            .catch((error) => {
                //console.log('Error listing users:', error);
            });

        availableSites = [];

        allSites();

    } else {
        availableSites = [];

        userSites(db, user.uid).then((u) => {
            siteList(u);
        })
    }

    switchDisplay(1);

}

function allSites() {
    listAll(folderRef).then((e) => {

        for (var i = 0; i < e.prefixes.length; i++) {
            availableSites.push(e.prefixes[i].name)
        }

        var promises = [];

        for (var i = 0; i < availableSites.length; i++) {

            var fileRef = ref(storage, '/Sites/' + availableSites[i] + '/' + availableSites[i] + '.glb');

            promises.push(getMetadata(fileRef)
                .then((data) => {
                    availableSites.sort();
                    accessibleSites.sort();
                    accessibleSites.push(data.name.split('.')[0])

                })
                .catch((err) => {

                    //console.error(err);

                }));
        }

        Promise.all(promises).then(() => {
            siteList(accessibleSites);
        });

    })
}

function siteList(s) {
    //empty dropdown
    while (dropd.firstChild) {
        dropd.removeChild(dropd.firstChild);
    }

    //add default option
    var def = document.createElement('option');
    def.text = defaultDropd;
    dropd.add(def);

    s.forEach((site) => {
        var option = document.createElement('option');
        option.text = site;
        dropd.add(option);
    })

}

function loadRefAndDoc(ref, doc) {

    getBlob(ref)
        .then((blob) => {
            Gxhr += 25;
            handleModels(blob);
        })
        .catch((err) => {
            console.error(err);
        })

    RemoteData(db, doc).then((data) => {

        [ms, ts, tracers, insights, views] = data;

        leftPanel.setTracers(ms, ts, tracers)

        updateSizes();

    })


}

function loadRefs(ref1, ref2) {

    getBlob(ref1)
        .then((blob) => {
            Gxhr += 25;
            handleModels(blob);
        })
        .catch((err) => {
            console.error(err);
        })

    // .csv, load data

    getBlob(ref2)
        .then((blob) => {
            Gxhr += 25;
            handleFiles(blob);
        })
        .catch((err) => {
            console.error('No Data', err);
        })

}
//live variables

var doVals = false;


/*
    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE

*/
const provider = new GoogleAuthProvider();

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        login();

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

document.addEventListener('DOMContentLoaded', (e) => {
    updateSizes();
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

    if (event.target.value != defaultDropd) {

        var modelRef = ref(storage, '/Sites/' + event.target.value + '/' + event.target.value + '.glb');


        // .glb, load model

        //var dataRef = ref(storage, '/Sites/' + event.target.value + '/data.csv');

        //loadRefs(modelRef, dataRef)
        leftPanel.groups = GetGroups(db, event.target.value);

        loadRefAndDoc(modelRef, event.target.value);

    } else {
        //load default

        /*
        load example
        */
        var modelRef = ref(storage, '/Example/example.glb');

        var dataRef = ref(storage, '/Example/data.csv');

        // .glb, load model

        loadRefs(modelRef, dataRef)

        /*
        Animate
        */

    }
})


//canvas
canvas2d.addEventListener('mousedown', (e) => {
    if (camFree) {
        leftPanel.looking = false;
    }
})

canvas2d.addEventListener('click', (e) => {
        if (camFree) {
            leftPanel.looking = false;
        }


        if (editPos) {

            var raycaster = new THREE.Raycaster();
            var mouse = {
                x: (e.clientX - leftPanel.canvas.innerWidth) / renderer.domElement.clientWidth * 2 - 1,
                y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
            };

            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(sceneMeshes, true);

            if (intersects.length > 0) {
                if (leftPanel.firstClickX == 1) {
                    ms[leftPanel.firstClickY - 2].pos = new THREE.Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
                } else if (leftPanel.firstClickY == 1) {
                    ts[leftPanel.firstClickX - 2].pos = new THREE.Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
                }
            }
        }

        //store pos in link
        var pos = String(Math.round(camera.position.x * 100) / 100) + '&' + String(Math.round(camera.position.y * 100) / 100) + '&' + String(Math.round(camera.position.z * 100) / 100) + '&' + String(Math.round(camera.rotation.x * 100) / 100) + '&' + String(Math.round(camera.rotation.y * 100) / 100) + '&' + String(Math.round(camera.rotation.z * 100) / 100)

        if (pos[0] != null) {
            window.location.hash = pos;
        }
    },
    false);

textbox.addEventListener('input', e => {
    if (textbox.readOnly == false) {
        if (leftPanel.spreadsheet) {
            insights[leftPanel.firstClickY] = encodeURI(textbox.value.replaceAll(/,/g, '~'));
        } else {
            leftPanel.text = encodeURI(textbox.value.replaceAll(/,/g, '~'))
            console.log(leftPanel.text);
        }
    }
})

//file input
dataInput.addEventListener('change', (e) => {
    handleFiles(dataInput.files[0]);
}, false);

modelInput.addEventListener('change', (e) => {
    handleModels(modelInput.files[0]);
}, false);

window.addEventListener('hashchange', (e) => {

    var hash = window.location.hash.substring(1)
    var params = hash.split('&')

    if (params.length == 2) {
        if (params[0].substring(2) != leftPanel.cellX || params[1].substring(2) != leftPanel.cellY) {
            leftPanel.firstClickX = params[0].substring(2);
            leftPanel.firstClickY = params[1].substring(2);
            updateCam();
        }
    } else if (params.length == 6) {

        var pos = new Vector3(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]))
        var rot = new Vector3(parseFloat(params[3]), parseFloat(params[4]), parseFloat(params[5]))

        //                                   min dist
        if (camera.position.distanceTo(new Vector3(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]))) > .03) {

            leftPanel.looking = true;
            cameraTargPos = new THREE.Vector3(parseFloat(params[0]), parseFloat(params[1]), parseFloat(params[2]))
            camera.rotation.set(parseFloat(params[3]), parseFloat(params[4]), parseFloat(params[5]))

            controls.update();

        }

    }

});

//resize
window.addEventListener('resize', () => {
    // Update sizes
    updateSizes();

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

var lastgi = -1;

//load defaullt 
loadRefs(ref(storage, '/Example/example.glb'), ref(storage, '/Example/data.csv'))

const tick = () => {

    const elapsedTime = clock.getElapsedTime();

    if (leftPanel.looking) {
        updateCam();
    } else if (!leftPanel.spreadsheet) {
        updateCam();
    }

    //if camera.position isnt cameraTargPos, move camera towards point
    if (leftPanel.looking && camera.position.distanceTo(cameraTargPos) > .05) {
        camera.position.lerp(cameraTargPos, .03)
    } else if (leftPanel.looking && controls.target.distanceTo(cameraTargView) < .05) {
        leftPanel.looking = false;
    }

    //if controls.target isnt cameraTargView, turn camera towards point
    if (leftPanel.looking && controls.target.distanceTo(cameraTargView) > .05) {
        controls.target.lerp(cameraTargView, .03)
    } else if (leftPanel.looking && camera.position.distanceTo(cameraTargPos) < .05) {
        leftPanel.looking = false;
    }

    // Update Orbital Controls

    controls.update();

    // Render
    renderer.render(scene, camera);

    //New Frame
    ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
    leftPanel.ctx.clearRect(0, 0, leftPanel.canvas.width, leftPanel.canvas.height);

    //Tracers
    tracers.forEach(t => t.drawTracer(ctx, leftPanel, camera, sizes, alpha, doVals));

    //Points
    ms.forEach(pt => pt.drawPt(ctx, leftPanel, camera, sizes, bw));
    ts.forEach(pt => pt.drawPt(ctx, leftPanel, camera, sizes, bw));

    if (bw) {
        leftPanel.ctx.fillStyle = 'black';
    } else {
        leftPanel.ctx.fillStyle = 'white';
    }

    leftPanel.frame(textbox);

    //values
    if (doVals && leftPanel.spreadsheet) {
        tracers.forEach(t => t.drawValues(ctx, leftPanel.ctx, camera, sizes, leftPanel.cellWidth, leftPanel.cellHeight));
    }

    //loading bar

    if (0 < Gxhr && Gxhr < 100) {
        ctx.beginPath();
        ctx.arc(sizes.width / 2, sizes.height / 2, Math.sin(elapsedTime) * 10 + 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgb(100, 100, ' + Math.sin(elapsedTime) * 255 + ')';
        ctx.fill();
    }

    if (!leftPanel.spreadsheet && leftPanel.gi) {
        if (leftPanel.gi != lastgi) {
            lastgi = leftPanel.gi;
            tracers.forEach((t) => {
                var label = String(t.m.i) + "/" + String(t.t.i);

                try {
                    t.visible = leftPanel.groups[lastgi][label];
                } catch (e) {
                    //console.log(leftPanel.groups0, lastgi, leftPanel.groups[lastgi], label)
                }
            })
        }
    }


    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();