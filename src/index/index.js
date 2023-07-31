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


if (currentParams) {
	//defined
} else {
	//not defined
	currentParams = { darkTheme: true };
}

// The application shell with shared visual components
export function defaultPage(nav = true) {

	var title = document.getElementById('title');
	title.src = currentParams.darkTheme ? imageUrl1 : imageUrl2;

	title.addEventListener('click', () => {
		currentParams.darkTheme = !currentParams.darkTheme;
		switchTheme(currentParams.darkTheme);
	});

	switchTheme(currentParams.darkTheme);

	var icon = document.getElementById('icon');
	icon.href = favi;

	//there should be a nav on every page, grab it and add navigate(element.title + '.html', currentParams) to each element
	if (nav && document.getElementById('nav')) {
		var nav = document.getElementById('nav');
		var navElements = nav.getElementsByClassName('Btn');
		for (var i = 0; i < navElements.length; i++) {
			navElements[i].addEventListener('click', function() {
				navigate(this.id, currentParams);
			});
		}
	}
}

bootstrapAsync(getCurrentPage());

onAuthStateChanged(auth, (user) => {
    if (user) {
		//remove restricted classes for logged in users
		var elements = document.querySelectorAll('[class*="restricted"]');
		for (var i = 0; i < elements.length; i++) {
			elements[i].className = elements[i].className.replace('restricted', '');
		}
    } else {
		if (window.location.pathname == '/viewer' || window.location.pathname == '/editor') {
			window.location.href = '/';
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
	//we only want to allow one directory deep and only editor, viewer, and account
	//otherwise we will redirect to website root
	if (location.pathname == '/viewer' || location.pathname == '/editor' || location.pathname == '/account') {
		return location.pathname.substring(1);
	} else if (location.pathname == '/') {
		return 'index';
	} else {
		window.location.href = '/';
	}
}

// Start loading loading page
//const loadingPage = import("./loading/page");
// Router logic for loading and opening a page.
function openPage(state) {
	//switchTheme(state.params.darkTheme);
	const pageName = state.page;
	currentAction = currentAction
		// Close the current page
		.then(() => currentPage && currentPage.close())
		// Start loading the next page
		.then(() => import(`../${pageName}/${pageName}`))
		// Open the next page
		.then(newPage => {
			currentPage = newPage;
			return currentPage.open(state);
		})
		// Display error page
		.catch(err => {
			console.error(err);
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
export function navigate(pageName, params) {
	const state = { page: pageName, params: params };
	const hist = { page: pageName};
	window.history.pushState(hist, pageName, `${pageName}`);
	openPage(state);
}

export function open(state) {
	document.body.innerHTML = html;
	defaultPage();
	return Promise.resolve();
}

export function close() {
	return Promise.resolve();
}