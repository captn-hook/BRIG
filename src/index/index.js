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
    config
} from '../key';

import {
	default as html
} from "./index.html";

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: 'brig-b2ca3.firebaseapp.com',
    projectId: 'brig-b2ca3',
    storageBucket: 'brig-b2ca3.appspot.com',
    messagingSenderId: '536591450814',
    appId: '1:536591450814:web:40eb73d5b1bf09ce36d4ef',
    measurementId: 'G-0D9RW0VMCQ'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

// Router state
let currentPage;
let currentAction;
let currentParams = { firebaseEnv: { app: app, provider: provider, auth: auth, }, darkTheme: true };

// The application shell with shared visual components
export function defaultPage(params)
{
	//if params is nothing, fuck
	if (!params) {
		console.error('params is undefined');
		params = currentParams;
	}
	var title = document.getElementById('title');
	title.src = params.darkTheme ? imageUrl1 : imageUrl2;
	title.addEventListener('click', function() {
		console.log('TH clicked');
		params.darkTheme = !params.darkTheme;
		switchTheme(params.darkTheme);
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
				navigate(this.id, params);
			});
		}
	}
}

export function loginPage(params) {
	//remove the account button and replace with login buttons
	var account = document.getElementById('account');
	var classes = account.className.split(' ');
	//account.remove();
	//get nav
	var nav = document.getElementById('nav');
	import('../shared/Log.js').then((module) => {
		console.log('module: ' + module.emailLoginButton);
		var elogin = module.emailLoginButton(params, classes);
		var login = module.googleLoginButton(params);
		console.log('login: ' + login);
		nav.appendChild(elogin);
		nav.appendChild(login);
	}).catch((error) => { console.log(error); });		
}

bootstrapAsync(getCurrentPage());

//login functions
function clogin() {
	//import loginstyle from '../shared/Log.js';
	import('../shared/Log.js').then((module) => { module.loginStyle(); }).catch((error) => { console.log(error); });
	//import sitelist and add to params
	
}

onAuthStateChanged(currentParams.firebaseEnv.auth, (user) => {

    if (user) {
		console.log('logged in', currentParams.user);
		clogin();
    } else {
		console.log('not logged in');
		if (regMatchPath(location.pathname) == '') {
			loginPage(currentParams);
		}
    }
});

export function switchTheme(darkTheme) {
	//change the logo url
	title.src = darkTheme ? imageUrl1 : imageUrl2;
	var mode = [darkTheme ? 'Light' : 'Dark', darkTheme ? 'Dark' : 'Light'];
	var elements = document.querySelectorAll('[class*=' + mode[0] + ']');
	for (var i = 0; i < elements.length; i++) {
		elements[i].className = elements[i].className.replace(mode[0], mode[1]);
	}
}

// Bind router to events (modern browsers only)
function registerRouter() {
	window.addEventListener("popstate", event => {
		console.log('popstate');
		openPage(event.state || {
			page: getCurrentPage(),
			params: currentParams
		});
	});
}

export function bootstrapAsync(pageName) {
	currentAction = Promise.resolve();
	console.log('boots: ' + pageName);
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
	console.log('match: ' + match);
	if (match) {
		//check match[1] against known pages
		if (pages.includes(match[1])) {
			console.log('match[1]: ' + match[1]);
			return match[1];
		}
	}
	console.log('no match, returning index ' + match);
	return 'index';
}

// get current page from URL
export function getCurrentPage() {
	console.log('pathname: ' + location.pathname);
	let mtch = regMatchPath(location.pathname);
	//enforce match on location.pathname
	return mtch;
}

// Start loading loading page
//const loadingPage = import("./loading/page");
// Router logic for loading and opening a page.
function openPage(state) {
	console.log('OPEN PAGING: ' + state);
	console.log('OPEN Params: ' + state.params);
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
			console.log('currentPage: ' + currentPage);
			return currentPage.open(state);
		})
		// Display error page
		.catch(err => {
			console.error(err);
			return import("../index/index")
				.then(newPage => {
					currentPage = newPage;
					console.log('currentPage ERR: ' + currentPage);
					return currentPage.open(err);
				});
		});
	return currentAction;
}

// Router logic, Called by pages
// Starts navigating to another page
export function navigate(pageName, params) {
	const state = { page: pageName, params: params };
	const hist = { page: pageName};
	console.log('navigatine: ' + pageName);
	window.history.pushState(hist, pageName, `${pageName}`);
	openPage(state);
}

export function open(state) {
	document.body.innerHTML = html;
	console.log('OPEN() INDEX', state);
	defaultPage(state.params);
	if (state.params.firebaseEnv.auth.currentUser) {
		clogin();
	}
	//loginPage();
	return Promise.resolve();
}

export function close() {
	return Promise.resolve();
}