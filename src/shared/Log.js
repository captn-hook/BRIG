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
    //console.log('displaySignInError');
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
        //console.log('goog', bt);
        //console.log('goog', bt.classList);
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

export function elogin(auth) {
    //console.log('elogin');
    signInWithMyPopup().then((result) => {
        signInWithEmailAndPassword(auth, result.user, result.password)
            .then((userCredential) => {
                // Signed in
                //console.log(userCredential);
                hideSignInError();
                signedIn();
            })
            .catch((error) => {
                //const errorCode = error.code;
                //const errorMessage = error.message;
                //console.log(errorCode, errorMessage);
                displaySignInError();
                //if there is a ereset id on document, append to it
                if (document.getElementById('ereset')) {
                    console.log('ereset', document.getElementById('ereset'));
                    document.getElementById('ereset').appendChild(resetPassForm(auth));
                }
                //console.log("Email Sign In Failed");
            });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(errorCode, errorMessage);
    });

    return Promise.resolve();
}

export function login(auth, provider) {
    signInWithPopup(auth, provider)
        .then((result) => {
            //console.log(result);
            hideSignInError();
            signedIn();
        })
        .catch((error) => {
            //const errorCode = error.code;
            //const errorMessage = error.message;
            //console.log(errorCode, errorMessage);
            displaySignInError(true);
            //console.log("Popup Sign In Failed");
        });
        
    return Promise.resolve();
}

async function signedIn() {
	navigate('viewer');
    return Promise.resolve();
}

export function logout(auth) {
    //console.log('logout');
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
export function emailLoginButton(auth, classes = ['Btn']) {
    var button = createButton('elogin', 'Email Login', classes);
    button.addEventListener('click', function() { elogin( auth ).catch((error) => { console.log(error); }); });
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

export function googleLoginButton(auth, provider, classes = ['google']) {
    //console.log('googleLoginButton', classes);
    var button = imageButton('login', google, classes);
    button.addEventListener('click', function() { login( auth, provider ); });
    //testing sign in error on load
    //button.addEventListener('mouseover', function() { displaySignInError(true); });
    return button;
}

export function resetPassForm(auth) {
    //creates a input for email and a button to send reset email
    var form = document.createElement('form');
    form.id = 'resetPassForm';
    var input = document.createElement('input');
    input.id = 'resetPassEmail';
    input.type = 'email';
    input.placeholder = 'Email';
    var button = document.createElement('button');
    button.id = 'resetPass';
    button.innerHTML = 'Reset Password';
    button.addEventListener('click', function() {
        sendPasswordResetEmail(auth, document.getElementById('resetPassEmail').value)
        .then(() => {
            // Password reset email sent!
            // green background
            form.style.backgroundColor = '#00ff00';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //console.log(errorCode, errorMessage);
            // red background
            form.style.backgroundColor = '#ff0000';
        });
    });
    form.appendChild(input);
    form.appendChild(button);
    return form;
}