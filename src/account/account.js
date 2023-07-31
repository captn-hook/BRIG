import {
    navigate, 
    defaultPage
} from '../index/index.js';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth"

import {
    default as html
} from "./account.html";

let currentParams;

export function open(state) {
    
	document.body.innerHTML = html;
    defaultPage();

    currentParams = state.params;

    let log = document.getElementById('login')
    if (log) { addEventListener('click', function() { login(state.params.firebaseEnv.auth, state.params.firebaseEnv.provider) }); }
    let elog = document.getElementById('elogin')
    if (elog) { log.addEventListener('click', function() { elogin(state.params.firebaseEnv.auth) }); }
    let out = document.getElementById('logout')
    if (out) { out.addEventListener('click', function() { logout(state.params.firebaseEnv.auth) }); }

    return Promise.resolve();
}

export function close() {
    return Promise.resolve();
}

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

function elogin(auth) {
    console.log('elogin');
    signInWithMyPopup().then((result) => {
        signInWithEmailAndPassword(auth, result.user, result.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                signedIn(user);
            })
    })
}

function login(auth, provider) {
    console.log('login');
    signInWithPopup(auth, provider)
        .then((result) => {
            signedIn(result.user);
        })
}

async function signedIn(user) {
    //empty list site list, and user list?
    // The signed-in user info.
    const ext = user.email.split('@')
	//fix this =======================================================---------------------------------------<><<<<<<<<<<<<<<<<<
    if (ext[1] == 'poppy.com' || user.email == 'tristanskyhook@gmail.com') {
		console.log('admin logged in');
		//change to admin page
		//list users
		//empty all sites
		//list all sites
		//just go to editor page
		navigate('editor', currentParams);
    } else {
		//empty site list
		//get users sites
		navigate('viewer', currentParams);
    }
    window.dispatchEvent(new Event('hashchange'));
    window.dispatchEvent(new Event('resize'));

}

function logout(auth) {
    console.log('logout');
    signOut(auth)
    //also clear all sites and user list
}
