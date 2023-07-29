import {
    navigate
} from '../index.js';

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
		navigate('editor');
    } else {
		//empty site list
		//get users sites
		navigate('viewer');
    }
    window.dispatchEvent(new Event('hashchange'));
    window.dispatchEvent(new Event('resize'));

}

function logout(auth) {
    console.log('logout');
    signOut(auth)
    //also clear all sites and user list
}

export function open(state) {
    document.getElementById('login').addEventListener('click', function() { login(state.firebaseEnv.auth, state.firebaseEnv.provider) });
    document.getElementById('elogin').addEventListener('click', function() { elogin(state.firebaseEnv.auth) });
    document.getElementById('logout').addEventListener('click', function() { logout(state.firebaseEnv.auth) });
}