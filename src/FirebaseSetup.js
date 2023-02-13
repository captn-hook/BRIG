import {
    config
} from './key';

import {
    getFunctions,
    httpsCallable
} from 'firebase/functions';

import {
    initializeApp
} from 'firebase/app';

import {
    getStorage
} from 'firebase/storage';

import {
    getFirestore
} from "firebase/firestore";

export function setupFirebase() {

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

    return [listUsers, db, storage];

}