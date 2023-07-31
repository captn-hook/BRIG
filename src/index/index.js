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
let currentParams;

// The application shell with shared visual components
currentParams = { darkTheme: true };
var title = document.getElementById('title');
title.src = currentParams.darkTheme ? imageUrl1 : imageUrl2;
title.addEventListener('click', () => {
	currentParams.darkTheme = !currentParams.darkTheme;
	switchTheme(currentParams.darkTheme);
});

var icon = document.getElementById('icon');
icon.href = favi;

bootstrapAsync(getCurrentPage());

onAuthStateChanged(auth, (user) => {
    if (user) {
        //signedIn(user);
		if (window.location.pathname != '/viewer.html' || window.location.pathname != '/editor.html' || window.location.pathname != '/account.html') {
			window.location.href = 'viewer.html';
		}
    } else {
		if (window.location.pathname == '/viewer.html' || window.location.pathname == '/editor.html') {
			window.location.href = 'index.html';
		}
    }
});

function switchTheme(darkTheme) {
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
		openPage(event.state || {
			page: getCurrentPage(),
			params: currentParams
		});
	});
}

export function bootstrapAsync(pageName) {
	currentAction = Promise.resolve();
	openPage({
		page: pageName,
		params: currentParams
	})
	registerRouter();
}

// get current page from URL
export function getCurrentPage() {

	//if location.pathname isnt in the list of pages, redirect 
	if (location.pathname != '/viewer.html' && location.pathname != '/editor.html' && location.pathname != '/account.html' && location.pathname != '/index.html') {
		location.pathname = '/index.html';
	}
	
	var m = /([^\/]+)\.html/.exec(location.pathname);
	return m ? m[1] : 'index';
}

// Start loading loading page
//const loadingPage = import("./loading/page");
// Router logic for loading and opening a page.
function openPage(state) {
	const pageName = state.page;
	currentAction = currentAction
		// Close the current page
		.then(() => currentPage && currentPage.close())
		// Start loading the next page
		.then(() => import(`../${pageName}/${pageName}`))
		// Display the loading page while loading the next page
		/*.then(() => loadingPage
			.then(loading => loading.open(pageName)
				.then(() => import(`./${pageName}/page`))
				.then(page => loading.close().then(() => page))
		))*/
		// Open the next page
		.then(newPage => {
			currentPage = newPage;
			return currentPage.open();
		})
		// Display error page
		.catch(err => {
			return import("../index/index")
				.then(newPage => {
					currentPage = newPage;
					return currentPage.open(err);
				});
		});
	return currentAction;
}

// Router logic, Called by pages
// Starts navigating to another page
export function navigate(pageName, params = null) {
	if (params === null) {
		params = currentParams;
	}
	const state = { page: pageName, params: params };
	const hist = { page: pageName};
	window.history.pushState(hist, pageName, `${pageName}`);
	openPage(state);
}

export function open(state) {
	return Promise.resolve();
}

export function close() {
	return Promise.resolve();
}