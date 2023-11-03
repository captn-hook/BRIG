import '../viewer/viewer.css';
import './editor.css';

import * as V from '../viewer/viewer.js';

import { default as html } from "./editor.html";

import {
    saveModel,
    saveFile,
    sendFile,
    saveArea,
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

import { navigate } from '../index';

import {
    Point2d
} from '../shared/Point.js';

import {
    Tracer2d
} from '../shared/Tracer.js';

import {
    sceneMeshes
} from '../viewer/modelHandler.js';
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
        // let ext = firebaseEnv.auth.currentUser.email.split('@')[1];

        // if (ext[1] == 'poppy.com' || firebaseEnv.auth.currentUser.email == 'tristanskyhook@gmail.com') {

        //     import('../shared/allSites.js').then((module) => {
        //         module.default(storage).then((result) => {
        //             V.siteList(result);
        //         }).catch((error) => {
        //             console.log(error);
        //         })
        //     })
        // }
    }


    const sGroup = document.getElementById('saveGroup');
    const aGroup = document.getElementById('addGroup');
    const dGroup = document.getElementById('deleteGroup');

    const sArea = document.getElementById('saveArea');
    const aArea = document.getElementById('addArea');
    const dArea = document.getElementById('deleteArea');

    //this is here because it should respond as soon as data is input

    const newSite = document.getElementById('newSite');
    const newSiteBT = document.getElementById('newSiteBT');

    const newRow = document.getElementById('newRow');
    const newCol = document.getElementById('newCol');
    const delRow = document.getElementById('deleteRow');
    const delCol = document.getElementById('deleteCol');

    const backview = document.getElementById('backView');
    const topview = document.getElementById('aboveView');

    const newM = document.getElementById('newM');
    const newT = document.getElementById('newT');

    function getInteresects(xi, yi) {
        console.log(xi, yi);
        var raycaster = new Raycaster();
        var mouse = {
            x: (xi - V.leftPanel.canvas.innerWidth) / V.renderer.domElement.clientWidth * 2 - 1,
            y: -(yi / V.renderer.domElement.clientHeight) * 2 + 1
        };

        raycaster.setFromCamera(mouse, V.camera);
        let intersects = raycaster.intersectObjects(sceneMeshes, true);
        return intersects;
    }

    function newPoint(bool = true, pos = new Vector3(0, 0, 0)) {
        if (bool) {
            let i = V.ms.length;
            V.ms.push(new Point2d("M", i + 1, 'red', pos, 7));
            appendNewMTracers(V.ms[V.ms.length - 1]);
        } else {
            let i = V.ts.length;
            V.ts.push(new Point2d("D", i + 1, 'blue', pos, 3.5));
            appendNewTTracers(V.ts[V.ts.length - 1]);
        }
        V.reloadPanel(bool);
    }

    /* record the position of the touch
    when released using touchend event.
    This will be the drop position. */

    newM.addEventListener('touchmove', function (e) {
        //draw circle under finger
    })

    newM.addEventListener('touchend', function (e) {    
        let x = parseInt(e.changedTouches[0].pageX);
        let y = parseInt(e.changedTouches[0].pageY);
        let i = getInteresects(x, y);
        if (i.length > 0) {
            let pos = i[0].point;
            newPoint(true, new Vector3(pos.x, pos.z, pos.y));
        }
    })

    newT.addEventListener('touchend', function (e) {
        let x = parseInt(e.changedTouches[0].pageX);
        let y = parseInt(e.changedTouches[0].pageY);
        let i = getInteresects(x, y);
        if (i.length > 0) {
            let pos = i[0].point;
            newPoint(false, new Vector3(pos.x, pos.z, pos.y));
        }
    })

    newM.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text', 'M');
    })

    newT.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text', 'T');
    })

    V.sizes.canvas2d.addEventListener('drop', function (e) {
        let t = e.dataTransfer.getData('text');
        let x = parseInt(e.clientX);
        let y = parseInt(e.clientY);
        let i = getInteresects(x, y);
        if (i.length > 0) {
            let pos = i[0].point;
            if (t == 'M') {
                newPoint(true, new Vector3(pos.x, pos.z, pos.y));
            } else if (t == 'T') {
                newPoint(false, new Vector3(pos.x, pos.z, pos.y));
            }
        }
    })

    V.sizes.canvas2d.addEventListener('dragover', function (e) {
        e.preventDefault();
    })

    var last = [new Vector3(0, 0, 0), new Vector3(0, 0, 0)];

    var top = [new Vector3(0, 8, 0), new Vector3(0, 0, 0)];

    function topView() {
        last = [V.camera.position.clone(), V.camera.rotation.clone()];
        V.camera.position.set(top[0].x, top[0].y, top[0].z);
        V.camera.rotation.set(top[1].x, top[1].y, top[1].z);
    }
    function lastviewf() {
        V.camera.position.set(last[0].x, last[0].y, last[0].z);
        V.camera.rotation.set(last[1].x, last[1].y, last[1].z);
    }

    backview.addEventListener('click', lastviewf);

    topview.addEventListener('click', topView);

    newSite.addEventListener('click', (e) => {
        //this is the buttons for editing the data
        newSiteBT.style.display = 'grid';

        let newsitename = prompt("Enter Site Name");

        if (newsitename != null) {
            //popup window to upload files
            import('./newFiles.js').then((module) => {
                module.newFiles(V, newsitename);
            })
        }
    })

    /* tracers is a single dimensional array of Ms and Ts M1T1 M1T2 M1T3
                                                                         M2T1 M2T2 M2T3
                                                                                        M3T1 M3T2 M3T3 */
    function appendNewMTracers(m) {
        //ez just append new row
        V.ts.forEach((e) => {
            V.tracers.push(new Tracer2d(m, e, 1));
        })
    }

    function appendNewTTracers(t) {
        //get rows append one tracer to each row and rejoin
        var temp = [];
        V.ms.forEach((e) => {
            temp.push(new Tracer2d(e, t, 1));
        })
        var temp2 = [];
        //slice tracers into rows
        for (let i = 0; i < V.ms.length; i++) {
            temp2.push(V.tracers.slice(i * V.ts.length, (i + 1) * V.ts.length));
        }

        //append new tracer to each row
        console.log(temp.length, temp2.length, V.ms.length);
        for (let i = 0; i < temp2.length; i++) {
            temp2[i].push(temp[i]);
        }
        //rejoin rows
        V.setTracer(temp2.flat());
    }

    newRow.addEventListener('click', (e) => { newPoint(true) })
    // //somehow get a click event with drag and follow mouse onto canvas2d
    // let pos = new Vector3(0, 0, 0);
    // let i = V.ms.length;
    // V.ms.push(new Point2d("M", i + 1, 'red', pos, 7));
    // appendNewMTracers(V.ms[V.ms.length - 1]);
    // V.reloadPanel();
    //})

    newCol.addEventListener('click', (e) => { newPoint(false) })
    //     let pos = new Vector3(0, 0, 0);
    //     let i = V.ts.length;
    //     V.ts.push(new Point2d("D", i + 1, 'blue', pos, 3.5));
    //     appendNewTTracers(V.ts[V.ts.length - 1]);
    //     V.reloadPanel();
    // })

    delRow.addEventListener('click', (e) => {
        deleteTracers(V.ms.pop());
        V.reloadPanel();
    })

    delCol.addEventListener('click', (e) => {
        deleteTracers(V.ts.pop());
        V.reloadPanel();
    })
    document.getElementById('saveFiles').addEventListener('click', (e) => {
        saveFile(V.ms, V.ts, V.tracers, V.insights, V.views);
    })

    function deleteTracers(point) {
        let newt = [];
        V.tracers.forEach((e) => {
            if (e.t != point && e.m != point) {
                newt.push(e);
            }
        })

        V.setTracer(newt);
    }


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

            newSiteBT.style.display = 'none';
            
        } else {
            editPos = true;
            topView();
            clickCam();
            //set style
            e.target.style = 'background-color: #ff0000; color: #ffffff;';
            e.target.innerHTML = 'Stop Editing';

            newSiteBT.style.display = 'grid';
        }
    })

    function clickCam() {
        let c = document.getElementById('camBtn');
        if (c.innerHTML != 'Free 📹') {
            c.dispatchEvent(new Event('click'));
            if (c.innerHTML != 'Free 📹') {
                c.dispatchEvent(new Event('click'));
            }
        }
    }

    document.getElementById('readOnly').addEventListener('click', (e) => {
        V.textbox.readOnly = !V.textbox.readOnly;
        V.textbox.style.display = (V.textbox.readOnly) ? 'none' : 'block';
        e.target.innerHTML = (V.textbox.readOnly) ? 'Read Only' : 'Editable';
    })



    V.sizes.canvas2d.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        if (editPos && V.leftPanel.spreadsheet == V.state[2]) {
            V.workingArea.points.pop();
        }

    })

    V.sizes.canvas2d.addEventListener('click', (e) => {
        if (editPos) {
            const intersects = getInteresects(e.clientX, e.clientY);    

            var doP = (V.leftPanel.spreadsheet == V.state[0]) ? true : false;

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
            // await saveGroup(db, V.dropd.value, V.leftPanel.gi, V.tracers, V.leftPanel.text)
            import('../shared/saveGroup.js').then((module) => {
                V.leftPanel.groups[V.leftPanel.gi] = module.default(db, V.dropd.value, V.leftPanel.gi, V.tracers, V.leftPanel.text)
                console.log(V.leftPanel.groups[V.leftPanel.gi])
            })
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
        //await saveGroup(db, V.dropd.value, i, V.tracers, V.leftPanel.text)
        import('../shared/saveGroup.js').then((module) => {
            V.leftPanel.groups[i] = module.default(db, V.dropd.value, i, V.tracers, V.leftPanel.text)
            console.log(V.leftPanel.groups[i])
        })
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
            saveArea(db, V.dropd.value, i + 1, a)
            V.resetWorkingArea();
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
