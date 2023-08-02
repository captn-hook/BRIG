import {
    //navigate, 
    defaultPage
} from '../index/index.js';

import {
    default as html
} from "./account.html";

import {
    emailLoginButton,
    googleLoginButton,
    logout,
    loginStyle
} from '../shared/Log.js';

let currentParams;

export function open(state) {
    
	document.body.innerHTML = html;
    defaultPage(state.params);

    currentParams = state.params;

    let classes = document.getElementById('account').className.split(' ');
    //remove defRestrictDark or defRestrictLight from classes
    if (classes.indexOf('defRestrictDark') > -1) classes.splice(classes.indexOf('defRestrictDark'), 1);
    if (classes.indexOf('defRestrictLight') > -1) classes.splice(classes.indexOf('defRestrictLight'), 1);
    //console.log('elogin', elog)
    //if there is a user, show logout, otherwise show login'
    //put username in user field
    if (currentParams.user) {
        let usrname = document.getElementById('username');
        usrname.innerHTML = currentParams.user.email;

        loginStyle();

        let logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout';
        logoutBtn.innerHTML = 'Logout';
        logoutBtn.classList.add(...classes);
        logoutBtn.addEventListener('click', function() { logout(currentParams.firebaseEnv.auth); });
        
        //create sitelist view
        
    } else {

        let accntBtns = document.getElementById('accountBtns');
        accntBtns.appendChild(googleLoginButton());
        accntBtns.appendChild(emailLoginButton(classes));

        //create account management buttons
    }    
    console.log('account open');
    return Promise.resolve();
}

export function close() {
    return Promise.resolve();
}