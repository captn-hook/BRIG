import '../viewer/viewer.css';
import './editor.css';

import * as V from '../viewer/viewer.js';

import { default as html } from "./editor.html";

import {
    saveFile,
    sendFile,
} from '../shared/Data.js';

import {
    getStorage,
    ref,
    //listAll,
    //getBlob,
    //updateMetadata,
    //getMetadata,
} from 'firebase/storage';

import {
    getFirestore,
    //setDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';

import {
    Raycaster,
    Vector3,
} from 'three';

import {
    Area,
} from '../shared/Area.js';
//  bg
//I NEED
//ms, ts, tracers, insights, views, db, dropd.value
//camera, textbox, handleFiles, handlemodels, defaultDropd
export function open(state, firebaseEnv) {
    document.body.innerHTML = html;
    V.cont(state, firebaseEnv);
    //add editor elements
    
    const app = firebaseEnv.app;
    //const auth = firebaseEnv.auth;
    //const provider = firebaseEnv.provider;
    const db = getFirestore(app);
    const storage = getStorage(app);

    //const functions = getFunctions(firebaseEnv.app);
    //connectFunctionsEmulator(functions, 'localhost', 5001);
    //const allSites = httpsCallable(functions, 'allSites');

    if (firebaseEnv.auth.currentUser) {
        let ext = firebaseEnv.auth.currentUser.email.split('@')[1];

        if (ext[1] == 'poppy.com' || firebaseEnv.auth.currentUser.email == 'tristanskyhook@gmail.com') {

            import('../shared/allSites.js').then((module) => {
                module.default(storage).then((result) => {
                    V.siteList(result);
                }).catch((error) => {
                    console.log(error);
                })
            })
        }
    }


    const sGroup = document.getElementById('saveGroup');
    const aGroup = document.getElementById('addGroup');
    const dGroup = document.getElementById('deleteGroup');

    const sArea = document.getElementById('saveArea');
    const aArea = document.getElementById('addArea');
    const dArea = document.getElementById('deleteArea');

    const dataInput = document.getElementById('datapicker');

    const modelInput = document.getElementById('modelpicker');

    const newSite = document.getElementById('newSite');

    
    document.getElementById('saveFiles').addEventListener('click', (e) => {
        saveFile(V.ms, V.ts, V.tracers, V.insights, V.views);
    })

    document.getElementById('sendFiles').addEventListener('click', (e) => {
        if (V.dropd.value != V.defaultDropd) {
            sendFile(V.ms, V.ts, V.tracers, V.insights, V.views, db, V.dropd.value);
        }
    })

    document.getElementById('saveCam').addEventListener('click', (e) => {
        //console.log('saveCam')
        V.views[V.leftPanel.firstClickY - 1] = [String(V.camera.position.x), String(V.camera.position.y), String(V.camera.position.z)];
        console.log(V.views)
    })

    var editPos = false;

    document.getElementById('editPos').addEventListener('click', (e) => {
        if (editPos) {
            editPos = false;
            //clear style
            e.target.style = '';
            e.target.innerHTML = 'Edit Position';
        } else {
            editPos = true;
            //set style
            e.target.style = 'background-color: #ff0000; color: #ffffff;';
            e.target.innerHTML = 'Stop Editing';
        }
    })

    document.getElementById('readOnly').addEventListener('click', (e) => {
        V.textbox.readOnly = !V.textbox.readOnly;
        V.textbox.style.display = (V.textbox.readOnly) ? 'none' : 'block';
        e.target.innerHTML = (V.textbox.readOnly) ? 'Read Only' : 'Editable';
    })

    dataInput.addEventListener('change', (e) => {
        V.handleFiles(dataInput.files[0]);
    }, false);

    modelInput.addEventListener('change', (e) => {
        //console.log('modelInput');
        import('../viewer/modelHandler.js').then((module) => {
            module.handleModels(modelInput.files[0], V.scene);
        })
    }, false);


    V.sizes.canvas2d.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        if (editPos && V.leftPanel.spreadsheet == V.state[2]) {
            V.workingArea.points.pop();
        }

    })

    V.sizes.canvas2d.addEventListener('click', (e) => {
        if (editPos) {

            var raycaster = new Raycaster();
            var mouse = {
                x: (e.clientX - V.leftPanel.canvas.innerWidth) / V.renderer.domElement.clientWidth * 2 - 1,
                y: -(e.clientY / V.renderer.domElement.clientHeight) * 2 + 1
            };

            raycaster.setFromCamera(mouse, V.camera);

            var intersects = raycaster.intersectObjects(V.sceneMeshes, true);

            var doP = (V.leftPanel.spreadsheet == V.state[0]) ? true : false;


            //console.log(intersects, doP);

            if (intersects.length > 0) {
                if (doP) {
                    if (V.leftPanel.firstClickX == 1) {
                        V.ms[V.leftPanel.firstClickY - 2].pos = new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
                    } else if (V.leftPanel.firstClickY == 1) {
                        V.ts[V.leftPanel.firstClickX - 2].pos = new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y);
                    }
                } else {
                    console.log(V.workingArea.points);
                    V.workingArea.points.push(new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y));
                }
            }
        }

        //store pos in link
        var pos = String('P=' + Math.round(V.camera.position.x * 100) / 100) + '/' + String(Math.round(V.camera.position.y * 100) / 100) + '/' + String(Math.round(V.camera.position.z * 100) / 100) + '/' + String(Math.round(V.camera.rotation.x * 100) / 100) + '/' + String(Math.round(V.camera.rotation.y * 100) / 100) + '/' + String(Math.round(V.camera.rotation.z * 100) / 100)

        if (pos[0] != null) {
            window.location.hash = V.leftPanel.siteheader + '&' + pos;
        }
    },
        false);

    sGroup.addEventListener('click', plant1);

    async function plant1() {
        if (V.leftPanel.gi != 0 && V.leftPanel.gi != -1) {
            V.leftPanel.groups[V.leftPanel.gi] = await saveGroup(db, V.dropd.value, V.leftPanel.gi, V.tracers, V.leftPanel.text)
        }
    }

    aGroup.addEventListener('click', plant2)

    async function plant2() {
        var i = 0;
        V.leftPanel.groups.forEach((e) => {
            if (e != undefined) {
                i++;
            }
        })
        V.leftPanel.groups[i] = await saveGroup(db, V.dropd.value, i, V.tracers, V.leftPanel.text)

    }

    dGroup.addEventListener('click', (e) => {
        deleteDoc(doc(db, V.dropd.value, 'group' + V.leftPanel.gi));
        V.leftPanel.groups[V.leftPanel.gi] = undefined;
    })

    //areabtns
    sArea.addEventListener('click', tnalp3);

    async function tnalp3() {
        if (V.leftPanel.ai != 0 && V.leftPanel.ai != -1) {
            V.leftPanel.areas[V.leftPanel.ai].text = V.leftPanel.text;
            //console.log("", leftPanel.ai)
            saveArea(db, V.dropd.value, V.leftPanel.ai + 1, V.leftPanel.areas[leftPanel.ai])
        }
    }

    aArea.addEventListener('click', tnalp4)

    async function tnalp4() {
        if (V.workingArea.points.length > 2) {
            var i = 0;
            V.workingArea.text = V.leftPanel.text;
            V.leftPanel.areas.forEach((e) => {
                if (e != undefined) {
                    i++;
                }
            })

            var n = prompt("Enter Area Name");
            V.workingArea.name = String(n);

            var x = prompt("Enter Area Value");
            V.workingArea.setValue(parseFloat(x));

            var a = new Area(V.workingArea.points, V.workingArea.value, V.workingArea.name, V.workingArea.text)

            V.leftPanel.areas.push(a);
            //console.log("A", leftPanel.ai)
            saveArea(db, dropd.value, i + 1, a)
            V.workingArea = new Area([]);
        }
    }

    dArea.addEventListener('click', (e) => {
        //console.log("D", leftPanel.ai)
        //console.log('deleting area', leftPanel.ai + 1)
        deleteDoc(doc(db, V.dropd.value, 'area' + (V.leftPanel.ai + 1)));
        V.leftPanel.areas[V.leftPanel.ai] = undefined;
    })

    V.textbox.addEventListener('input', e => {
        if (V.textbox.readOnly == false) {
            if (V.leftPanel.spreadsheet == state[0]) {
                V.insights[leftPanel.firstClickY] = encodeURI(V.textbox.value.replaceAll(/,/g, '~'));
            } else {
                V.leftPanel.text = encodeURI(V.textbox.value.replaceAll(/,/g, '~'))
                //console.log(leftPanel.text);
            }
        }
    })

    return Promise.resolve();
}

export function close() {
    return Promise.resolve();
}
