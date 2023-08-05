
import imageUrl1 from '../images/logoDark.png';
import imageUrl2 from '../images/logoLight.png';

var darkTheme = true;

function switchT() {
	//change the logo url
	title.src = darkTheme ? imageUrl1 : imageUrl2;
	var mode = [darkTheme ? 'Light' : 'Dark', darkTheme ? 'Dark' : 'Light'];
	var elements = document.querySelectorAll('[class*=' + mode[0] + ']');
	for (var i = 0; i < elements.length; i++) {
		elements[i].className = elements[i].className.replace(mode[0], mode[1]);
	}
}

export default function switchTheme() {
    var title = document.getElementById('title');
    if (title) {
        title.src = darkTheme ? imageUrl1 : imageUrl2;
        title.addEventListener('click', function() {
            //console.log('TH clicked');
            darkTheme = !darkTheme;
            switchT();
        });
    }
}