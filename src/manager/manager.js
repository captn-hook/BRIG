import './manager.css';
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
    setDoc,
    doc,
} from 'firebase/firestore';

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

import {
    //doc,
    getFirestore
} from 'firebase/firestore';    

import {
    navigate
} from '../index/index.js'

export function open(state, firebaseEnv) {

    document.body.innerHTML = html;
    defaultPage();

    const storage = getStorage(firebaseEnv.app);

    const defaults = 'Select a site'
    var s = { value: defaults };


    const db = getFirestore(firebaseEnv.app);
    const functions = getFunctions(firebaseEnv.app);
    const listUsers = httpsCallable(functions, 'listUsers');

    const userTable = new UserTable(document.getElementById('table'), defaults);

    if (firebaseEnv.auth.currentUser) {
        let ext = firebaseEnv.auth.currentUser.email.split('@')[1];

        if (ext[1] == 'poppy.com' || firebaseEnv.auth.currentUser.email == 'tristanskyhook@gmail.com') {

            document.getElementById('perms').addEventListener('click', savePerms);


            var allUsersM = [];
            if (state.params.siteList != undefined) {
                let elem = siteListElem(state.params.siteList);
                document.getElementById('info').appendChild(elem);

                function listener(idstring) {
                    s.value = idstring;
                    userTable.emptyTable();
                    userTable.populateTable(storage, allUsersM, s.value, state.params.darkTheme);
                }

                for (let i = 0; i < elem.children.length; i++) {
                    elem.children[i].addEventListener('click', function () {
                        listener(elem.children[i].id);
                        document.getElementById('sname').innerHTML = elem.children[i].id;
                    });
                }

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
            userTable.emptyTable();
            listUsers().
                then((u) => {
                    u.data.users.forEach((user) => {
                        if (user.email.split('@')[1] != 'poppy.com') {
                            allUsersM.push([user.uid, user.email]);
                        }
                    });
                    userTable.populateTable(storage, allUsersM, s.value, state.params.darkTheme);
                });

        }).catch((error) => {
            //console.log(error)
        });
    };

    return Promise.resolve();

}

export function close() {
    return Promise.resolve();
}