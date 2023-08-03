import {
    signInWithPopup,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
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
    console.log('displaySignInError');
    hideSignInError();
    //create a element to display error in nav
    var se = document.createElement('span');
    se.id = 'signInError';
    se.innerHTML = 'Sign In Failed';
    se.classList.add(goog ? 'googAcntError' : 'signInError');
    let bt = document.getElementById(goog ? 'login' : 'elogin')
    if (goog && bt.classList.contains('googPos')) {
        //remove class googPos
        bt.classList.remove('googPos');
        bt.classList.add('signInParent');
        console.log('goog', bt);
        console.log('goog', bt.classList);
        //hacky but fk it
    } else if (!goog && !document.getElementById('login').classList.contains('googPos') && document.getElementById('login').classList.contains('signInParent')) {
        //add googpose back
        let gg = document.getElementById('login')
        gg.classList.add('googPos');
        gg.classList.remove('signInParent');
    }
    //bt.classList.add('signInParent');
    bt.appendChild(se);
}

function hideSignInError() {
    //remove element if exists
    var se = document.getElementById('signInError');
    if (se) {
        se.remove();
    }
}

export function elogin(params) {
    console.log('elogin');
    signInWithMyPopup().then((result) => {
        signInWithEmailAndPassword(params.firebaseEnv.auth, result.user, result.password)
            .then((userCredential) => {
                // Signed in
                console.log(userCredential);
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

export function login(params) {
    signInWithPopup(params.firebaseEnv.auth, params.firebaseEnv.provider)
        .then((result) => {
            console.log(result);
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
	//eventually discriminate between editor and viewer
}

export function createButton(id, text, classes) {
	var button = document.createElement('button');
	button.id = id;
	button.innerHTML = text;
	//classes should be space separated
	button.classList.add( ...classes );
	return button;
}
//params contains a firebaseEnv auth object
export function emailLoginButton(params, classes = ['Btn']) {
    var button = createButton('elogin', 'Email Login', classes);
    button.addEventListener('click', function() { elogin( params ); });
    //testing sign in error
    //button.addEventListener('mouseover', function() { displaySignInError(); });
    return button;
}

export function imageButton(id, src, classes) {
	var button = document.createElement('button');
	button.id = id;
    button.style.backgroundImage = 'url(' + src + ')';
	button.classList.add( ...classes );
	return button;
}

export function googleLoginButton(params, classes = ['google']) {
    console.log('googleLoginButton', classes);
    var button = imageButton('login', google, classes);
    button.addEventListener('click', function() { login( params ); });
    //testing sign in error on load
    //button.addEventListener('mouseover', function() { displaySignInError(true); });
    return button;
}

export function resetButton(params, classes = ['Btn']) {
    var button = createButton('reset', 'Reset Password', classes);
    button.addEventListener('click', function() { reset( params ); });
    return button;
}