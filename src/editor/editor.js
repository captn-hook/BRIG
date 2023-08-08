import * as V from '../viewer/viewer.js';

import { default as html } from "./editor.html";

import {
    saveFile,
    sendFile,
} from '../shared/Data.js';

import {
    getStorage,
    ref,
    listAll,
    getBlob,
    updateMetadata,
    getMetadata,
} from 'firebase/storage';

import {
    getFirestore,
    setDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';

import {
    UserTable
} from './UserTable.js';

import {
    getFunctions,
    httpsCallable,
    //connectFunctionsEmulator
} from 'firebase/functions';

//I NEED
//ms, ts, tracers, insights, views, db, dropd.value
//camera, textbox, handleFiles, handlemodels, defaultDropd
export function open(state, firebaseEnv) {
    document.body.innerHTML = html;
    V.cont(state, firebaseEnv);
    //add editor elements

    const app = firebaseEnv.app;
    const auth = firebaseEnv.auth;
    const provider = firebaseEnv.provider;
    const db = getFirestore(app);
    const storage = getStorage(app);

    const functions = getFunctions(firebaseEnv.app);
    const listUsers = httpsCallable(functions, 'listUsers');

    const userTable = new UserTable(document.getElementById('table'), V.defaultDropd);
    var allUsersM = [];

    if (firebaseEnv.auth.currentUser) {
        let ext = firebaseEnv.auth.currentUser.email.split('@')[1];

        if (ext[1] == 'poppy.com' || firebaseEnv.auth.currentUser.email == 'tristanskyhook@gmail.com') {


            var availableSites = [];

            var accessibleSites = [];

            var allUsersM = [];

            var folderRef = ref(storage, '/Sites');
            V.siteList([]);
            allSites();
            listUsers().
                then((u) => {
                    u.data.users.forEach((user) => {
                        if (user.email.split('@')[1] != 'poppy.com') {
                            allUsersM.push([user.uid, user.email]);
                        }
                    });
                    userTable.populateTable(storage, allUsersM, V.dropd.value, state.params.darkTheme);
                });
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


    document.getElementById('saveFiles').addEventListener('click', (e) => {
        saveFile(V.ms, V.ts, V.tracers, V.insights, V.views);
    })

    document.getElementById('sendFiles').addEventListener('click', (e) => {
        if (V.dropd.value != V.defaultDropd)
            sendFile(V.ms, V.ts, V.tracers, V.insights, V.views, db, V.dropd.value);
    })

    document.getElementById('saveCam').addEventListener('click', (e) => {
        //console.log('saveCam')
        V.views[leftPanel.firstClickY - 1] = [String(V.camera.position.x), String(V.camera.position.y), String(V.camera.position.z)];
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

    document.getElementById('readOnly').addEventListener('click', (e) => {
        V.textbox.readOnly = !V.textbox.readOnly;
        e.target.innerHTML = (V.textbox.readOnly) ? 'Read Only' : 'Editable';
    })

    document.getElementById('perms').addEventListener('click', savePerms);

    async function savePerms() {

        var itemRef = ref(storage, '/Sites/' + V.dropd.value + '/' + V.dropd.value + '.glb')
        var inner = '';
        let d = {}

        userTable.inUsers.forEach((user) => {
            inner += '"' + user[1] + '":"' + user[0] + '",';
            d[user[1]] = user[0];
            setDoc(doc(db, user[0], V.dropd.value), {
                'access': true,
            })
        })

        userTable.allUsers.forEach((user) => {
            inner += '"' + user[1] + '":"false",';
            d[user[1]] = 'false';
            setDoc(doc(db, user[0], V.dropd.value), {
                'access': false,
            })
        })

        inner = inner.slice(0, -1);
        inner = '{"customMetadata":{' + inner + '}}';
        const newMetadata = JSON.parse(inner);

        updateMetadata(itemRef, newMetadata).then((metadata) => {
            userTable.populateTable();
        }).catch((error) => {
            //console.log(error)
        });
    };

    dataInput.addEventListener('change', (e) => {
        V.handleFiles(dataInput.files[0]);
    }, false);

    modelInput.addEventListener('change', (e) => {
        //console.log('modelInput');
        V.handleModels(modelInput.files[0]);
    }, false);


    document.getElementById('title').addEventListener('click', (e) => {

        userTable.bw = !userTable.bw;

    });

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
                V.siteList(accessibleSites);
            });

        })
    }

    return Promise.resolve();
}

export function close() {
    return Promise.resolve();
}
