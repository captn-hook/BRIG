import {
    navigate, 
    defaultPage
} from '../index/index.js';

import {
    default as html
} from "./account.html";

import {
    login,
    elogin,
    logout
} from '../shared/Log.js';

let currentParams;

export function open(state) {
    
	document.body.innerHTML = html;
    defaultPage();

    currentParams = state.params;

    let log = document.getElementById('login')
    if (log) { addEventListener('click', function() { login(state.params ) }); }
    let elog = document.getElementById('elogin')
    if (elog) { log.addEventListener('click', function() { elogin(state.params ) }); }
    let out = document.getElementById('logout')
    if (out) { out.addEventListener('click', function() { logout(state.params ) }); }

    return Promise.resolve();
}

export function close() {
    return Promise.resolve();
}