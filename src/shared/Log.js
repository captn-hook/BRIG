import {
    signInWithPopup,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth"

import {
    navigate,
} from '../index/index.js';

import google from '../images/google.svg';

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

function displaySignInError(goog = false) {
    hideSignInError();
    //create a element to display error in nav
    var se = document.createElement('div');
    se.id = 'signInError';
    se.innerHTML = 'Sign In Failed';
    se.classList.add('signInError');
    if (goog) {
        se.classList.add('googleSignInError');
    }
    document.getElementById('nav').appendChild(se);
}

function hideSignInError() {
    //remove element if exists
    var se = document.getElementById('signInError');
    if (se) {
        se.remove();
    }
}

export function elogin(currentParams) {
    console.log('elogin');
    signInWithMyPopup().then((result) => {
        signInWithEmailAndPassword(currentParams.firebaseEnv.auth, result.user, result.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                hideSignInError();
                signedIn();
            })
            .catch((error) => {
                //const errorCode = error.code;
                //const errorMessage = error.message;
                //console.log(errorCode, errorMessage);
                displaySignInError();
                console.log("Email Sign In Failed");
            });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });

    return Promise.resolve();
}

export function login(currentParams) {
    console.log('login');
    signInWithPopup(currentParams.firebaseEnv.auth, currentParams.firebaseEnv.provider)
        .then((result) => {
            //just puts in currentParams.user
            hideSignInError();
            signedIn();
        })
        .catch((error) => {
            //const errorCode = error.code;
            //const errorMessage = error.message;
            //console.log(errorCode, errorMessage);
            displaySignInError(true);
            console.log("Popup Sign In Failed");
        });
        
    return Promise.resolve();
}

async function signedIn() {
	navigate('viewer');
    return Promise.resolve();
}

export function logout(auth) {
    console.log('logout');
    signOut(auth)
    //also clear all sites and user list
}

export function loginStyle() {
	//remove restricted classes for logged in users
	
	var elements = document.querySelectorAll('[class*="restricted"]');
	for (var i = 0; i < elements.length; i++) {
		elements[i].className = elements[i].className.replace('restricted', '');
	}
	//eventually discriminate between editor and viewe
}

export function createButton(id, text, classes) {
	var button = document.createElement('button');
	button.id = id;
	button.innerHTML = text;
	//classes should be space separated
	button.classList.add( ...classes );
	return button;
}

export function emailLoginButton(classes = ['Btn']) {
    var button = createButton('elogin', 'Email Login', classes);
    button.addEventListener('click', function() { elogin(); });
    return button;
}

export function imageButton(id, src, classes) {
	var button = document.createElement('img');
	button.id = id;
	button.src = src;
	button.classList.add( ...classes );
	return button;
}

export function googleLoginButton(classes = ['google']) {
    var button = imageButton('login', google, classes);
    button.addEventListener('click', function() { login(); });
    return button;
}
