import favi from '../images/favi16.ico';

import { navigate } from './index.js';

import switchTheme from './SwitchTheme';'./SwitchTheme.js';
// The application shell with shared visual components
export default function defaultPage() {
   
	//switchTheme(currentParams.darkTheme);
	var icon = document.getElementById('icon');
	icon.href = favi;
	//there should be a nav on every page, grab it and add navigate(element.title + '.html', currentParams) to each element
	if (document.getElementById('nav')) {
		var nav = document.getElementById('nav');
		var navElements = nav.getElementsByClassName('Btn');
		for (var i = 0; i < navElements.length; i++) {
			navElements[i].addEventListener('click', function() {
				navigate(this.id, window.location.hash);
			});
		}
	}
	
	import('../shared/LoginStyle.js').then((module) => { module.default(); });
	switchTheme();
}