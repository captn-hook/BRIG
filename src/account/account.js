import {
    //navigate, 
    defaultPage
} from '../index/index.js';

import {
    default as html
} from "./account.html";

import {
    login,
    elogin,
    logout,
    loginStyle
} from '../shared/Log.js';

let currentParams;

export function open(state) {
    
	document.body.innerHTML = html;
    defaultPage(state.params);

    currentParams = state.params;

    
    let out = document.getElementById('logout')
    //console.log('logout', out)
    let log = document.getElementById('login')
    //console.log('login', log)
    let elog = document.getElementById('elogin')
    //console.log('elogin', elog)
    //if there is a user, show logout, otherwise show login'
    //put username in user field
    if (currentParams.user) {
        let usrname = document.getElementById('username');
        usrname.innerHTML = currentParams.user.email;

        loginStyle();
    
        if (out) {
            out.addEventListener('click', function() { 
                logout(state.params.firebaseEnv.auth)
                
                state.params = null;
                window.location.reload();
            })
        }
        
        if (log) {
            log.style.display = 'none';
        }

        if (elog) {
            elog.style.display = 'none';
        }
    } else {
        if (out) {
            out.style.display = 'none';
        }

        if (log) {
            log.addEventListener('click', function() { state.params = login(state.params) })
        }

        if (elog) {
            elog.addEventListener('click', function() { state.params = elogin(state.params) })
        }
    }    
    console.log('account open');
    return Promise.resolve();
}

export function close() {
    return Promise.resolve();
}