import './style.css';
import imageUrl1 from './images/logo.png';
import imageUrl2 from './images/logoblack.png';
import favi from './images/favi16.ico';

var title = document.getElementById('title');
title.src = imageUrl1;

var icon = document.getElementById('icon');
icon.href = favi;

import {
    PerspectiveCamera,
    Vector3,
    Raycaster,
    WebGLRenderer,
    Color,
    AmbientLight,
    Scene,
    Clock
} from 'three';
/*

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader';
*/
import {
    Data,
    saveFile,
    sendFile,
    RemoteData,
    GetGroups,
    saveGroup,
    userSites,
    saveArea,
    GetAreas,
} from './Data';

import {
    ScreenSizes
} from './ScreenSizes';

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

/*
Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    
*/

// Import the functions you need from the SDKs you need

import {
    initializeApp
} from 'firebase/app';

import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
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

import {
    Area
} from './Area';

import {
    Panel
} from './Panel';

import {
    UserTable
} from './UserTable';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import {
    firebaseConfig
} from './key';


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


const state = {
    0: 'spreadsheet',
    1: 'groups',
    2: 'areas'
}

const sizes = new ScreenSizes();

const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 1, 500);

camera.position.set(5, 5, 5); // Set position like this
camera.lookAt(new Vector3(0, 0, 0));

// Controls
const canvas2d = document.getElementById('2d');

const controls = new OrbitControls(camera, canvas2d);

controls.enableDamping = true;
controls.target.set(0, 0, 0);

var cameraTargPos = new Vector3(5, 5, 5);
var cameraTargView = new Vector3(0, 0, 0);

// Scene
const scene = new Scene();
scene.background = new Color(0x000000);
scene.add(camera);

//selet
const dropd = document.getElementById('dropdown');

// Canvas
const canvas3d = document.querySelector('canvas.webgl');


var workingArea = new Area([]);

const leftPanel = new Panel(document.getElementById('left'));

const userTable = new UserTable(document.getElementById('table'), defaultDropd);


//canvasleft.oncontextmenu = () => false;

const sGroup = document.getElementById('saveGroup');
const aGroup = document.getElementById('addGroup');
const dGroup = document.getElementById('deleteGroup');

const sArea = document.getElementById('saveArea');
const aArea = document.getElementById('addArea');
const dArea = document.getElementById('deleteArea');

//const ctxLeft = canvasleft.getContext('2d');

const textbox = document.getElementById('textbox');


//buttons

//buttons

var alpha = true;
//need different buttons for google auth and email auth
document.getElementById('login').addEventListener('click', (e) => {
    sizes.updateSizes(leftPanel);
    login();
})

document.getElementById('elogin').addEventListener('click', (e) => {
    sizes.updateSizes(leftPanel);
    elogin();
})

document.getElementById('logout').addEventListener('click', (e) => {
    siteList([]);
    availableSites = [];
    accessibleSites = [];
    switchDisplay(0);
    auth.signOut();
    signOut(auth).then(() => {
      //console.log('signed out');
    }
    ).catch((error) => {
      //console.log(error);
    }
    );
})

document.getElementById('valueBtnS').addEventListener('click', valueButton);
document.getElementById('valueBtnG').addEventListener('click', valueButton);
document.getElementById('valueBtnA').addEventListener('click', valueButton);

function valueButton(e) {
    if (e.target.innerHTML == 'Show values') {
        e.target.innerHTML = 'Hide values';
        //show values
        doVals = true;
    } else {
        e.target.innerHTML = 'Show values';
        //hide values
        doVals = false;
    }
}

document.getElementById('opacityBtnS').addEventListener('click', opacityButton);
document.getElementById('opacityBtnG').addEventListener('click', opacityButton);
document.getElementById('opacityBtnA').addEventListener('click', opacityButton);

function opacityButton(e) {
    if (!alpha) {
        e.target.innerHTML = 'Transparent';
        alpha = true;
        //show values
    } else {
        e.target.innerHTML = 'Opaque';
        alpha = false;
        //hide values
    }
}

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

var camFree = false;

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
    e.target.innerHTML = (textbox.readOnly) ? 'Read Only' : 'Editable';
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
const bug3 = document.getElementById('bug3');

document.getElementById('groups').addEventListener('click', (e) => {
    leftPanel.next();

    if (leftPanel.spreadsheet == state[0]) {
        //if saved tracers exist, turn them on 
        //display tracers
        e.target.innerHTML = 'Groups'; //button indicates next state
        bug1.style.display = 'block'
        bug2.style.display = 'none'
        bug3.style.display = 'none'
        sizes.spreadsheetDiv.style.overflow = 'hidden';
    } else if (leftPanel.spreadsheet == state[1]) {
        //display groups
        e.target.innerHTML = 'Areas'; //button indicates next state
        bug1.style.display = 'none'
        bug2.style.display = 'block'
        bug3.style.display = 'none'
        sizes.spreadsheetDiv.style.overflow = 'auto';
    } else if (leftPanel.spreadsheet == state[2]) {
        //display areas
        e.target.innerHTML = 'Tracers'; //button indicates next state
        bug1.style.display = 'none'
        bug2.style.display = 'none'
        bug3.style.display = 'block'
        sizes.spreadsheetDiv.style.overflow = 'auto';
    }
    sizes.updateSizes(leftPanel);
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

//areabtns
sArea.addEventListener('click', tnalp3);

async function tnalp3() {
    if (leftPanel.ai != 0 && leftPanel.ai != -1) {
        leftPanel.areas[leftPanel.ai].text = leftPanel.text;
        //console.log("", leftPanel.ai)
        saveArea(db, dropd.value, leftPanel.ai + 1, leftPanel.areas[leftPanel.ai])
    }
}

aArea.addEventListener('click', tnalp4)

async function tnalp4() {
    if (workingArea.points.length > 2) {
        var i = 0;
        workingArea.text = leftPanel.text;
        leftPanel.areas.forEach((e) => {
            if (e != undefined) {
                i++;
            }
        })

        var n = prompt("Enter Area Name");
        workingArea.name = String(n);

        var x = prompt("Enter Area Value");
        workingArea.setValue(parseFloat(x));

        var a = new Area(workingArea.points, workingArea.value, workingArea.name, workingArea.text)

        leftPanel.areas.push(a);
        //console.log("A", leftPanel.ai)
        saveArea(db, dropd.value, i + 1, a)
        workingArea = new Area([]);
    }
}

dArea.addEventListener('click', (e) => {
    //console.log("D", leftPanel.ai)
    //console.log('deleting area', leftPanel.ai + 1)
    deleteDoc(doc(db, dropd.value, 'area' + (leftPanel.ai + 1)));
    leftPanel.areas[leftPanel.ai] = undefined;
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
        e.target.innerHTML = 'Edit Files';
    } else if (d1.style.display == 'block') {
        switchDisplay(2);
        e.target.innerHTML = 'Login';
    } else {
        switchDisplay(0);
        e.target.innerHTML = 'Dropdown';
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
    //console.log('saveCam')
    views[leftPanel.firstClickY - 1] = [String(camera.position.x), String(camera.position.y), String(camera.position.z)];
    //console.log(views)
})

var editPos = false;

document.getElementById('editPos').addEventListener('click', (e) => {
    if (editPos) {
        editPos = false;
        e.target.innerHTML = 'Edit Position';
    } else {
        editPos = true;
        e.target.innerHTML = 'Stop Editing';
    }
})

document.getElementById('perms').addEventListener('click', savePerms);

async function savePerms() {

    var itemRef = ref(storage, '/Sites/' + dropd.value + '/' + dropd.value + '.glb')

    //var dataRef = ref(storage, '/Sites/' + dropd.value + '/data.csv')

    var inner = '';

    let d = {}



    userTable.inUsers.forEach((user) => {
        inner += '"' + user[1] + '":"' + user[0] + '",';

        d[user[1]] = user[0];

        setDoc(doc(db, user[0], dropd.value), {
            'access': true,
        })
    })

    userTable.allUsers.forEach((user) => {
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
        userTable.populateTable();
        /*s

                }).catch((error) => {

                    /console.log(error)

                });
        */
    }).catch((error) => {

        //console.log(error)

    });
    /*
        try {
            const docRef = await setDoc(doc(db, dropd.value, 'access'), d);
            /onsole.log("Document written");
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

    userTable.bw = bw;

    if (bw) {
        e.target.innerHTML = 'Light Mode';
        scene.background = new Color(0x000000);
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
        e.target.innerHTML = 'Dark Mode';
        scene.background = new Color(0xffffff);
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

//set group to selected
const table = document.getElementById('table');


var inUsers = [];
var allUsers = [];


// btn event listeners

ctrlBtn.addEventListener('click', btn6.adminMenu);

//set size
sizes.updateSizes(leftPanel);

// Lights
const light = new AmbientLight(0x404040); // soft white light
light.intensity = 3;
scene.add(light);


//Renderer
const renderer = new WebGLRenderer({
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
    console.log("LOADING: ", xhr.loaded / xhr.total * 100);
}

// onError callback
function onErrorLog(err) {
    console.error(err)
}

/*
Misc
*/

const clock = new Clock();

const dataInput = document.getElementById('datapicker');

const modelInput = document.getElementById('modelpicker');


//data funccs

function getGLTFLoader() {
    return import('three/examples/jsm/loaders/GLTFLoader.js').then((GLTF) => {
        return new GLTF.GLTFLoader;
    });
}

function getDRACOLoader() {
    return getGLTFLoader().then((GLTFLoader) => {
        return import('three/examples/jsm/loaders/DRACOLoader.js').then((DRACO) => {

            const DRACOLoader = new DRACO.DRACOLoader();

            DRACOLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

            GLTFLoader.setDRACOLoader(DRACOLoader);

            return GLTFLoader;
        });
    })
}

function handleModels(input) {
    //remove old stuff first

    if (globalObj != null) {
        scene.remove(globalObj);
    }

    var read = new FileReader();

    read.readAsArrayBuffer(input);


    read.onloadend = function () {


        getDRACOLoader().then((loader) => {

            loader.parse(read.result, '', onLoadLoad, onErrorLog, onProgressLog);

        })

        userTable.populateTable(storage, allUsersM, dropd.value, bw);

    }
}

function handleFiles(input) {

    //remove old stuff first
    leftPanel.blankClicks();

    var read = new FileReader();


    read.readAsBinaryString(input);

    read.onloadend = function () {

        [ms, ts, tracers, insights, views] = Data(read.result)

        leftPanel.setTracers(ms, ts, tracers)
        //resize sheet
        sizes.updateSizes(leftPanel);
    }
}

function updateCam() {

    //console.log(leftPanel.camFree, leftPanel.looking, leftPanel.spreadsheet, leftPanel.n, leftPanel.gi)

    if (leftPanel.camFree && leftPanel.spreadsheet == state[0] ) {
        try {
            //fail quietly if cannot set camera
            if (leftPanel.mt == 0) {

            } else if (leftPanel.mt == 2) {
                //if y (row) == 1, ts

                cameraTargPos = new Vector3(parseFloat(ts[leftPanel.n].pos.x) + 14, parseFloat(ts[leftPanel.n].pos.z) + 30, parseFloat(ts[leftPanel.n].pos.y) + 8);
                cameraTargView = new Vector3(parseFloat(ts[leftPanel.n].pos.x), parseFloat(ts[leftPanel.n].pos.z), parseFloat(ts[leftPanel.n].pos.y));

                //throws errors if it trys to select row before/after last
            } else if (leftPanel.mt == 1) {
                //if x (column) == 1, ms
                //special views
                //console.log(views[leftPanel.n + 1])
                if (views[leftPanel.n + 1] != null && views[leftPanel.n + 1][0] != '') {
                    cameraTargPos = new Vector3(parseFloat(views[leftPanel.n + 1][0]), parseFloat(views[leftPanel.n + 1][1]), parseFloat(views[leftPanel.n + 1][2]));
                } else {

                    cameraTargPos = new Vector3(parseFloat(ms[leftPanel.n].pos.x) + 14, parseFloat(ms[leftPanel.n].pos.z) + 30, parseFloat(ms[leftPanel.n].pos.y) + 8);

                }
                cameraTargView = new Vector3(parseFloat(ms[leftPanel.n].pos.x), parseFloat(ms[leftPanel.n].pos.z), parseFloat(ms[leftPanel.n].pos.y));

                //insights
                if (leftPanel.spreadsheet) {
                    textbox.value = (insights[leftPanel.n + 2] == null) ? '' : decodeURI(insights[leftPanel.n + 2]).replaceAll('~', ',');
                } else {

                    textbox.value = (leftPanel.text == null) ? '' : decodeURI(leftPanel.text).replaceAll('~', ',');
                }


            }
        } catch (e) {
            //console.log(e)
        }
    } else if (leftPanel.spreadsheet == state[1] && leftPanel.camFree) {

        if (leftPanel.gi) {
            var i = leftPanel.gi;
        } else {
            var i = 0;
        }
        try {
            cameraTargPos = new Vector3(leftPanel.groups[i]['pos'][0] + 5, leftPanel.groups[i]['pos'][2] + 10, leftPanel.groups[i]['pos'][1] + 3);
            cameraTargView = new Vector3(leftPanel.groups[i]['pos'][0], leftPanel.groups[i]['pos'][2], leftPanel.groups[i]['pos'][1]);
        } catch (e) {}

        //console.log(cameraTargPos, cameraTargView)

    } else if (leftPanel.spreadsheet == state[2] && leftPanel.camFree) {

        if (leftPanel.ai) {
            var i = leftPanel.ai;
        } else {
            var i = 0;
        }
        try {
            cameraTargPos = new Vector3(leftPanel.areas[i].avgPos()[0] + 5, leftPanel.areas[i].avgPos()[2] + 10, leftPanel.areas[i].avgPos()[1] + 3);
            cameraTargView = new Vector3(leftPanel.areas[i].avgPos()[0], leftPanel.areas[i].avgPos()[2], leftPanel.areas[i].avgPos()[1]);
        } catch (e) {}
    }
}

//sign in function

var availableSites = [];

var folderRef = ref(storage, '/Sites')

var accessibleSites = [];

var allUsersM = [];

var me = '';

async function signedIn(user) {
    //empty list 
    siteList([]);

    // The signed-in user info.
    // ...
    const ext = user.email.split('@')

    //var allUsersM = []

    if (ext[1] == 'poppy.com' || user.email == 'tristanskyhook@gmail.com') {

        ctrlBtn.style.display = 'block';
        sGroup.style.display = 'inline-block';
        aGroup.style.display = 'inline-block';
        dGroup.style.display = 'inline-block';

        sArea.style.display = 'inline-block';
        aArea.style.display = 'inline-block';
        dArea.style.display = 'inline-block';


        listUsers().
        then((u) => {
            //console.log(u)
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

    window.dispatchEvent(new Event('hashchange'));
    window.dispatchEvent(new Event('resize'));

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

        if (window.location.hash != '' && window.location.hash[1] != '&') {
            if (window.location.hash.split('&')[0].substring(1) == dropd.options[dropd.length - 1].text) {
                dropd.selectedIndex = dropd.length - 1;
            }
        }
    })

}
var stupid = null;

function loadRefAndDoc(ref, doc) {

    getBlob(ref)
        .then((blob) => {
            handleModels(blob);
        })
        .catch((err) => {
            //console.error(err);
        })

    RemoteData(db, doc).then((data) => {

        [ms, ts, tracers, insights, views] = data;

        leftPanel.setTracers(ms, ts, tracers)

        if (stupid != null) {
            leftPanel.gi = stupid;
            stupid = null;
        }

        sizes.updateSizes(leftPanel);

    }).catch((err) => {
        //console.error(err);
    })


}

function loadRefs(ref1, ref2) {

    getBlob(ref1)
        .then((blob) => {
            handleModels(blob);
        })
        .catch((err) => {
            console.error(err);
        })

    // .csv, load data

    getBlob(ref2)
        .then((blob) => {
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
        //login();
        signedIn(user);
    } else {
        // User is signed out
        // ...
    }
});

function signInWithMyPopup() {
    return new Promise((resolve, reject) => {
        //just a prompt
        var email = prompt('Email');
        var password = prompt('Password');

        resolve({
            user: email,
            password: password
        });
    });
}


function elogin() {
    //no popup
    signInWithMyPopup().then((result) => {
        //result.user and result.password
        signInWithEmailAndPassword(auth, result.user, result.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                signedIn(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage);
            });
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
    });
}

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
    sizes.updateSizes(leftPanel);
})

//load files from google storage by dropdown name
dropd.addEventListener('change', (event) => {

    [ms, ts, tracers, insights, views] = [
        [],
        [],
        [],
        [],
        []
    ];

    //console.log(event.target.value);

    if (event.target.value == null || event.target.value == undefined || event.target.value == '') {
        var targ = leftPanel.siteheader;
    } else {
        var targ = event.target.value;
    }

    if (targ != defaultDropd) {

        var modelRef = ref(storage, '/Sites/' + targ + '/' + targ + '.glb');


        // .glb, load model

        //var dataRef = ref(storage, '/Sites/' + event.target.value + '/data.csv');

        //loadRefs(modelRef, dataRef)
        leftPanel.groups = GetGroups(db, targ);
        leftPanel.areas = GetAreas(db, targ);
        loadRefAndDoc(modelRef, targ);

        leftPanel.siteheader = targ;

    } else {
        //load default

        /*
        load example
        */
        var modelRef = ref(storage, '/Example/example.glb');

        var dataRef = ref(storage, '/Example/data.csv');

        // .glb, load model

        loadRefs(modelRef, dataRef)

        leftPanel.groups = GetGroups(db, targ);
        leftPanel.areas = GetAreas(db, targ);

        /*
        Animate
        */
        leftPanel.siteheader = 'Example';
    }

    //window.location.hash = leftPanel.siteheader + '&';

})


//canvas

function stoplookin() {
    if (leftPanel.camFree) {
        leftPanel.looking = false;
    }
}

sizes.canvas2d.addEventListener('mousedown', (e) => {
    stoplookin();
})

sizes.canvas2d.addEventListener('wheel', (event) => {
    stoplookin();
}, {
    passive: true
});

sizes.canvas2d.addEventListener('contextmenu', (e) => {
    stoplookin();

    e.preventDefault();

    if (editPos && leftPanel.spreadsheet == state[2]) {
        workingArea.points.pop();
    }

})

sizes.canvas2d.addEventListener('click', (e) => {
        stoplookin();

        if (editPos) {

            var raycaster = new Raycaster();
            var mouse = {
                x: (e.clientX - leftPanel.canvas.innerWidth) / renderer.domElement.clientWidth * 2 - 1,
                y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
            };

            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(sceneMeshes, true);

            var doP = (leftPanel.spreadsheet == state[0]) ? true : false;

            
            //console.log(intersects, doP);

            if (intersects.length > 0) {
                if (doP) {
                    if (leftPanel.firstClickX == 1) {
                        ms[leftPanel.firstClickY - 2].pos = new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
                    } else if (leftPanel.firstClickY == 1) {
                        ts[leftPanel.firstClickX - 2].pos = new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
                    }
                } else {
                    //console.log(workingArea.points);
                    workingArea.points.push(new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y));
                }
            }
        }

        //store pos in link
        var pos = String('P=' + Math.round(camera.position.x * 100) / 100) + '/' + String(Math.round(camera.position.y * 100) / 100) + '/' + String(Math.round(camera.position.z * 100) / 100) + '/' + String(Math.round(camera.rotation.x * 100) / 100) + '/' + String(Math.round(camera.rotation.y * 100) / 100) + '/' + String(Math.round(camera.rotation.z * 100) / 100)

        if (pos[0] != null) {
            window.location.hash = leftPanel.siteheader + '&' + pos;
        }
    },
    false);

textbox.addEventListener('input', e => {
    if (textbox.readOnly == false) {
        if (leftPanel.spreadsheet == state[0]) {
            insights[leftPanel.firstClickY] = encodeURI(textbox.value.replaceAll(/,/g, '~'));
        } else {
            leftPanel.text = encodeURI(textbox.value.replaceAll(/,/g, '~'))
            //console.log(leftPanel.text);
        }
    }
})

//file input
dataInput.addEventListener('change', (e) => {
    handleFiles(dataInput.files[0]);
}, false);

modelInput.addEventListener('change', (e) => {
    //console.log('modelInput');
    handleModels(modelInput.files[0]);
}, false);

window.addEventListener('hashchange', (e) => {

    var hash = window.location.hash.substring(1)

    if (hash[0] != '&') {
        var params = hash.split('&');

        if (params[0] != dropd.value && params[0][0] != 'X' && params[0][0] != 'P' && params[0][0] != 'G') {
            leftPanel.siteheader = params[0];
            dropd.value = params[0];
            dropd.dispatchEvent(new Event('change'));
        }

        if (params[1] && params[1][0] == 'G') {
            //setTimeout(giHack, 1500, params);
            leftPanel.spreadsheet = state[1];
            if (params[0] != dropd.value) {
                stupid = params[1].substring(2);
            } else {
                leftPanel.gi = params[1].substring(2);
                sizes.updateSizes(leftPanel);
            }


        } else if (params[1] && params[1][0] == 'X') {
            leftPanel.spreadsheet = state[0];
            if (params[1].substring(2) != leftPanel.cellX || params[2].substring(2) != leftPanel.cellY) {
                leftPanel.firstClickX = params[0].substring(2);
                leftPanel.firstClickY = params[1].substring(2);
                updateCam();

                //leftPanel.canvas.dispatchEvent(new Event('click'));
            }
        } else if (params[1] && params[1][0] == 'P') {

            var coords = params[1].substring(2).split('/')

            var pos = new Vector3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]))
            //var rot = new Vector3(parseFloat(coords[3]), parseFloat(coords[4]), parseFloat(coords[5]))

            //                                   min dist
            if (camera.position.distanceTo(pos) > .03) {

                //console.log('moving camera');
                // if (leftPanel.camFree) {
                //    leftPanel.looking = true;
                //}

                cameraTargPos = pos
                camera.rotation.set(parseFloat(params[3]), parseFloat(params[4]), parseFloat(params[5]))

                controls.update();
                updateCam();

            }

        }
    }

    leftPanel.setFontsize();

});

//resize
window.addEventListener('resize', () => {
    // Update sizes
    sizes.updateSizes(leftPanel);

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

var lastgi = -1;
var lastai = -1;

//load defaullt if no hash
if (window.location.hash == '' || window.location.hash[1] == '&') {
    loadRefs(ref(storage, '/Example/example.glb'), ref(storage, '/Example/data.csv'))
}

const tick = () => {

    const elapsedTime = clock.getElapsedTime();
    if (leftPanel) {
        if (leftPanel.looking || leftPanel.state == state[1]) {
            updateCam();
        }


        //if camera.position isnt cameraTargPos, move camera towards point
        if (leftPanel.looking && camera.position.distanceTo(cameraTargPos) > .05) {
            camera.position.lerp(cameraTargPos, .03)
        } else if (leftPanel.looking && controls && controls.target.distanceTo(cameraTargView) < .05) {
            leftPanel.looking = false;
        }

        //if controls.target isnt cameraTargView, turn camera towards point
        if (leftPanel.looking && controls && controls.target.distanceTo(cameraTargView) > .05) {
            controls.target.lerp(cameraTargView, .03)
        } else if (leftPanel.looking && camera.position.distanceTo(cameraTargPos) < .05) {
            leftPanel.looking = false;
        }
    }
    // Update Orbital Controls

    if (controls) {
        controls.update();
    }
    // Render
    renderer.render(scene, camera);

    //New Frame
    sizes.clearC2d();
    if (leftPanel) {
        leftPanel.ctx.clearRect(0, 0, leftPanel.canvas.width, leftPanel.canvas.height);
    }
    //Tracers
    if (leftPanel.spreadsheet != state[2]) {
        tracers.forEach(t => t.drawTracer(leftPanel, camera, sizes, alpha, doVals));
   
        //Points
        ms.forEach(pt => pt.drawPt(leftPanel, camera, sizes, bw));
        ts.forEach(pt => pt.drawPt(leftPanel, camera, sizes, bw));
    }
    
    if (leftPanel) {
        if (bw) {
            leftPanel.ctx.fillStyle = 'black';
        } else {
            leftPanel.ctx.fillStyle = 'white';
        }

        leftPanel.frame(textbox);
    }
    //values
    if (doVals && leftPanel.spreadsheet == state[0]) {
        tracers.forEach(t => t.drawValues(leftPanel.ctx, leftPanel.cellWidth, leftPanel.cellHeight));
    }


    if (leftPanel && leftPanel.spreadsheet == state[1] && leftPanel.gi) {
        if (leftPanel.gi != lastgi) {
            lastgi = leftPanel.gi;

            ms.forEach(pt => pt.visible = false);
            ts.forEach(pt => pt.visible = false);

            tracers.forEach((t) => {
                var label = String(t.m.i) + "/" + String(t.t.i);

                try {
                    t.visible = leftPanel.groups[lastgi][label];
                } catch (e) {
                    //console.log(leftPanel.groups0, lastgi, leftPanel.groups[lastgi], label)
                }

                if (t.visible) {
                    t.m.visible = true;
                    t.t.visible = true;
                }
            })
        }
    }

    if (leftPanel && leftPanel.spreadsheet == state[2]) {

        if (leftPanel.ai != lastai && leftPanel.areas[lastai]) {
            lastai = leftPanel.ai;

            leftPanel.areas[lastai].visible = !leftPanel.areas[lastai].visible;
        }

        leftPanel.areas.forEach(a => {
            if (a != undefined) {
                a.drawArea(camera, sizes, doVals, alpha);
            }
        });
        workingArea.drawArea(camera, sizes, doVals, true, 'last');
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();