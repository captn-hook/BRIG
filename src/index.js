//"use strict";

//import offlineRuntime from "offline-plugin/runtime";
import './style.css';
import imageUrl1 from './images/logo.png';
import imageUrl2 from './images/logoblack.png';
import favi from './images/favi16.ico';

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

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        //login();
        signedIn(user);
    } else {
        // User is signed out
        // ...
    }
});

// Router state
let currentPage;
let currentAction;
let currentParams;

// The application shell
// Here it's only a color, but it could be your title bar with logo.
var title = document.getElementById('title');
title.src = imageUrl1;

var icon = document.getElementById('icon');
icon.href = favi;

// Bootstraping for Page Shell.
// "page" is the already available page
export function bootstrap(page) {
	currentPage = page;
	currentAction = currentPage.open()
		.then(() => {
            //do nothing
            //offlineRuntime.install();
		});
	registerRouter();
}

// Bootstrapping for App Shell (or hybrid Page Shell page)
// "pageName" is only the name of the page.
// This page will be loaded while bootstrapping
export function bootstrapAsync(pageName) {
	currentAction = Promise.resolve();
	openPage({
		page: pageName
	});
	registerRouter();
}

// Bind router to events (modern browsers only)
function registerRouter() {
	window.addEventListener("popstate", event => {
		openPage(event.state || {
			page: getCurrentPage(),
			auth: null,
			params: {}
		});
	});
}

// get current page from URL
export function getCurrentPage() {
	var m = /([^\/]+)\.html/.exec(location.pathname);
	return m ? m[1] : "unknown";
}

// Start loading loading page
//const loadingPage = import("./loading/page");
// Router logic for loading and opening a page.
function openPage(state) {
	console.log('opening page', state);
	const pageName = state.page;
	currentAction = currentAction
		// Close the current page
		.then(() => currentPage && currentPage.close())
		// Start loading the next page
		.then(() => import(`./${pageName}/page`))
		// Display the loading page while loading the next page
		/*.then(() => loadingPage
			.then(loading => loading.open(pageName)
				.then(() => import(`./${pageName}/page`))
				.then(page => loading.close().then(() => page))
		))*/
		// Open the next page
		.then(newPage => {
			currentPage = newPage;
			return currentPage.open(state);
		})
		// Display error page
		.catch(err => {
			return import("./error/page")
				.then(newPage => {
					currentPage = newPage;
					return currentPage.open(state);
				});
		});
	return currentAction;
}

// Router logic, Called by pages
// Starts navigating to another page
export function navigate(pageName, auth = null, params = {}) {
	const state = { page: pageName, auth: auth, params: params };
	window.history.pushState(state, pageName, `${pageName}`);
	openPage(state);
}