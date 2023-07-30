import '../style.css';
import imageUrl1 from '../images/logo.png';
import imageUrl2 from '../images/logoblack.png';
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
var darkTheme = true;
var title = document.getElementById('title');
title.src = darkTheme ? imageUrl1 : imageUrl2;

var icon = document.getElementById('icon');
icon.href = favi;

bootstrapAsync(getCurrentPage());

export function bootstrapAsync(pageName) {
	currentAction = Promise.resolve();
	openPage({
		page: pageName,
		params: currentParams
	})
	registerRouter();
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('user signed in', user);
        //signedIn(user);
		if (window.location.pathname != '/viewer.html' || window.location.pathname != '/editor.html' || window.location.pathname != '/account.html') {
			window.location.href = 'viewer.html';
		}
    } else {
		if (window.location.pathname == '/viewer.html' || window.location.pathname == '/editor.html') {
			window.location.href = 'index.html';
		}
        console.log('user signed out');
    }
});

// Bind router to events (modern browsers only)
function registerRouter() {
	window.addEventListener("popstate", event => {
		openPage(event.state || {
			page: getCurrentPage(),
			params: currentParams
		});
	});
}

// get current page from URL
export function getCurrentPage() {
	var m = /([^\/]+)\.html/.exec(location.pathname);
	return m ? m[1] : 'account';
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
		.then(() => import(`./${pageName}/${pageName}`))
		// Open the next page
		.then(newPage => {
			currentPage = newPage;
			return currentPage.open(state);
		})
	return currentAction;
}

// Router logic, Called by pages
// Starts navigating to another page
export function navigate(pageName, params = null) {
	console.log('navigating to', pageName, params);
	if (params === null) {
		params = currentParams;
	}
	const state = { page: pageName, params: params };
	const hist = { page: pageName};
	window.history.pushState(hist, pageName, `${pageName}`);
	console.log('navigating to', state);
	openPage(state);
}

export function open(state) {
	console.log('home page open');
	return Promise.resolve();
}

export function close() {
	console.log('home page close');
	return Promise.resolve();
}