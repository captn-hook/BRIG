import '../style.css';
import imageUrl1 from '../images/logoDark.png';
import imageUrl2 from '../images/logoLight.png';
import favi from '../images/favi16.ico';

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


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

// Router state
let currentPage;
let currentAction;
let currentParams = { darkTheme: true };
let firebaseEnv = { app: app, provider: provider, auth: auth };

// The application shell with shared visual components
export function defaultPage()
{
	var title = document.getElementById('title');
	title.src = currentParams.darkTheme ? imageUrl1 : imageUrl2;
	title.addEventListener('click', function() {
		//console.log('TH clicked');
		currentParams.darkTheme = !currentParams.darkTheme;
		switchTheme();
	});
	//switchTheme(currentParams.darkTheme);
	var icon = document.getElementById('icon');
	icon.href = favi;
	//there should be a nav on every page, grab it and add navigate(element.title + '.html', currentParams) to each element
	if (document.getElementById('nav')) {
		var nav = document.getElementById('nav');
		var navElements = nav.getElementsByClassName('Btn');
		for (var i = 0; i < navElements.length; i++) {
			navElements[i].addEventListener('click', function() {
				navigate(this.id);
			});
		}
	}
}

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
		
		switchTheme();
	})//.catch((error) => { console.err(error); });		
}

bootstrapAsync(getCurrentPage());

//login functions
function clogin() {
	//import loginstyle from '../shared/Log.js';
	import('../shared/Log.js').then((module) => { module.loginStyle(); })//.catch((error) => { console.err(error); });
	//import sitelist and add to params
	
}

onAuthStateChanged(firebaseEnv.auth, (user) => {

    if (user) {
		console.log('AUTH STATE logged in', firebaseEnv.auth.currentUser);
		console.log('RELOADING PAGE', currentParams);
		currentPage.open({params: currentParams}, firebaseEnv);
		clogin();
    } else {
		console.log('AUTH STATE  not logged in', location.pathname);
    }
});

export function switchTheme() {
	//change the logo url
	title.src = currentParams.darkTheme ? imageUrl1 : imageUrl2;
	var mode = [currentParams.darkTheme ? 'Light' : 'Dark', currentParams.darkTheme ? 'Dark' : 'Light'];
	var elements = document.querySelectorAll('[class*=' + mode[0] + ']');
	for (var i = 0; i < elements.length; i++) {
		elements[i].className = elements[i].className.replace(mode[0], mode[1]);
	}
}

// Bind router to events (modern browsers only)
function registerRouter() {
	window.addEventListener("popstate", event => {
		//console.log('popstate');
		openPage(event.state || {
			page: getCurrentPage(),
			params: currentParams
		});
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
	const pages = ['editor', 'account', 'viewer'];
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
function openPage(state) {
	//console.log('OPEN PAGING: ' + state);
	//console.log('OPEN Params: ' + state.params);
	//switchTheme(state.params.darkTheme);
	const pageName = state.page;
	var currentPath = document.location.pathname
	currentPath = currentPath.replace('/', '').replace('/', '');
	if (pageName != currentPath && currentPath != '') {
		console.error('pathname: ' + currentPath + ' does not match pageName: ' + pageName);
		document.location.pathname = pageName;
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
			console.log('OPENING PAGE: ', state);
			console.log('WITH: ', firebaseEnv, firebaseEnv.auth.currentUser);
			return currentPage.open(state, firebaseEnv);
		})
		// Display error page
		// .catch(err => {
		// 	console.error(err);
		// 	return import("../index/index")
		// 		.then(newPage => {
		// 			currentPage = newPage;
		// 			//console.log('currentPage ERR: ' + currentPage);
		// 			return currentPage.open(err);
		// 		});
		// });
	return currentAction;
}

// Router logic, Called by pages
// Starts navigating to another page
export function navigate(pageName, hash = '') {
	const state = { page: pageName, params: currentParams };
	const hist = { page: pageName};
	if (hash != '') {
		state.params.hash = hash;
	}
	console.log('navigatine: ' + pageName + ' with hash: ' + hash);
	window.history.pushState(state, pageName, `${pageName}`);
	openPage(state);
}

export function open(state, firebaseEnv = null) {
	document.body.innerHTML = html;
	//console.log('OPEN() INDEX', state);
	defaultPage(state.params);
	if (firebaseEnv.auth.currentUser) {
		//console.log('logged in style');
		clogin();
	} else {
		//console.log('not logged in style');
		loginPage();
	}
	switchTheme();
	return Promise.resolve();
}

export function close() {
	return Promise.resolve();
}