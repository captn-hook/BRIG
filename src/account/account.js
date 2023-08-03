import {
    //navigate, 
    defaultPage,
    switchTheme
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

export function open(state) {
    
	document.body.innerHTML = html;
    defaultPage(state.params);

    var classes = document.getElementById('account').className.split(' ');
    //remove defRestrictDark or defRestrictLight from classes
    if (classes.indexOf('defRestrictDark') > -1) classes.splice(classes.indexOf('defRestrictDark'), 1);
    if (classes.indexOf('defRestrictLight') > -1) classes.splice(classes.indexOf('defRestrictLight'), 1);
    //console.log('elogin', elog)
    //if there is a user, show logout, otherwise show login'
    //put username in user field
    if (state.params.firebaseEnv.auth.currentUser) {
        let usrname = document.getElementById('username');
        usrname.innerHTML = state.params.firebaseEnv.auth.currentUser.email;

        loginStyle();

        let logoutBtn = document.createElement('button');
        let accntBtns = document.getElementById('accountBtns');
        logoutBtn.id = 'logout';
        logoutBtn.innerHTML = 'Logout';
        logoutBtn.classList.add(...classes);
        logoutBtn.addEventListener('click', function() { logout(state.params.firebaseEnv.auth); });
        
        accntBtns.appendChild(logoutBtn);
        //create sitelist view
        
    } else {

        let accntBtns = document.getElementById('accountBtns');
        let elog = emailLoginButton(state.params, classes);
        let gg = googleLoginButton(state.params, classes.concat('googAcnt').concat('googPos'));
        accntBtns.appendChild(elog);
        accntBtns.appendChild(gg);
       

        //create account management buttons
    }    
    switchTheme(state.params.darkTheme);
    console.log('account open');
    return Promise.resolve();
}

export function close() {
    return Promise.resolve();
}