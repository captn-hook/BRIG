import {
    signInWithPopup,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth"

// import {
//     navigate,
// } from '../index/index.js';

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

function resetPasswordQ(auth) {
    return new Promise((resolve, reject) => {
        var email = prompt('Email');
        resolve(email);
    });
}

export function resetPassButton(auth, classes) {
    var resetPass = createButton('resetPass', 'Reset Password', classes);
    resetPass.addEventListener('click', function() {
        resetPasswordQ(auth).then((email) => {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    // Password reset email sent!
                    //console.log('Password reset email sent!');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    //console.log(errorCode, errorMessage);
                    displaySignInError('resetPass');
                });
        });
    });
    return resetPass;
}

function displaySignInError(nodeid) {
    console.log('displaySignInError', nodeid);
    let node = document.getElementById(nodeid);

    let goog = node.classList.contains('googAcnt'); 
    console.log('displaySignInError', nodeid, goog);
    hideSignInError();
    //create a element to display error in nav
    var se = document.createElement('span');
    se.id = 'signInError';
    se.innerHTML = 'Sign In Failed';
    se.classList.add(goog ? 'googAcntError' : 'signInError');
    
    if (goog && node.classList.contains('googPos')) {
        //remove class googPos
        node.classList.remove('googPos');
        node.classList.add('signInParent');
    }

    //bt.classList.add('signInParent');
    se.addEventListener('mouseover', function() { hideSignInError(); });
    node.appendChild(se);
}

function hideSignInError() {
    //remove element if exists
    var se = document.getElementById('signInError');

    if (se) {
    //fade out
    //remove element after transition
    se.style.transition = 'opacity 0.5s';
    se.style.opacity = 0;
    setTimeout(function() { se.remove(); removeGoogPos(); }, 500);
    }
}

function removeGoogPos() {
    if (document.getElementById('login').classList.contains('googAcnt')) {
        let gg = document.getElementById('login')
        gg.classList.add('googPos');
        gg.classList.remove('signInParent');
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
                displaySignInError('elogin');
                //if there is a ereset id on document, append to it
                // if (document.getElementById('ereset') && !document.getElementById('resetPassForm')) {
                //     console.log('ereset', document.getElementById('ereset'));
                //     document.getElementById('ereset').appendChild(resetPassForm(auth));
                // }
                //console.log("Email Sign In Failed");
            });
    })
    // .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     //console.log(errorCode, errorMessage);
    // });

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
            console.log(errorCode, errorMessage);
            displaySignInError('login');
            //console.log("Popup Sign In Failed");
        });
        
    return Promise.resolve();
}

async function signedIn() {
	//navigate('viewer');
    //console.log('signedIn');
    return Promise.resolve();
}

export function logout(auth) {
    //console.log('logout');
    signOut(auth)
    //dispatch reload event
    .then(() => {
        //console.log('reload');
        location.reload();
    }
    )
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
    button.addEventListener('click', function() { elogin( auth ).catch((error) => { /*console.log(error);*/ }); });
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
    // button.addEventListener('click', function() {
    //     console.log('resetPass');
    //     //sendPasswordResetEmail(auth, document.getElementById('resetPassEmail').value)
    //     // .then(() => {
    //     //     // Password reset email sent!
    //     //     // green background
    //     //     form.style.backgroundColor = '#00ff00';
    //     // })
    //     // .catch((error) => {
    //     //     const errorCode = error.code;
    //     //     const errorMessage = error.message;
    //     //     //console.log(errorCode, errorMessage);
    //     //     // red background
    //     //     form.style.backgroundColor = '#ff0000';
    //     // });
    // });
    //OK SO BUTTON HAS LISTENER SOMEHOW!!!
    button.replaceWith(button.cloneNode());
    button.addEventListener('click', function() { /*console.log('resetPass'); */});
    form.appendChild(input);
    form.appendChild(button);
    return form;
}

export function createAccount(auth) {
    signInWithMyPopup().then((result) => {
        createUserWithEmailAndPassword(auth, result.user, result.password)
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
                displaySignInError('createAccount');
                //console.log("Email Sign In Failed");
            });
    })
    // .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     //console.log(errorCode, errorMessage);
    // });
}

export function createAccountButton(auth, classes = ['Btn']) {
    var button = createButton('createAccount', 'Create Account', classes);
    button.addEventListener('click', function() { createAccount(auth); });
    return button;
}