import { default as html } from './manager.html';

import {
    UserTable
} from './UserTable.js';

import {
    getFunctions,
    httpsCallable,
    //connectFunctionsEmulator
} from 'firebase/functions';

import {
    getStorage,
    ref,
    //listAll,
    //getBlob,
    updateMetadata,
    //getMetadata, 
} from 'firebase/storage';

import {
    default as defaultPage
} from '../index/DefaultPage.js';

import {
    default as siteListElem
} from '../account/siteListElem.js';

export function open(state, firebaseEnv) {

    document.body.innerHTML = html;
    defaultPage();

    const storage = getStorage(firebaseEnv.app);

    const defaults = 'Select a site'
    const s = { value: defaults };


    const functions = getFunctions(firebaseEnv.app);
    const listUsers = httpsCallable(functions, 'listUsers');

    const userTable = new UserTable(document.getElementById('table'), defaults);
    var allUsersM = [];


    if (firebaseEnv.auth.currentUser) {
        let ext = firebaseEnv.auth.currentUser.email.split('@')[1];

        if (ext[1] == 'poppy.com' || firebaseEnv.auth.currentUser.email == 'tristanskyhook@gmail.com') {

            document.getElementById('perms').addEventListener('click', savePerms);


            var allUsersM = [];
            if (state.params.siteList != undefined) {
                let elem = siteListElem(state.params.siteList);
                document.getElementById('info').appendChild(elem);
            } else {
                //console.log('no stparm');
            }

            listUsers().
                then((u) => {
                    u.data.users.forEach((user) => {
                        if (user.email.split('@')[1] != 'poppy.com') {
                            allUsersM.push([user.uid, user.email]);
                        }
                    });
                    userTable.populateTable(storage, allUsersM, s.value, state.params.darkTheme);
                });
        }
    }

    async function savePerms() {

        var itemRef = ref(storage, '/Sites/' + s.value + '/' + s.value + '.glb')
        var inner = '';
        let d = {}

        userTable.inUsers.forEach((user) => {
            inner += '"' + user[1] + '":"' + user[0] + '",';
            d[user[1]] = user[0];
            setDoc(doc(db, user[0], s.value), {
                'access': true,
            })
        })

        userTable.allUsers.forEach((user) => {
            inner += '"' + user[1] + '":"false",';
            d[user[1]] = 'false';
            setDoc(doc(db, user[0], s.value), {
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

    return Promise.resolve();

}

export function close() {
    return Promise.resolve();
}