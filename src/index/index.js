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
export function defaultPage(params)
{
	//if params is nothing, error
	if (!params) {
		console.error('params is undefined');
		params = currentParams;
	}

	var title = document.getElementById('title');
	title.src = currentParams.darkTheme ? imageUrl1 : imageUrl2;

	title.addEventListener('click', function() {
		console.log('TH clicked');
		currentParams.darkTheme = !currentParams.darkTheme;
		switchTheme(currentParams.darkTheme);
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
				navigate(this.id, currentParams);
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
	
	import('../shared/Log.js').then((module) => {
		console.log('module: ' + module.emailLoginButton);
		var elogin = module.emailLoginButton(classes);

		var login = module.googleLoginButton();

		console.log('login: ' + login);
			
		nav.appendChild(login);
		nav.appendChild(elogin);
	}).catch((error) => { console.log(error); });		
}

bootstrapAsync(getCurrentPage());

//login functions
function clogin() {
	//import loginstyle from '../shared/Log.js';
	import('../shared/Log.js').then((module) => { module.loginStyle(); }).catch((error) => { console.log(error); });
}

	
onAuthStateChanged(currentParams.firebaseEnv.auth, (user) => {

    if (user) {
		//user is logged in
		clogin(currentParams, user);
		
		currentParams.user = user;
		console.log('logged in', currentParams.user);
    } else {
		//load login page
		console.log('not logged in');
		//if regmatch is index, turn homepage to expedited login
		if (regMatchPath(location.pathname) == '') {
			loginPage();
		}
    }
});

function switchTheme(darkTheme) {
	console.log('switching theme??' + darkTheme);
	console.log('darkTheme2: ' + currentParams.darkTheme);
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
	console.log('match: ' + match);
	if (match) {
		//check match[1] against known pages
		if (pages.includes(match[1])) {
			console.log('match[1]: ' + match[1]);
			return match[1];
		}
	}
	console.log('no match, returning index' + match);
	return '';
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
	console.log('state: ' + state);
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
	window.history.pushState(hist, pageName, `${pageName}`);
	openPage(state);
}

export function open(state) {
	document.body.innerHTML = html;
	console.log('open', state);

	defaultPage(state.params);
	//loginPage();

	return Promise.resolve();
}

export function close() {
	return Promise.resolve();
}