import './style.css';
import imageUrl1 from './images/logo.png';
import imageUrl2 from './images/logoblack.png';
import favi from './images/favi16.ico';

var title = document.getElementById('title');
title.src = imageUrl1;

var icon = document.getElementById('icon');
icon.href = favi;

/*
Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    Firebase    
*/

// Import the functions you need from the SDKs you need

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

import { MainButtons } from './buttons/MainButtons';

import { AdminButtons } from './buttons/AdminButtons';
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

//var [ms, ts, tracers, insights, views] = Data(data);
var ms = []
var ts = []
var tracers = []
var insights = []
var views = []
var groups = []
var areas = []
//refrence bundle
var objects = { ms, ts, tracers, insights, views, groups, areas };

//hard refrences to html elements on creation

const leftPanel = new SpreadsheetPanel(document.getElementById('left'));

const viewport = new Viewport(document.getElementsByClassName('webgl')[0], leftPanel, state);
//managers
const userTable = new UserTable(document.getElementById('table'));

const areaManager = new AreaManager();

const dropd = new DropDManager(storage, objects);

//buttons
const dataButtons = new DataButtons(leftPanel, viewport.sizes, state);

const adminButtons = new AdminButtons(viewport.scene);

//does some auth and buttons
const mainButtons = new MainButtons(dropd, dataButtons, adminButtons, listUsers, userTable);

//const groupManager = new GroupManager();

/*
    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading    Loading
*/

//load data from file


//loadfunc =====================================================<

function loadRefs(ref1, ref2) {

    getBlob(ref1)
        .then((blob) => {
            viewport.modelhandler.handleModels(blob);
            mainButtons.giveStorage(storage);
        })
        .catch((err) => {
            console.error(err);
        })

    // .csv, load data

    getBlob(ref2)
        .then((blob) => {
            var ms, ts, tracers, insights, views = viewport.modelhandler.handleFiles(blob);
            leftPanel.blankClicks();
            viewport.sizes.updateSizes(leftPanel, groups.length);

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

//live variables

/*
    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE    LIVE

*/

/*
    EVENTS
*/

document.addEventListener('DOMContentLoaded', (e) => {
    viewport.sizes.updateSizes(leftPanel, groups.length);
});

window.addEventListener('resize', (e) => {
    
    viewport.sizes.updateSizes(leftPanel, groups.length);
});

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