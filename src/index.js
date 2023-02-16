import './style.css';
import imageUrl1 from './images/logo.png';
import imageUrl2 from './images/logoblack.png';
import favi from './images/favi16.ico';

var title = document.getElementById('title');
title.src = imageUrl1;

var icon = document.getElementById('icon');
icon.href = favi;

import {
    userSites
} from './Data';


/*
Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    
*/

// Import the functions you need from the SDKs you need

import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged
} from 'firebase/auth';

import {
    ref,
    getBlob
} from 'firebase/storage';

import {
    setupFirebase
} from './FirebaseSetup';

import {
    Panel,
    SpreadsheetPanel
} from './Panel';

import {
    UserTable
} from './UserTable';

import {
    Viewport
} from './Viewport';

import {
    DataButtons
} from './buttons/DataButtons';

import {
    AreaManager,
    Area
} from './objects/Area';

import {
    GroupManager,
    Group
} from './objects/Group';

import {
    DropDManager
} from './DropDManager';
/*
    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup    Setup
*/

const fire = setupFirebase();

const listUsers = fire[0];
const db = fire[1];
const storage = fire[2];

const state = {
    0: 'spreadsheet',
    1: 'groups',
    2: 'areas'
}

var bw = false;

const viewport = new Viewport(document.getElementsByClassName('webgl')[0]);

const leftPanel = new SpreadsheetPanel(document.getElementById('left'));

const userTable = new UserTable(document.getElementById('table'));

const areaManager = new AreaManager();

const dataButtons = new DataButtons(leftPanel, viewport.sizes, state);

const dropd = new DropDManager();
//const groupManager = new GroupManager();

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
var groups = []
var areas = []

//loadfunc =====================================================<

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
//load3DModel(building);

//sign in function

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

async function signedIn(user) {
    //change too refresh site
    //empty list 
    dropd.siteList([]);

    // The signed-in user info.
    const ext = user.email.split('@')

    //uhhhh -> var allUsersM = []

    if (ext[1] == 'poppy.com') {
        //admin
        dataButtons.switchAdmin();

        listUsers().
        then((u) => {
                u.data.users.forEach((user) => {
                    if (user.email.split('@')[1] != 'poppy.com') {
                        //not admin, create user table

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
//live variables

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
    viewport.sizes.updateSizes(leftPanel, groups.length);
});

//resize
window.addEventListener('resize', () => {
    // Update sizes
    sizes.updateSizes(leftPanel, groups.length);

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

//load defaullt if no hash
if (window.location.hash == '' || window.location.hash[1] == '&') {
    loadRefs(ref(storage, '/Example/example.glb'), ref(storage, '/Example/data.csv'))
}

const tick = () => {

    if (leftPanel) {
        if (leftPanel.looking || leftPanel.spreadsheet == state[1]) {
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

    viewport.frame();

    if (leftPanel) {
        leftPanel.ctx.clearRect(0, 0, leftPanel.canvas.width, leftPanel.canvas.height);
    }
    //Tracers
    tracers.forEach(t => t.drawTracer(leftPanel, camera, sizes, alpha, doVals));

    //Points
    ms.forEach(pt => pt.drawPt(leftPanel, camera, sizes, bw));
    ts.forEach(pt => pt.drawPt(leftPanel, camera, sizes, bw));
    if (leftPanel) {
        if (bw) {
            leftPanel.ctx.fillStyle = 'black';
        } else {
            leftPanel.ctx.fillStyle = 'white';
        }

        leftPanel.frame(textbox);
    }
    //values
    if (dataButtons.doVals && leftPanel.spreadsheet == state[0]) {
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

        if (leftPanel.ai != lastai && areaManager.areas[lastai]) {
            lastai = leftPanel.ai;

            areaManager.areas[lastai].visible = !areaManager.areas[lastai].visible;
        }

        areaManager.areas.forEach(a => {
            if (a != undefined) {
                a.drawArea(camera, sizes)
            }
        });
        areaManager.workingArea.drawArea(camera, sizes)
    }
    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();