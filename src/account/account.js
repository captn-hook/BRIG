import './account.css';
import {
    default as siteListElem
} from './siteListElem.js';
import {
    default as defaultPage
} from '../index/DefaultPage.js';

import {
    default as html
} from "./account.html";

import {
    emailLoginButton,
    createAccountButton,
    googleLoginButton,
    resetPassButton,
    logout,
    loginStyle
} from '../shared/Log.js';
import { navigate } from '../index';

export function open(state, firebaseEnv = null) {

    document.body.innerHTML = html;
    defaultPage();

    var classes = document.getElementById('account').className.split(' ');
    //remove defRestrictDark or defRestrictLight from classes
    if (classes.indexOf('defRestrictDark') > -1) classes.splice(classes.indexOf('defRestrictDark'), 1);
    if (classes.indexOf('defRestrictLight') > -1) classes.splice(classes.indexOf('defRestrictLight'), 1);
    //console.log('elogin', elog)
    //if there is a user, show logout, otherwise show login'
    //put username in user field
    if (firebaseEnv.auth.currentUser) {
        console.log('user: ', firebaseEnv.auth.currentUser.email);
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
        
		let ext = firebaseEnv.auth.currentUser.email.split('@')[1];

		if (ext[1] == 'poppy.com' || firebaseEnv.auth.currentUser.email == 'tristanskyhook@gmail.com') {
            document.getElementById('manager').style.display = 'block';
        }

        if (state.params.siteList != undefined) {
            let elem = siteListElem(state.params.siteList);
            document.getElementById('info').appendChild(elem);
            //for every child add listener set hash + navigate to viewer
            function listener(idstring) {
                let hash = idstring;
                state.params.hash = hash;
                window.location.hash = hash;
                navigate('viewer', hash);
            }

            for (let i = 0; i < elem.children.length; i++) {
                elem.children[i].addEventListener('click', function () {
                    listener(elem.children[i].id);
                });
            }
        }

    } else {

        let accntBtns = document.getElementById('accountBtns');
        let elog = emailLoginButton(firebaseEnv.auth, classes)
        let rp = resetPassButton(firebaseEnv.auth, classes);
        let createAccnt = createAccountButton(firebaseEnv.auth, classes);

        let gg = googleLoginButton(firebaseEnv.auth, firebaseEnv.provider, classes.concat('googAcnt').concat('googPos'));

        accntBtns.appendChild(elog);
        accntBtns.appendChild(rp);
        accntBtns.appendChild(createAccnt);
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
