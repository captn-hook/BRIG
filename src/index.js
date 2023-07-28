//"use strict";

//import offlineRuntime from "offline-plugin/runtime";
import './style.css';
import imageUrl1 from './images/logo.png';
import imageUrl2 from './images/logoblack.png';
import favi from './images/favi16.ico';

// Router state
let currentPage;
let currentAction;

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
            console.log("bootstrap(page) currentPage.open() then");
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
	}).then(() => {
        //do nothing
        console.log("bootstrapAsync(pageName) openPage then");
		//offlineRuntime.install();
	});
	registerRouter();
}

// Bind router to events (modern browsers only)
function registerRouter() {
	window.addEventListener("popstate", event => {
		openPage(event.state || {
			page: getCurrentPage()
		});
	});
}

// get current page from URL
export function getCurrentPage() {
	var m = /([^\/]+)\.html/.exec(location.pathname);
	console.log("getCurrentPage() " + m ? m[1] : "unknown");
	return m ? m[1] : "unknown";
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
			return currentPage.open();
		})
		// Display error page
		.catch(err => {
			return import("./error/page")
				.then(newPage => {
					currentPage = newPage;
					return currentPage.open(err);
				});
		});
	return currentAction;
}

// Router logic, Called by pages
// Starts navigating to another page
export function navigate(pageName) {
	const state = { page: pageName };
	window.history.pushState(state, pageName, `${pageName}.html`);
	openPage(state);
}