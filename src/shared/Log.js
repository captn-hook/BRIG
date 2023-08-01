import {
    signInWithPopup,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth"

import {
    navigate,
} from '../index/index.js';

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

export function elogin(currentParams) {
    console.log('elogin');
    signInWithMyPopup().then((result) => {
        signInWithEmailAndPassword(currentParams.firebaseEnv.auth, result.user, result.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                signedIn(user, currentParams);
            })
    })
    return Promise.resolve(currentParams);
}

export function login(currentParams) {
    console.log('login');
    signInWithPopup(currentParams.firebaseEnv.auth, currentParams.firebaseEnv.provider)
        .then((result) => {
            //just puts in currentParams.user
            currentParams = signedIn(result.user, currentParams);
        })
    return Promise.resolve(currentParams);
}

async function signedIn(user, currentParams) {
    //empty list site list, and user list?
    // The signed-in user info.
    // put user in user list
    // eventually, need to get site list from firebase cloud func
    currentParams.user = user;
    currentParams.sites = [];

	navigate('viewer', currentParams);
    return Promise.resolve(currentParams);
}

export function logout(auth) {
    console.log('logout');
    signOut(auth)
    //also clear all sites and user list
}
