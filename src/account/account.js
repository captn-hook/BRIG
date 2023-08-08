import {
    navigate 
} from '../index/index.js';

import {
    default as defaultPage
} from '../index/DefaultPage.js';

import {
    default as html
} from "./account.html";

import {
    emailLoginButton,
    googleLoginButton,
    resetPassButton,
    logout,
    loginStyle
} from '../shared/Log.js';

export function open(state, firebaseEnv = null) {

    document.body.innerHTML = html;
    console.log('ACT OPEN', state);
    console.log('WITH: ', state.params);
    defaultPage();

    var classes = document.getElementById('account').className.split(' ');
    //remove defRestrictDark or defRestrictLight from classes
    if (classes.indexOf('defRestrictDark') > -1) classes.splice(classes.indexOf('defRestrictDark'), 1);
    if (classes.indexOf('defRestrictLight') > -1) classes.splice(classes.indexOf('defRestrictLight'), 1);
    //console.log('elogin', elog)
    //if there is a user, show logout, otherwise show login'
    //put username in user field
    if (firebaseEnv.auth.currentUser) {
        let usrname = document.getElementById('username');
        usrname.innerHTML = firebaseEnv.auth.currentUser.email;

        loginStyle();

        let logoutBtn = document.createElement('button');
        let accntBtns = document.getElementById('accountBtns');
        logoutBtn.id = 'logout';
        logoutBtn.innerHTML = 'Logout';
        logoutBtn.classList.add(...classes);
        logoutBtn.addEventListener('click', function () { logout(firebaseEnv.auth); });

        accntBtns.appendChild(logoutBtn);
        //create sitelist view
        console.log('getting list', firebaseEnv.app, firebaseEnv.auth.currentUser.uid);
        let elem = siteListElem(state.params.siteList);
        document.getElementById('info').appendChild(elem);
       


    } else {

        let accntBtns = document.getElementById('accountBtns');
        let elog = emailLoginButton(firebaseEnv.auth, classes)
        let rp = resetPassButton(firebaseEnv.auth, classes);

        let gg = googleLoginButton(firebaseEnv.auth, firebaseEnv.provider, classes.concat('googAcnt').concat('googPos'));

        accntBtns.appendChild(elog);
        accntBtns.appendChild(rp);
        accntBtns.appendChild(gg);

        //create account management buttons
    }
    //switchTheme(state.params.darkTheme);
    //console.log('account open');
    return Promise.resolve();
}

export function close() {
    return Promise.resolve();
}

function siteListElem(sites) {
    //returns a scrollable list of sites populated from 
    let list = document.createElement('div');
    list.id = 'siteList';
    list.classList.add('siteList');

    sites.forEach((site) => {
        console.log('SITE: ', site);
        let siteElem = document.createElement('div');
        siteElem.classList.add('siteElem');
        siteElem.innerHTML = site;
        siteElem.addEventListener('click', function () { navigate('viewer', site); });

        list.appendChild(siteElem);
    });

    return list;
}