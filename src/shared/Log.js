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
}

export function login(currentParams) {
    console.log('login');
    signInWithPopup(currentParams.firebaseEnv.auth, currentParams.firebaseEnv.provider)
        .then((result) => {
            signedIn(result.user, currentParams);
        })
}

async function signedIn(user, currentParams) {
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
        //maybe just append to currentParams
        ///sitelist *
        currentParams.user = user;
        currentParams.sitelist = [];
		navigate('editor', currentParams);
    } else {
		//empty site list
		//get users sites
        //list users sites and put in site list?????
        currentParams.user = user;
        currentParams.sitelist = [];
		navigate('viewer', currentParams);
    }
    window.dispatchEvent(new Event('hashchange'));
    window.dispatchEvent(new Event('resize'));

}

export function logout(auth) {
    console.log('logout');
    signOut(auth)
    //also clear all sites and user list
}
