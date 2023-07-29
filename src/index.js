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
} from './key';

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
        console.log('user signed in', user);
        //signedIn(user);
    } else {
        console.log('user signed out');
    }
});

// Router state
let currentPage;
let currentAction;
let currentParams = {darkTheme: true, firebaseEnv: {app: app, auth: auth, provider: provider }}

// The application shell
// Here it's only a color, but it could be your title bar with logo.
var title = document.getElementById('title');
if (title) {
	title.src = currentParams.darkTheme ? imageUrl1 : imageUrl2;
}
var icon = document.getElementById('icon');
icon.href = favi;

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
export function navigate(pageName, params = null) {
	if (params === null) {
		params = currentParams;
	}
	const state = { page: pageName, params: params };
	window.history.pushState(state, pageName, `${pageName}`);
	openPage(state);
}