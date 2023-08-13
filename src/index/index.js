import '../style.css';
import './index.css';

import {
	initializeApp
} from 'firebase/app';

import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
} from 'firebase/auth';

import {
	firebaseConfig
} from '../key';

import {
	default as html
} from "./index.html";

import {
	//doc,
	getFirestore
} from 'firebase/firestore';

import defaultPage from './DefaultPage.js';

import {
    getFunctions,
    //httpsCallable,
    //connectFunctionsEmulator
} from 'firebase/functions';

import {
	getStorage,// list
} from 'firebase/storage';

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();
//console.log('init');
// Router state
let currentPage;
let currentAction;
let currentParams = { darkTheme: true };
//just a passable container for firebase stuff
let firebaseEnv = { app: app, provider: provider, auth: auth };

export function loginPage() {
	//remove the account button and replace with login buttons
	var account = document.getElementById('account');
	var classes = account.className.split(' ');
	//account.remove();
	//get nav
	var nav = document.getElementById('nav');
	//console.log('ADDED LOGINS BUTTONS');
	import('../shared/Log.js').then((module) => {
		//console.log('module: ' + module.emailLoginButton);
		var elogin = module.emailLoginButton(firebaseEnv.auth, classes);
		var login = module.googleLoginButton(firebaseEnv.auth, firebaseEnv.provider);
		//console.log('login: ' + login);
		nav.appendChild(elogin);
		nav.appendChild(login);

	})//.catch((error) => { console.err(error); });		
}

bootstrapAsync(getCurrentPage());

//login functions
function clogin() {
	//import loginstyle from '../shared/Log.js';
	import('../shared/Log.js').then((module) => { module.loginStyle(); })//.catch((error) => { console.err(error); });
	//import sitelist and add to params
	if (document.getElementById('manager')) {
		document.getElementById('manager').style.display = 'block';
	}
}

function getList(app, uid) {
	const db = getFirestore(app);
	return import('../shared/userSites.js').then((module) => { return module.default(db, uid); });
}

async function allSites(storage) {
	return import('../shared/allSites.js').then((module) => { return module.default(storage); }).catch((error) => { 
		console.error(error); 
		//getlist
		return getList(firebaseEnv.app, firebaseEnv.auth.currentUser.uid);
		
	});
}


const functions = getFunctions(firebaseEnv.app);
//connectFunctionsEmulator(functions, 'localhost', 5001);
//

onAuthStateChanged(firebaseEnv.auth, (user) => {
	//console.log('auth');
	if (user) {
		let ext = firebaseEnv.auth.currentUser.email.split('@')[1];

		if (ext[1] == 'poppy.com' || firebaseEnv.auth.currentUser.email == 'tristanskyhook@gmail.com') {
			allSites(getStorage(firebaseEnv.app)).then((list) => {
				//console.log('list: ' + list);
				currentParams.siteList = list;
				currentPage.open({ params: currentParams }, firebaseEnv);
				clogin();
			} );

			if (document.getElementById('manager')) {
				document.getElementById('manager').style.display = 'block';
			}
			// currentPage.open({ params: currentParams }, firebaseEnv);
			// clogin();
		} else {
			//console.log('AUTH STATE logged in', firebaseEnv.auth.currentUser);
			//console.log('RELOADING PAGE', currentParams);
			getList(firebaseEnv.app, firebaseEnv.auth.currentUser.uid).then((list) => {
				currentParams.siteList = list;

				currentPage.open({ params: currentParams }, firebaseEnv);

				clogin();
			});
		}
	} else {
		//console.log('AUTH STATE  not logged in', location.pathname);
	}
});


//Bind router to events (modern browsers only)
function registerRouter() {
	window.addEventListener("popstate", event => {

		//check if the page is the same as the current page
		//if it is, just update the params
		//if it isn't, open the page

		if (event.state == null) {
			//pass

		} else if (event.state.page == currentPage.name) {
			currentPage.open({ params: event.state.params }, firebaseEnv);
		} else {

			openPage(event.state || {
				page: getCurrentPage(),
				params: currentParams
			});
		}
	});
}

export function bootstrapAsync(pageName) {
	currentAction = Promise.resolve();
	//console.log('boots: ' + pageName);
	openPage({
		page: pageName,
		params: currentParams
	})
	registerRouter();
}
export function regMatchPath(path) {
	const pages = ['editor', 'account', 'viewer', 'manager']
	//regex matches like /editor/whatever/doesnt/matter -> editor
	//                   /editor -> editor
	//                   /account -> account
	//                   /viewer/ -> viewer
	let match = path.match(/^\/([^\/]+)(\/|$)/);
	//if the path has more / followed by anything, match[1] will be the first word and the rest will be cuts
	//console.log('match: ' + match);
	if (match) {
		//check match[1] against known pages
		if (pages.includes(match[1])) {
			//console.log('match[1]: ' + match[1]);
			return match[1];
		}
	}
	//console.log('no match, returning index ' + match);
	return 'index';
}

// get current page from URL
export function getCurrentPage() {
	//console.log('pathname: ' + location.pathname);
	let mtch = regMatchPath(location.pathname);
	//enforce match on location.pathname
	return mtch;
}

// Start loading loading page
//const loadingPage = import("./loading/page");
// Router logic for loading and opening a page.
function openPage(state, hash = '') {
	//console.log('OPEN PAGING: ' + state);
	//console.log('OPEN Params: ' + state.params);
	//switchTheme(state.params.darkTheme);
	const pageName = state.page;
	var currentPath = document.location.pathname
	currentPath = currentPath.replace('/', '').replace('/', '');
	if (pageName != currentPath && currentPath != '') {
		console.error('pathname: ' + currentPath + ' does not match pageName: ' + pageName);
		//reload root
		window.location.href = '/';
	} else {
		//set hash
		if (hash != '') {
			window.location.hash = hash;
		}
	}
	currentAction = currentAction
		// Close the current page
		.then(() => currentPage && currentPage.close())
		// Start loading the next page
		.then(() => import(`../${pageName}/${pageName}`))
		// Open the next page
		.then(newPage => {
			currentPage = newPage;
			//console.log('currentPage: ' + currentPage);
			//console.log('OPENING PAGE: ', state);
			//console.log('WITH: ', firebaseEnv, firebaseEnv.auth.currentUser);
			return currentPage.open(state, firebaseEnv);
		})

	return currentAction;
}

// Router logic, Called by pages
// Starts navigating to another page
export function navigate(pageName, hash = '') {
	const state = { page: pageName, params: currentParams };
	const hist = { page: pageName };
	state.params.hash = hash;
	window.history.pushState(state, pageName, `${pageName}`);
	openPage(state, hash);
}

export function open(state, firebaseEnv = null) {
	document.body.innerHTML = html;
	//console.log('OPEN() INDEX', state);
	defaultPage();
	if (firebaseEnv.auth.currentUser) {
		//console.log('logged in style');
		clogin();
	} else {
		//console.log('not logged in style');
		loginPage();
	}
	return Promise.resolve();
}

export function close() {
	return Promise.resolve();
}